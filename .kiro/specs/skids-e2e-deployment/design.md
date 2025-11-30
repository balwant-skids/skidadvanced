# Design Document

## Overview

This design document outlines the technical approach for end-to-end testing and production deployment of the SKIDS Advanced Digital Parenting Platform. The platform is already fully implemented with 45+ API endpoints, multi-tenant clinic management, offline-first capabilities, and comprehensive backend services. This phase focuses on:

1. **E2E Testing**: Implementing Playwright tests to validate all user workflows
2. **Property-Based Testing**: Ensuring existing property tests cover all correctness properties
3. **Production Deployment**: Deploying to Cloudflare Pages with Turso edge database
4. **Monitoring & Observability**: Setting up health checks, logging, and performance monitoring
5. **Security Hardening**: Implementing rate limiting, CORS, and security headers
6. **Performance Optimization**: Optimizing bundle size, image loading, and API response times

## Architecture

### Current System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   SKIDS ADVANCED PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FRONTEND (Next.js 14 + React 18)                               │
│  ├── Public Pages (/, /sign-in, /sign-up)                       │
│  ├── Parent Dashboard (/dashboard/*)                            │
│  ├── Admin Dashboard (/admin/*)                                 │
│  ├── Discovery Modules (16 body systems)                        │
│  └── Intervention Modules (8 health areas)                      │
│                                                                  │
│  BACKEND (Next.js API Routes)                                   │
│  ├── Authentication (Clerk)                                     │
│  ├── Database (Prisma + Turso LibSQL)                          │
│  ├── Storage (Cloudflare R2)                                    │
│  └── Notifications (Firebase FCM)                               │
│                                                                  │
│  OFFLINE SUPPORT (IndexedDB + Service Worker)                   │
│  ├── Data caching                                               │
│  ├── Sync queue                                                 │
│  └── PWA capabilities                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Production Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE EDGE                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Cloudflare Pages (Next.js SSR + Static Assets)            │ │
│  │  - Global CDN with 200+ edge locations                     │ │
│  │  - Automatic HTTPS with SSL certificates                   │ │
│  │  - Zero-downtime deployments                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Cloudflare R2 (Object Storage)                            │ │
│  │  - Reports, media assets, campaign content                 │ │
│  │  - S3-compatible API                                       │ │
│  │  - Encryption at rest                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │  Turso LibSQL  │  │  Clerk Auth    │  │  Firebase FCM    │  │
│  │  - Edge DB     │  │  - OAuth       │  │  - Push Notifs   │  │
│  │  - Replication │  │  - RBAC        │  │  - Reminders     │  │
│  └────────────────┘  └────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. E2E Testing Framework

**Technology**: Playwright with TypeScript

**Test Structure**:
```
tests/e2e/
├── auth/
│   ├── sign-in.spec.ts
│   ├── sign-up.spec.ts
│   └── oauth.spec.ts
├── parent/
│   ├── registration.spec.ts
│   ├── child-management.spec.ts
│   ├── appointments.spec.ts
│   └── reports.spec.ts
├── admin/
│   ├── clinic-management.spec.ts
│   ├── whitelist.spec.ts
│   └── campaigns.spec.ts
├── offline/
│   ├── cache.spec.ts
│   └── sync.spec.ts
└── fixtures/
    ├── test-data.ts
    └── helpers.ts
```

**Key Interfaces**:
```typescript
interface E2ETestContext {
  page: Page;
  browser: Browser;
  testUser: TestUser;
  testClinic: TestClinic;
}

interface TestUser {
  email: string;
  password: string;
  role: 'parent' | 'clinic_manager' | 'super_admin';
  clerkId?: string;
}

interface TestClinic {
  id: string;
  code: string;
  name: string;
}
```

### 2. Deployment Pipeline

**CI/CD Flow**:
```
1. Code Push → GitHub
2. GitHub Actions Trigger
3. Run Linting (ESLint, TypeScript)
4. Run Property-Based Tests (35 tests)
5. Run E2E Tests (Playwright)
6. Build Next.js Application
7. Deploy to Cloudflare Pages
8. Run Health Checks
9. Rollback if Health Checks Fail
```

**GitHub Actions Workflow**:
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run linting
      - Run property tests
      - Run E2E tests
      - Build application
      - Deploy to Cloudflare Pages
      - Run health checks
```

### 3. Monitoring and Observability

**Health Check Endpoint**:
```typescript
// /api/health
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: HealthStatus;
    storage: HealthStatus;
    auth: HealthStatus;
    notifications: HealthStatus;
  };
}

interface HealthStatus {
  status: 'up' | 'down';
  responseTime: number;
  message?: string;
}
```

**Logging Strategy**:
- Use structured logging with JSON format
- Log levels: ERROR, WARN, INFO, DEBUG
- Include request ID, user ID, and context in all logs
- Store logs in Cloudflare Workers KV for 30 days

### 4. Security Hardening

**Rate Limiting**:
```typescript
interface RateLimitConfig {
  windowMs: number;  // 15 minutes
  maxRequests: number;  // 100 requests per window
  blockDuration: number;  // 15 minutes
}
```

**CORS Configuration**:
```typescript
const corsConfig = {
  origin: [
    'https://skids-advanced.pages.dev',
    'https://www.skids-advanced.com'
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
};
```

**Security Headers**:
```typescript
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; ..."
};
```

## Data Models

All data models are already defined in the Prisma schema. Key models for this phase:

### SyncEvent Model (for offline sync tracking)
```prisma
model SyncEvent {
  id          String    @id @default(cuid())
  userId      String
  entity      String    // child, appointment, assessment
  entityId    String
  action      String    // create, update, delete
  data        String    // JSON stored as string
  processedAt DateTime?
  createdAt   DateTime  @default(now())
}
```

### Monitoring Models (to be added)
```prisma
model HealthCheckLog {
  id          String   @id @default(cuid())
  status      String   // healthy, degraded, unhealthy
  checks      String   // JSON of individual check results
  responseTime Int     // in milliseconds
  timestamp   DateTime @default(now())
}

model ErrorLog {
  id          String   @id @default(cuid())
  level       String   // error, warn, info
  message     String
  stack       String?
  context     String   // JSON with request details
  userId      String?
  timestamp   DateTime @default(now())
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Clinic Code Uniqueness
*For any* set of clinics, no two clinics should have the same clinic code
**Validates: Requirements 2.1**

### Property 2: Whitelist Enforcement
*For any* parent registration attempt, if the email is not in the clinic's whitelist, the registration should be rejected
**Validates: Requirements 2.2**

### Property 3: Clinic Data Isolation
*For any* clinic manager, they should only be able to access data (parents, children, reports) belonging to their own clinic
**Validates: Requirements 2.3, 2.5**

### Property 4: Parent-Clinic Association
*For any* parent registration with a valid clinic code, the parent should be correctly linked to that clinic
**Validates: Requirements 2.4**

### Property 5: Subscription Access Control
*For any* user with an expired or inactive subscription, they should not be able to access premium features
**Validates: Requirements 3.3**

### Property 6: Offline Data Availability
*For any* cached data in IndexedDB, it should be retrievable when the application is offline
**Validates: Requirements 4.1**

### Property 7: Offline Mutation Queuing
*For any* mutation performed while offline, it should be added to the sync queue and not lost
**Validates: Requirements 4.2**

### Property 8: Conflict Resolution Strategy
*For any* data conflict between client and server, the server version should win (server-wins strategy)
**Validates: Requirements 4.4**

### Property 9: File Storage Integrity
*For any* file uploaded to Cloudflare R2, it should be stored with correct metadata and be retrievable via signed URL
**Validates: Requirements 5.4**

### Property 10: Error Logging Completeness
*For any* error that occurs in the application, it should be logged with full stack trace and context
**Validates: Requirements 7.2**

### Property 11: Authentication Token Validation
*For any* request to a protected API route, it should be rejected if the authentication token is invalid or missing
**Validates: Requirements 8.1**

### Property 12: Data Encryption
*For any* sensitive data stored in the database, it should be encrypted using AES-256 encryption
**Validates: Requirements 8.2**

### Property 13: SQL Injection Prevention
*For any* user input used in database queries, it should be parameterized to prevent SQL injection attacks
**Validates: Requirements 8.3**

### Property 14: Rate Limiting Enforcement
*For any* IP address that exceeds the rate limit, subsequent requests should be blocked for 15 minutes
**Validates: Requirements 8.4**

### Property 15: CORS Policy Enforcement
*For any* cross-origin request, it should only be allowed if the origin is in the whitelist
**Validates: Requirements 8.5**

### Property 16: Signed URL Expiration
*For any* signed URL generated for report downloads, it should expire after the configured time period
**Validates: Requirements 9.2**

### Property 17: File Deletion Consistency
*For any* file deletion operation, both the R2 object and the database record should be removed
**Validates: Requirements 9.5**

## Error Handling

### Error Categories

1. **Client Errors (4xx)**
   - 400 Bad Request: Invalid input data
   - 401 Unauthorized: Missing or invalid authentication
   - 403 Forbidden: Insufficient permissions
   - 404 Not Found: Resource doesn't exist
   - 429 Too Many Requests: Rate limit exceeded

2. **Server Errors (5xx)**
   - 500 Internal Server Error: Unexpected server error
   - 502 Bad Gateway: External service unavailable
   - 503 Service Unavailable: Temporary service outage

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    requestId: string;
    timestamp: string;
  };
}
```

### Error Handling Strategy

1. **API Routes**: Wrap all route handlers in try-catch blocks
2. **External Services**: Implement retry logic with exponential backoff
3. **Database Operations**: Handle connection errors and timeouts gracefully
4. **File Operations**: Validate file types and sizes before processing
5. **Offline Sync**: Queue failed sync operations for retry

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests, property-based tests, and E2E tests:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property-Based Tests**: Verify universal properties across all inputs (35 existing tests)
- **E2E Tests**: Verify complete user workflows from UI to database

### Property-Based Testing

**Library**: fast-check (already installed)

**Configuration**: Each property test runs 100 iterations minimum

**Existing Property Tests** (all passing):
- clinic-code.property.test.ts (4 tests)
- whitelist.property.test.ts (5 tests)
- child-parent.property.test.ts (4 tests)
- subscription.property.test.ts (5 tests)
- report-child.property.test.ts (5 tests)
- notification.property.test.ts (5 tests)
- offline-sync.property.test.ts (7 tests)

**Test Tagging**: Each property test includes a comment:
```typescript
// Feature: skids-e2e-deployment, Property 1: Clinic Code Uniqueness
```

### E2E Testing

**Library**: Playwright

**Test Categories**:
1. Authentication flows (sign-in, sign-up, OAuth)
2. Parent workflows (registration, child management, appointments)
3. Admin workflows (clinic management, whitelist, campaigns)
4. Offline functionality (caching, sync, conflict resolution)
5. Report management (upload, download, offline access)

**Test Environment**:
- Use Playwright's built-in test fixtures
- Create test database with seed data
- Clean up test data after each test run
- Use Clerk test mode for authentication

### Performance Testing

**Metrics to Track**:
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- API response time < 200ms (p95)
- Initial bundle size < 200KB

**Tools**:
- Lighthouse CI for performance audits
- Playwright for load time measurements
- Custom API benchmarks for response times

## Deployment Strategy

### Environment Configuration

**Development**:
- Local SQLite database
- Mock payment gateway
- Local file storage
- Debug logging enabled

**Staging**:
- Turso staging database
- Razorpay test mode
- Cloudflare R2 staging bucket
- Info logging enabled

**Production**:
- Turso production database with edge replication
- Razorpay live mode
- Cloudflare R2 production bucket
- Error logging only

### Deployment Process

1. **Pre-Deployment**:
   - Run all tests (unit, property, E2E)
   - Build application with production optimizations
   - Generate source maps for error tracking

2. **Deployment**:
   - Deploy to Cloudflare Pages
   - Run database migrations (if any)
   - Update environment variables

3. **Post-Deployment**:
   - Run health checks
   - Verify critical user flows
   - Monitor error rates for 1 hour
   - Rollback if error rate > 1%

### Rollback Strategy

**Automatic Rollback Triggers**:
- Health check failures
- Error rate > 1%
- API response time > 1s (p95)

**Manual Rollback**:
- Use Cloudflare Pages deployment history
- Revert to previous stable version
- Notify team via Slack/email

## Performance Optimization

### Bundle Optimization

1. **Code Splitting**:
   - Split discovery modules into separate chunks
   - Lazy load intervention modules
   - Dynamic imports for admin dashboard

2. **Tree Shaking**:
   - Remove unused dependencies
   - Use ES modules for better tree shaking
   - Analyze bundle with webpack-bundle-analyzer

3. **Compression**:
   - Enable Brotli compression on Cloudflare
   - Minify JavaScript and CSS
   - Optimize images with WebP format

### Database Optimization

1. **Query Optimization**:
   - Use Prisma's query optimization features
   - Add indexes for frequently queried fields
   - Use select to fetch only needed fields

2. **Connection Pooling**:
   - Configure Turso connection pool size
   - Implement connection retry logic
   - Monitor connection usage

3. **Caching Strategy**:
   - Cache static data (care plans, campaigns) in memory
   - Use IndexedDB for client-side caching
   - Implement stale-while-revalidate pattern

### Image Optimization

1. **Format Optimization**:
   - Serve WebP images with JPEG fallback
   - Use responsive images with srcset
   - Lazy load images below the fold

2. **Size Optimization**:
   - Compress images with 80% quality
   - Generate multiple sizes for responsive images
   - Use Cloudflare Image Resizing

## Security Considerations

### Authentication Security

1. **Token Management**:
   - Use Clerk's secure token storage
   - Implement token refresh logic
   - Validate tokens on every request

2. **Session Security**:
   - Set secure cookie flags (httpOnly, secure, sameSite)
   - Implement session timeout (24 hours)
   - Clear sessions on logout

### Data Security

1. **Encryption**:
   - Encrypt sensitive data at rest (AES-256)
   - Use HTTPS for all connections
   - Encrypt file uploads before storing in R2

2. **Access Control**:
   - Implement role-based access control (RBAC)
   - Validate user permissions on every request
   - Audit access to sensitive data

### Input Validation

1. **Client-Side Validation**:
   - Use Zod for schema validation
   - Validate all form inputs
   - Sanitize user input

2. **Server-Side Validation**:
   - Re-validate all inputs on the server
   - Use parameterized queries for database operations
   - Implement rate limiting per endpoint

## Monitoring and Alerting

### Metrics to Monitor

1. **Application Metrics**:
   - Request rate (requests/second)
   - Error rate (errors/total requests)
   - Response time (p50, p95, p99)
   - Active users (concurrent sessions)

2. **Infrastructure Metrics**:
   - Database connection pool usage
   - R2 storage usage
   - CDN cache hit rate
   - Edge function execution time

3. **Business Metrics**:
   - User registrations per day
   - Active subscriptions
   - Report uploads per day
   - Appointment bookings per day

### Alerting Rules

1. **Critical Alerts** (immediate notification):
   - Error rate > 1%
   - API response time > 1s (p95)
   - Database connection failures
   - Health check failures

2. **Warning Alerts** (notification within 1 hour):
   - Error rate > 0.5%
   - API response time > 500ms (p95)
   - Storage usage > 80%
   - Unusual traffic patterns

### Logging Strategy

1. **Log Levels**:
   - ERROR: Application errors, exceptions
   - WARN: Potential issues, deprecated features
   - INFO: Important events, user actions
   - DEBUG: Detailed debugging information

2. **Log Format**:
```typescript
interface LogEntry {
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  timestamp: string;
  requestId: string;
  userId?: string;
  context: Record<string, any>;
  stack?: string;
}
```

3. **Log Storage**:
   - Store logs in Cloudflare Workers KV
   - Retain logs for 30 days
   - Export critical logs to external service (optional)

## Documentation Requirements

### Code Documentation

1. **README Files**:
   - Root README with project overview
   - Component READMEs for major features
   - API documentation with examples

2. **Inline Documentation**:
   - JSDoc comments for all public functions
   - Type definitions for all interfaces
   - Comments for complex logic

### Operational Documentation

1. **Deployment Runbook**:
   - Step-by-step deployment instructions
   - Environment variable configuration
   - Database migration procedures
   - Rollback procedures

2. **Troubleshooting Guide**:
   - Common error scenarios and solutions
   - Debugging techniques
   - Contact information for support

3. **Architecture Documentation**:
   - System architecture diagrams
   - Data flow diagrams
   - API endpoint documentation
   - Database schema documentation

## Success Criteria

### Testing Success Criteria

- [ ] All 35 property-based tests passing
- [ ] E2E test coverage for all critical user flows
- [ ] Performance tests meeting targets (FCP < 1.5s, API < 200ms)
- [ ] Security tests passing (auth, CORS, rate limiting)

### Deployment Success Criteria

- [ ] Zero-downtime deployment to Cloudflare Pages
- [ ] Health checks passing post-deployment
- [ ] Error rate < 0.1% for 24 hours post-deployment
- [ ] All environment variables configured correctly

### Performance Success Criteria

- [ ] First Contentful Paint < 1.5 seconds
- [ ] API response time < 200ms (p95)
- [ ] Initial bundle size < 200KB
- [ ] Lighthouse score > 90

### Security Success Criteria

- [ ] All API routes protected with authentication
- [ ] Rate limiting implemented on all endpoints
- [ ] CORS configured correctly
- [ ] Security headers configured
- [ ] Sensitive data encrypted at rest

### Documentation Success Criteria

- [ ] README files for all major components
- [ ] API documentation complete
- [ ] Deployment runbook created
- [ ] Troubleshooting guide created
- [ ] Architecture diagrams created
