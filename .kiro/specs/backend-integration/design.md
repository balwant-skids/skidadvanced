# Design Document

## Overview

This design document outlines the architecture for integrating SKIDS Advanced with a production backend stack using the "data lives on device" pattern. The stack consists of Turso (libSQL) for minimal cloud storage, client-side SQLite/IndexedDB for heavy data, Clerk authentication, Cloudflare R2 for file storage, and Firebase FCM for push notifications. This architecture maximizes free tier usage by keeping cloud database minimal while storing full user data on their devices.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SKIDS ADVANCED - TURSO HYBRID                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CLIENTS                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Super Admin  │  │   Clinic     │  │   Parent     │              │
│  │  Dashboard   │  │   Manager    │  │   PWA App    │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                 │                       │
│         └─────────────────┼─────────────────┘                       │
│                           │                                         │
│                           ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js API Routes                        │   │
│  │              (Server Components + Route Handlers)            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                 │                 │                       │
│         ▼                 ▼                 ▼                       │
│  ┌───────────┐     ┌───────────┐     ┌───────────┐                 │
│  │   Clerk   │     │   Turso   │     │Cloudflare │                 │
│  │   Auth    │     │  (libSQL) │     │    R2     │                 │
│  └───────────┘     └───────────┘     └───────────┘                 │
│                           │                                         │
│                           ▼                                         │
│                    ┌───────────┐                                    │
│                    │  Firebase │                                    │
│                    │    FCM    │                                    │
│                    └───────────┘                                    │
│                                                                     │
│  TURSO CLOUD (Minimal - ~1KB per user)                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ├── User identity & clinic linkage                         │   │
│  │  ├── Clinic codes & whitelist                               │   │
│  │  ├── Subscription status                                    │   │
│  │  └── Sync events (purged monthly)                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  PARENT DEVICE (Heavy Data - FREE)                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  IndexedDB / sql.js (Full SQLite in browser)                 │   │
│  │  ├── Full child profiles & health history                   │   │
│  │  ├── All assessments, appointments, reports                 │   │
│  │  ├── Messages, campaigns, educational content               │   │
│  │  └── Offline change queue                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Authentication Layer (Clerk)

```typescript
// lib/clerk.ts
interface ClerkConfig {
  publishableKey: string;
  secretKey: string;
  signInUrl: string;
  signUpUrl: string;
  afterSignInUrl: string;
  afterSignUpUrl: string;
}

// Middleware for route protection
interface AuthMiddleware {
  publicRoutes: string[];
  protectedRoutes: string[];
  roleBasedRoutes: Record<UserRole, string[]>;
}
```

### 2. Database Layer (Turso + Drizzle)

```typescript
// lib/db.ts - Turso Cloud Connection
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

interface TursoConfig {
  url: string;      // libsql://skidsadvanced-satishskid.aws-ap-south-1.turso.io
  authToken: string;
}

// Cloud database client (minimal data)
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const cloudDb = drizzle(tursoClient);

// lib/client-db.ts - Client-side SQLite
interface ClientDatabase {
  initialize(): Promise<void>;
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<void>;
  getLastSyncTime(): Promise<number>;
  setLastSyncTime(timestamp: number): Promise<void>;
}
```

### 3. Storage Layer (Cloudflare R2)

```typescript
// lib/storage.ts
interface StorageService {
  uploadFile(file: File, path: string): Promise<string>;
  getSignedUrl(path: string, expiresIn: number): Promise<string>;
  deleteFile(path: string): Promise<void>;
  listFiles(prefix: string): Promise<FileMetadata[]>;
}

interface FileMetadata {
  key: string;
  size: number;
  lastModified: Date;
  contentType: string;
}
```

### 4. Notification Layer (Firebase FCM)

```typescript
// lib/notifications.ts
interface NotificationService {
  sendToUser(userId: string, notification: Notification): Promise<void>;
  sendToTopic(topic: string, notification: Notification): Promise<void>;
  subscribeToTopic(token: string, topic: string): Promise<void>;
}

interface Notification {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}
```

### 5. Offline Sync Layer (IndexedDB)

```typescript
// lib/offline-sync.ts
interface OfflineSyncService {
  syncUserData(userId: string): Promise<void>;
  getFromCache<T>(key: string): Promise<T | null>;
  saveToCache<T>(key: string, data: T): Promise<void>;
  queueOfflineAction(action: OfflineAction): Promise<void>;
  processOfflineQueue(): Promise<void>;
}

interface OfflineAction {
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: unknown;
  timestamp: Date;
}
```

## Data Models

### Turso Cloud Schema (Minimal - Identity & Sync)

```sql
-- TURSO CLOUD DATABASE (libSQL/SQLite)
-- Keep minimal: ~1KB per user, 9GB free tier = millions of users

-- User identity (linked to Clerk)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'parent', -- super_admin, clinic_manager, parent
  clinic_id TEXT REFERENCES clinics(id),
  fcm_token TEXT,
  last_sync_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Clinic codes (shared, small)
CREATE TABLE clinics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  phone TEXT,
  email TEXT,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Parent whitelist (small)
CREATE TABLE whitelist (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES clinics(id),
  email TEXT NOT NULL,
  phone TEXT,
  is_registered INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(clinic_id, email)
);

-- Subscription status only (not history)
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id),
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, cancelled, expired
  expires_at INTEGER,
  razorpay_id TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Care plans (shared reference)
CREATE TABLE care_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in paise
  billing_cycle TEXT DEFAULT 'monthly',
  features TEXT, -- JSON array
  clinic_id TEXT REFERENCES clinics(id), -- null = global
  is_active INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Sync events (purged after 30 days)
CREATE TABLE sync_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  entity TEXT NOT NULL, -- child, assessment, appointment, report, message
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL, -- create, update, delete
  data TEXT, -- JSON payload
  created_at INTEGER DEFAULT (unixepoch())
);

-- Indexes for performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_clinic_id ON users(clinic_id);
CREATE INDEX idx_whitelist_email ON whitelist(email);
CREATE INDEX idx_sync_events_user ON sync_events(user_id, created_at);
```

### Client-Side Schema (Heavy Data - Lives on Device)

```sql
-- CLIENT DATABASE (IndexedDB via sql.js or idb)
-- Full data stored locally, synced incrementally

-- Children (full profiles)
CREATE TABLE children (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  gender TEXT,
  health_metrics TEXT, -- JSON blob
  created_at INTEGER,
  updated_at INTEGER,
  synced_at INTEGER
);

-- Assessments (full history)
CREATE TABLE assessments (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  type TEXT NOT NULL,
  results TEXT NOT NULL, -- JSON blob
  score INTEGER,
  recommendations TEXT, -- JSON array
  completed_at INTEGER,
  notes TEXT,
  synced_at INTEGER
);

-- Appointments (full history)
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  type TEXT NOT NULL,
  scheduled_at INTEGER NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  reminder_sent INTEGER DEFAULT 0,
  created_at INTEGER,
  synced_at INTEGER
);

-- Reports (metadata, files cached separately)
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at INTEGER,
  cached_locally INTEGER DEFAULT 0,
  synced_at INTEGER
);

-- Messages (full conversation history)
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL,
  child_id TEXT,
  content TEXT NOT NULL,
  is_from_parent INTEGER NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at INTEGER,
  synced_at INTEGER
);

-- Campaigns (cached for display)
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- JSON
  media_url TEXT,
  status TEXT,
  start_date INTEGER,
  end_date INTEGER,
  synced_at INTEGER
);

-- Offline action queue
CREATE TABLE offline_queue (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL, -- create, update, delete
  entity TEXT NOT NULL,
  entity_id TEXT,
  payload TEXT NOT NULL, -- JSON
  created_at INTEGER DEFAULT (unixepoch()),
  retry_count INTEGER DEFAULT 0
);

-- Sync metadata
CREATE TABLE sync_meta (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

### Drizzle ORM Schema (for Turso Cloud)

```typescript
// lib/schema.ts - Drizzle ORM Schema for Turso

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role').notNull().default('parent'),
  clinicId: text('clinic_id').references(() => clinics.id),
  fcmToken: text('fcm_token'),
  lastSyncAt: integer('last_sync_at'),
  createdAt: integer('created_at').default(Date.now()),
  updatedAt: integer('updated_at').default(Date.now()),
});

// Clinics table
export const clinics = sqliteTable('clinics', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').unique().notNull(),
  phone: text('phone'),
  email: text('email'),
  isActive: integer('is_active').default(1),
  createdAt: integer('created_at').default(Date.now()),
});

// Whitelist table
export const whitelist = sqliteTable('whitelist', {
  id: text('id').primaryKey(),
  clinicId: text('clinic_id').notNull().references(() => clinics.id),
  email: text('email').notNull(),
  phone: text('phone'),
  isRegistered: integer('is_registered').default(0),
  createdAt: integer('created_at').default(Date.now()),
});

// Subscriptions table
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').unique().notNull().references(() => users.id),
  planId: text('plan_id').notNull(),
  planName: text('plan_name').notNull(),
  status: text('status').notNull().default('active'),
  expiresAt: integer('expires_at'),
  razorpayId: text('razorpay_id'),
  createdAt: integer('created_at').default(Date.now()),
  updatedAt: integer('updated_at').default(Date.now()),
});

// Care plans table
export const carePlans = sqliteTable('care_plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  billingCycle: text('billing_cycle').default('monthly'),
  features: text('features'), // JSON string
  clinicId: text('clinic_id').references(() => clinics.id),
  isActive: integer('is_active').default(1),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at').default(Date.now()),
});

// Sync events table (purged monthly)
export const syncEvents = sqliteTable('sync_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  entity: text('entity').notNull(),
  entityId: text('entity_id').notNull(),
  action: text('action').notNull(),
  data: text('data'), // JSON string
  createdAt: integer('created_at').default(Date.now()),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Clinic = typeof clinics.$inferSelect;
export type NewClinic = typeof clinics.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type CarePlan = typeof carePlans.$inferSelect;
export type SyncEvent = typeof syncEvents.$inferSelect;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Clinic Code Uniqueness
*For any* two clinics in the system, their clinic codes SHALL be different.
**Validates: Requirements 2.1**

### Property 2: Parent-Clinic Linkage Integrity
*For any* registered parent, the parent SHALL be linked to exactly one clinic via a valid clinic code.
**Validates: Requirements 2.4**

### Property 3: Whitelist Enforcement
*For any* parent registration attempt with a clinic code, the parent's email SHALL exist in that clinic's whitelist.
**Validates: Requirements 3.1, 3.2**

### Property 4: Subscription State Consistency
*For any* parent with an active subscription, the subscription's end date SHALL be in the future or null.
**Validates: Requirements 4.2, 4.3**

### Property 5: Child-Parent Ownership
*For any* child profile, the child SHALL belong to exactly one parent profile.
**Validates: Requirements 5.1**

### Property 6: Report-Child Association
*For any* uploaded report, the report SHALL be linked to exactly one child profile.
**Validates: Requirements 6.1**

### Property 7: Offline Data Freshness
*For any* cached data in IndexedDB, the data SHALL be synchronized with the server within 6 hours of the last online connection.
**Validates: Requirements 10.1, 10.3**

### Property 8: Authentication Session Validity
*For any* protected route access, the request SHALL contain a valid Clerk session token.
**Validates: Requirements 1.3, 1.4**

### Property 9: Role-Based Access Control
*For any* admin-only operation, the requesting user SHALL have super_admin or clinic_manager role.
**Validates: Requirements 2.1, 3.1**

### Property 10: Notification Delivery
*For any* scheduled reminder within 24 hours, a push notification SHALL be sent to the parent's registered FCM token.
**Validates: Requirements 7.2**

## Error Handling

### Authentication Errors
- Invalid/expired Clerk token → Redirect to sign-in
- Missing role permissions → Return 403 Forbidden
- Account not found → Prompt to register

### Database Errors
- Connection timeout → Retry with exponential backoff (max 3 attempts)
- Constraint violation → Return descriptive error message
- Query timeout → Log and return 504 Gateway Timeout

### Storage Errors
- Upload failure → Retry once, then return error
- File not found → Return 404 with cache invalidation
- Quota exceeded → Alert admin, return 507 Insufficient Storage

### Offline Sync Errors
- Conflict detected → Server data wins, log conflict
- Sync failure → Queue for retry, continue with cached data
- Cache corruption → Clear cache, force full sync

## Testing Strategy

### Unit Testing (Jest)
- Repository methods with mocked Prisma client
- Service layer business logic
- Utility functions (date formatting, validation)
- Offline sync queue operations

### Property-Based Testing (fast-check)
- Clinic code generation uniqueness
- Whitelist validation logic
- Subscription state transitions
- Data sync conflict resolution

### Integration Testing
- API routes with test database
- Clerk authentication flow (mocked)
- File upload to R2 (mocked)
- Push notification delivery (mocked)

### E2E Testing (Playwright)
- Parent registration flow
- Subscription purchase flow
- Report viewing and download
- Offline mode functionality

### Testing Libraries
- **Unit/Integration**: Jest + @testing-library/react
- **Property-Based**: fast-check
- **E2E**: Playwright
- **Mocking**: MSW (Mock Service Worker)

### Test Annotation Format
Each property-based test must include:
```typescript
/**
 * Feature: backend-integration, Property {number}: {property_text}
 * Validates: Requirements {X.Y}
 */
```
