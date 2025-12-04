# Design Document

## Overview

This design implements a complete Admin User Management system for SKIDS Advanced, enabling super administrators to create, manage, and monitor administrative users. The system will replace the current mock data implementation in the staff management UI with fully functional backend APIs integrated with Clerk authentication and the existing Prisma database.

The implementation will leverage the existing User model in Prisma, extend the authentication utilities, and create RESTful API endpoints that follow the established patterns in the codebase.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Staff Management Page (/admin/staff-management)     │  │
│  │  - Staff list with search/filter                     │  │
│  │  - Add/Edit staff modals                             │  │
│  │  - Role and permission management                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/admin/users                                     │  │
│  │  - GET    /api/admin/users (list with filters)       │  │
│  │  - POST   /api/admin/users (create admin)            │  │
│  │  - GET    /api/admin/users/[id] (get details)        │  │
│  │  - PATCH  /api/admin/users/[id] (update)             │  │
│  │  - DELETE /api/admin/users/[id] (deactivate)         │  │
│  │  - POST   /api/admin/users/[id]/reactivate           │  │
│  │  - GET    /api/admin/users/[id]/activity             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Authentication Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Clerk + Custom Auth Utils                           │  │
│  │  - requireSuperAdmin() middleware                    │  │
│  │  - Role validation                                   │  │
│  │  - Permission checks                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prisma + Turso (SQLite)                             │  │
│  │  - User model (existing)                             │  │
│  │  - Clinic model (for clinic_manager association)     │  │
│  │  - Activity logging                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Create Admin User Flow**:
   - Super admin submits form → API validates super admin role → Creates Clerk invitation → Creates User record in DB → Returns success

2. **List Admin Users Flow**:
   - Request with filters → API validates super admin role → Queries DB with filters → Returns paginated results

3. **Update Admin User Flow**:
   - Super admin submits changes → API validates permissions → Updates User record → Logs activity → Returns updated user

4. **Activity Tracking Flow**:
   - Admin performs action → Middleware logs to activity table → Activity displayed in UI

## Components and Interfaces

### API Endpoints

#### GET /api/admin/users
List all admin users with filtering and pagination.

**Query Parameters**:
```typescript
{
  role?: 'super_admin' | 'clinic_manager' | 'admin'
  status?: 'active' | 'inactive'
  clinicId?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}
```

**Response**:
```typescript
{
  users: AdminUser[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

#### POST /api/admin/users
Create a new admin user.

**Request Body**:
```typescript
{
  email: string
  name: string
  role: 'super_admin' | 'clinic_manager' | 'admin'
  clinicId?: string  // Required if role is clinic_manager
  phone?: string
}
```

**Response**:
```typescript
{
  user: AdminUser
  invitationSent: boolean
}
```

#### GET /api/admin/users/[id]
Get detailed information about a specific admin user.

**Response**:
```typescript
{
  user: AdminUser
  managedClinic?: Clinic
  activitySummary: {
    lastLogin: Date
    totalActions: number
    recentActions: ActivityLog[]
  }
}
```

#### PATCH /api/admin/users/[id]
Update an admin user's details.

**Request Body**:
```typescript
{
  name?: string
  role?: 'super_admin' | 'clinic_manager' | 'admin'
  clinicId?: string
  phone?: string
  isActive?: boolean
}
```

**Response**:
```typescript
{
  user: AdminUser
  updated: string[]  // List of fields that were updated
}
```

#### DELETE /api/admin/users/[id]
Deactivate an admin user (soft delete).

**Response**:
```typescript
{
  success: boolean
  user: AdminUser
}
```

#### POST /api/admin/users/[id]/reactivate
Reactivate a deactivated admin user.

**Response**:
```typescript
{
  success: boolean
  user: AdminUser
}
```

#### GET /api/admin/users/[id]/activity
Get activity logs for a specific admin user.

**Query Parameters**:
```typescript
{
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}
```

**Response**:
```typescript
{
  activities: ActivityLog[]
  total: number
}
```

### Data Models

#### AdminUser (extends existing User model)
```typescript
interface AdminUser {
  id: string
  clerkId: string
  email: string
  name: string
  phone: string | null
  role: 'super_admin' | 'clinic_manager' | 'admin'
  isActive: boolean
  clinicId: string | null
  createdAt: Date
  updatedAt: Date
  
  // Relations
  managedClinic?: Clinic
  
  // Computed fields
  lastLogin?: Date
  activityCount?: number
}
```

#### ActivityLog
```typescript
interface ActivityLog {
  id: string
  userId: string
  action: string  // 'created_clinic', 'updated_campaign', 'approved_parent', etc.
  entityType: string  // 'clinic', 'campaign', 'user', etc.
  entityId: string
  metadata: Record<string, any>
  timestamp: Date
}
```

### Frontend Components

#### AdminUserList Component
- Displays paginated list of admin users
- Search and filter functionality
- Sort by various fields
- Action buttons (edit, deactivate, view details)

#### AdminUserModal Component
- Form for creating/editing admin users
- Role selection with conditional clinic selector
- Validation and error handling
- Success/error notifications

#### AdminUserDetails Component
- Detailed view of admin user
- Activity timeline
- Performance metrics
- Quick actions (edit, deactivate, reset password)

## Data Models

### Existing User Model (No Changes Required)
The existing Prisma User model already supports all required fields:

```prisma
model User {
  id                 String    @id @default(cuid())
  clerkId            String    @unique
  email              String    @unique
  name               String
  phone              String?
  role               String    @default("parent")
  isActive           Boolean   @default(false)
  clinicId           String?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  
  clinic             Clinic?   @relation("ClinicUsers", fields: [clinicId], references: [id])
  managedClinic      Clinic?   @relation("ClinicManager")
  // ... other relations
}
```

### New Activity Logging Model
Add a new model for tracking admin activity:

```prisma
model AdminActivityLog {
  id          String   @id @default(cuid())
  userId      String
  action      String
  entityType  String
  entityId    String
  metadata    String   @default("{}")  // JSON stored as string
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime @default(now())
  
  user        User     @relation("AdminActivities", fields: [userId], references: [id])
  
  @@index([userId])
  @@index([timestamp])
  @@index([action])
  @@index([entityType, entityId])
}
```

Also add the relation to the User model:
```prisma
model User {
  // ... existing fields
  adminActivities AdminActivityLog[] @relation("AdminActivities")
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Admin creation requires super admin role
*For any* user attempting to create an admin user, the request should only succeed if the requesting user has the super_admin role.
**Validates: Requirements 6.1**

### Property 2: Email uniqueness enforcement
*For any* admin user creation request, if an email already exists in the system, the creation should fail with a unique constraint error.
**Validates: Requirements 1.5**

### Property 3: Clinic manager requires clinic association
*For any* user with role clinic_manager, the user record should have a non-null clinicId value.
**Validates: Requirements 1.4**

### Property 4: Deactivation preserves data
*For any* admin user that is deactivated, all historical data (activity logs, created records) should remain accessible and unchanged.
**Validates: Requirements 4.4**

### Property 5: Role-based access control
*For any* API endpoint in /api/admin/users/*, only users with super_admin role should be able to access the endpoint.
**Validates: Requirements 6.1, 6.2**

### Property 6: Activity logging completeness
*For any* admin action (create, update, delete), an activity log entry should be created with the correct userId, action, and timestamp.
**Validates: Requirements 5.3**

### Property 7: Clinic manager data isolation
*For any* clinic manager user, they should only be able to access data (parents, campaigns, etc.) associated with their assigned clinic.
**Validates: Requirements 6.3**

### Property 8: Status consistency
*For any* deactivated admin user, attempting to authenticate should fail, and the user should not be able to access admin routes.
**Validates: Requirements 4.2**

## Error Handling

### Error Types

1. **Authentication Errors** (401)
   - Missing or invalid Clerk session
   - User not found in database

2. **Authorization Errors** (403)
   - Non-super-admin attempting admin user management
   - Clinic manager accessing other clinics' data

3. **Validation Errors** (400)
   - Missing required fields
   - Invalid email format
   - Invalid role value
   - Clinic manager without clinicId

4. **Conflict Errors** (409)
   - Duplicate email address
   - Attempting to delete last super admin

5. **Not Found Errors** (404)
   - User ID not found
   - Clinic ID not found

### Error Response Format

```typescript
{
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
}
```

### Error Handling Strategy

1. **Input Validation**: Validate all inputs at the API boundary using Zod schemas
2. **Database Errors**: Catch Prisma errors and transform to user-friendly messages
3. **Clerk Errors**: Handle Clerk API failures gracefully with retry logic
4. **Logging**: Log all errors with context for debugging
5. **User Feedback**: Return clear, actionable error messages to the frontend

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

1. **API Endpoint Tests**
   - Test each endpoint with valid inputs
   - Test authentication failures
   - Test authorization failures
   - Test validation errors

2. **Auth Utility Tests**
   - Test requireSuperAdmin with different roles
   - Test role validation logic
   - Test clinic association validation

3. **Data Transformation Tests**
   - Test user serialization
   - Test activity log formatting
   - Test pagination logic

### Property-Based Testing

Property-based tests will verify universal properties using fast-check library (minimum 100 iterations per test):

1. **Property 1: Admin creation requires super admin role**
   - Generate random user roles and admin creation requests
   - Verify only super_admin role succeeds

2. **Property 2: Email uniqueness enforcement**
   - Generate random email addresses and user data
   - Verify duplicate emails are rejected

3. **Property 3: Clinic manager requires clinic association**
   - Generate random users with clinic_manager role
   - Verify all have non-null clinicId

4. **Property 4: Deactivation preserves data**
   - Generate random admin users with activity logs
   - Deactivate and verify data integrity

5. **Property 5: Role-based access control**
   - Generate random users with different roles
   - Verify only super_admin can access endpoints

6. **Property 6: Activity logging completeness**
   - Generate random admin actions
   - Verify activity logs are created

7. **Property 7: Clinic manager data isolation**
   - Generate random clinic managers and data
   - Verify data access is restricted to assigned clinic

8. **Property 8: Status consistency**
   - Generate random admin users
   - Deactivate and verify authentication fails

Each property-based test will be tagged with:
```typescript
// Feature: admin-user-management, Property 1: Admin creation requires super admin role
```

### Integration Testing

Integration tests will verify end-to-end flows:

1. **Complete Admin Lifecycle**
   - Create admin → Update details → Deactivate → Reactivate

2. **Clinic Manager Flow**
   - Create clinic manager → Assign clinic → Verify data access

3. **Activity Tracking**
   - Perform actions → Verify logs → Query activity history

4. **Permission Enforcement**
   - Attempt unauthorized actions → Verify rejection

## Implementation Notes

### Clerk Integration

1. **User Invitation**: Use Clerk's invitation API to send email invitations to new admin users
2. **Role Sync**: Store roles in both Clerk metadata and database for redundancy
3. **Webhook Handling**: Update existing webhook to handle admin user creation

### Database Considerations

1. **Indexes**: Existing indexes on User model are sufficient
2. **Transactions**: Use Prisma transactions for multi-step operations
3. **Soft Deletes**: Use isActive flag instead of hard deletes

### Security Considerations

1. **Rate Limiting**: Implement rate limiting on admin user creation
2. **Audit Trail**: Log all admin user management actions
3. **Password Policy**: Enforce strong passwords via Clerk settings
4. **Session Management**: Use Clerk's session management

### Performance Considerations

1. **Pagination**: Implement cursor-based pagination for large datasets
2. **Caching**: Cache admin user list with short TTL
3. **Query Optimization**: Use Prisma's select to fetch only needed fields
4. **Batch Operations**: Support bulk status updates

### Migration Strategy

1. **Phase 1**: Deploy API endpoints without UI changes
2. **Phase 2**: Update staff management page to use real APIs
3. **Phase 3**: Remove mock data and test thoroughly
4. **Phase 4**: Enable activity logging and monitoring
