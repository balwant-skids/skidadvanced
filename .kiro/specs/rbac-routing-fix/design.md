# RBAC Routing System Fix - Design Document

## Overview

The RBAC Routing System Fix implements a comprehensive role-based access control system for the SKIDS Advanced platform. The system enforces three distinct user roles (Super Admin, Clinic Admin, Parent) with appropriate access restrictions, automatic routing, and server-side protection. This design addresses the current gaps in role verification and ensures that users can only access features appropriate to their role.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
├─────────────────┬─────────────────┬─────────────────────────────────┤
│  Super Admin    │  Clinic Admin   │       Parent Portal             │
│  - Full Access  │  - Clinic Scope │       - Dashboard               │
│  - Admin Dash   │  - Whitelist    │       - Children Data           │
│  - User Mgmt    │  - Reports      │       - Educational Content     │
│  - Packages     │                 │       - Subscription View       │
│  - Campaigns    │                 │                                 │
└────────┬────────┴────────┬────────┴────────────────┬────────────────┘
         │                 │                          │
         ▼                 ▼                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Next.js Middleware (Edge)                         │
│  - Clerk Authentication Check                                        │
│  - Public Route Matching                                             │
│  - Pass authenticated users to pages                                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────────┐
│  Server Pages   │   │   API Routes    │   │   Auth Helpers          │
│  - requireAuth  │   │   - withAuth    │   │   - requireRole         │
│  - requireRole  │   │   - Role checks │   │   - requireSuperAdmin   │
│  - Render/      │   │   - Data scope  │   │   - requireClinicAccess │
│    Redirect     │   │   - Responses   │   │   - Audit logging       │
└────────┬────────┘   └────────┬────────┘   └────────┬────────────────┘
         │                     │                      │
         └─────────────────────┼──────────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │   Prisma/Neon DB    │
                    │   - User roles      │
                    │   - Clinic assoc    │
                    │   - Audit logs      │
                    └─────────────────────┘
```

## Components and Interfaces

### 1. Role Definition

```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CLINIC_MANAGER = 'clinic_manager',
  PARENT = 'parent'
}

interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  clinicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RolePermissions {
  canAccessAdminDashboard: boolean;
  canManageUsers: boolean;
  canManagePackages: boolean;
  canManageCampaigns: boolean;
  canWhitelistParents: boolean;
  whitelistScope: 'all' | 'clinic' | 'none';
  canViewAllClinics: boolean;
  clinicScope?: string;
}
```

### 2. Authentication Service

```typescript
interface AuthService {
  // Core authentication
  requireAuth(): Promise<AuthenticatedUser>;
  requireRole(allowedRoles: UserRole[]): Promise<AuthenticatedUser>;
  
  // Role-specific helpers
  requireSuperAdmin(): Promise<AuthenticatedUser>;
  requireClinicManager(): Promise<AuthenticatedUser>;
  requireParent(): Promise<AuthenticatedUser>;
  
  // Clinic scoping
  requireClinicAccess(clinicId: string): Promise<AuthenticatedUser>;
  
  // Permissions
  getRolePermissions(role: UserRole): RolePermissions;
  canAccessRoute(user: AuthenticatedUser, route: string): boolean;
}

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  clinicId?: string;
  permissions: RolePermissions;
}
```

### 3. Routing Service

```typescript
interface RoutingService {
  // Post-login routing
  getDefaultRouteForRole(role: UserRole): string;
  redirectAfterLogin(user: AuthenticatedUser): string;
  
  // Access control
  checkRouteAccess(user: AuthenticatedUser, route: string): RouteAccessResult;
  getRedirectForUnauthorized(user: AuthenticatedUser, attemptedRoute: string): string;
}

interface RouteAccessResult {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
}

interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  requiresClinicScope?: boolean;
  isPublic?: boolean;
}

const ROUTE_CONFIGS: RouteConfig[] = [
  // Public routes
  { path: '/', allowedRoles: [], isPublic: true },
  { path: '/sign-in', allowedRoles: [], isPublic: true },
  { path: '/sign-up', allowedRoles: [], isPublic: true },
  { path: '/discovery', allowedRoles: [], isPublic: true },
  { path: '/behavioral', allowedRoles: [], isPublic: true },
  { path: '/interventions', allowedRoles: [], isPublic: true },
  
  // Super admin only
  { path: '/admin/dashboard', allowedRoles: [UserRole.SUPER_ADMIN] },
  { path: '/admin/users', allowedRoles: [UserRole.SUPER_ADMIN] },
  { path: '/admin/packages', allowedRoles: [UserRole.SUPER_ADMIN] },
  { path: '/admin/campaigns', allowedRoles: [UserRole.SUPER_ADMIN] },
  
  // Super admin and clinic manager
  { path: '/admin/whitelist', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CLINIC_MANAGER], requiresClinicScope: true },
  
  // All authenticated users (role-specific views)
  { path: '/dashboard', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CLINIC_MANAGER, UserRole.PARENT] },
  { path: '/profile', allowedRoles: [UserRole.SUPER_ADMIN, UserRole.CLINIC_MANAGER, UserRole.PARENT] },
];
```

### 4. Whitelisting Service

```typescript
interface WhitelistingService {
  // Get pending parents
  getPendingParents(adminUser: AuthenticatedUser): Promise<PendingParent[]>;
  
  // Approval actions
  approveParent(adminUser: AuthenticatedUser, parentId: string): Promise<ApprovalResult>;
  rejectParent(adminUser: AuthenticatedUser, parentId: string, reason: string): Promise<RejectionResult>;
  
  // Assignment
  assignParentToClinic(adminUser: AuthenticatedUser, parentId: string, clinicId: string): Promise<void>;
  
  // History
  getWhitelistHistory(adminUser: AuthenticatedUser): Promise<WhitelistAction[]>;
}

interface PendingParent {
  id: string;
  email: string;
  name: string;
  clinicId?: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface ApprovalResult {
  success: boolean;
  parentId: string;
  activatedAt: Date;
  emailSent: boolean;
}

interface RejectionResult {
  success: boolean;
  parentId: string;
  reason: string;
  rejectedAt: Date;
}

interface WhitelistAction {
  id: string;
  parentId: string;
  parentEmail: string;
  action: 'approved' | 'rejected';
  performedBy: string;
  performedByRole: UserRole;
  clinicId?: string;
  reason?: string;
  timestamp: Date;
}
```

### 5. Audit Logging Service

```typescript
interface AuditLoggingService {
  // Log security events
  logUnauthorizedAccess(user: AuthenticatedUser, attemptedRoute: string): Promise<void>;
  logRoleVerificationFailure(userId: string, requiredRole: UserRole, actualRole: UserRole): Promise<void>;
  logAPIAuthorizationFailure(user: AuthenticatedUser, endpoint: string, method: string): Promise<void>;
  
  // Query logs
  getAuditLogs(filters: AuditLogFilters): Promise<AuditLog[]>;
  getSecurityAlerts(): Promise<SecurityAlert[]>;
}

interface AuditLog {
  id: string;
  eventType: 'unauthorized_access' | 'role_verification_failure' | 'api_auth_failure' | 'suspicious_activity';
  userId: string;
  userRole: UserRole;
  details: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

interface AuditLogFilters {
  userId?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  severity?: string;
}

interface SecurityAlert {
  id: string;
  userId: string;
  alertType: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}
```

### 6. Data Scoping Service

```typescript
interface DataScopingService {
  // Clinic scoping
  applyClinicScope<T>(query: T, user: AuthenticatedUser): T;
  verifyClinicAccess(user: AuthenticatedUser, resourceClinicId: string): boolean;
  
  // Parent data scoping
  applyParentScope<T>(query: T, user: AuthenticatedUser): T;
  verifyParentDataAccess(user: AuthenticatedUser, resourceParentId: string): boolean;
  
  // Query filters
  getClinicFilter(user: AuthenticatedUser): { clinicId?: string } | {};
  getParentFilter(user: AuthenticatedUser): { parentId?: string } | {};
}
```

## Data Models

### Prisma Schema Extensions

```prisma
// User model already exists, ensure role field
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String
  role      String   // 'super_admin', 'clinic_manager', 'parent'
  clinicId  String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  clinic    Clinic?  @relation(fields: [clinicId], references: [id])
  
  @@index([role])
  @@index([clinicId])
  @@index([isActive])
}

// Audit log for security events
model AuditLog {
  id        String   @id @default(cuid())
  eventType String   // 'unauthorized_access', 'role_verification_failure', etc.
  userId    String
  userRole  String
  details   String   @db.Text // JSON
  severity  String   @default("low") // 'low', 'medium', 'high'
  timestamp DateTime @default(now())
  
  @@index([userId])
  @@index([eventType])
  @@index([timestamp])
  @@index([severity])
}

// Whitelist actions history
model WhitelistAction {
  id              String   @id @default(cuid())
  parentId        String
  parentEmail     String
  action          String   // 'approved', 'rejected'
  performedBy     String
  performedByRole String
  clinicId        String?
  reason          String?  @db.Text
  timestamp       DateTime @default(now())
  
  parent          User     @relation("WhitelistParent", fields: [parentId], references: [id])
  admin           User     @relation("WhitelistAdmin", fields: [performedBy], references: [id])
  
  @@index([parentId])
  @@index([performedBy])
  @@index([clinicId])
  @@index([timestamp])
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Super Admin Route Access
*For any* admin route and super admin user, the system SHALL grant access without restrictions.
**Validates: Requirements 1.2**

### Property 2: Super Admin Whitelist Scope
*For any* parent from any clinic, a super admin SHALL be able to whitelist them.
**Validates: Requirements 1.4**

### Property 3: Clinic Admin Route Restriction
*For any* clinic admin user attempting to access /admin/campaigns, /admin/packages, or /admin/users, the system SHALL redirect to /dashboard.
**Validates: Requirements 2.4, 2.5, 3.5, 12.4, 13.5**

### Property 4: Clinic Admin Data Filtering
*For any* clinic admin accessing the whitelisting interface, the returned parent list SHALL only contain parents where parent.clinicId equals admin.clinicId.
**Validates: Requirements 3.2, 8.1**

### Property 5: Clinic Admin Authorization Check
*For any* clinic admin attempting to whitelist a parent, approval SHALL only succeed if parent.clinicId equals admin.clinicId.
**Validates: Requirements 3.3, 8.2**

### Property 6: Clinic Admin Access Redirect
*For any* clinic admin attempting to access /admin/dashboard, the system SHALL redirect to /dashboard.
**Validates: Requirements 3.4, 11.2**

### Property 7: Clinic Scoped Queries
*For any* clinic admin querying parent lists or reports, results SHALL be automatically filtered by their clinicId.
**Validates: Requirements 4.1, 4.2, 20.2**

### Property 8: Cross-Clinic Modification Prevention
*For any* clinic admin attempting to modify a parent where parent.clinicId does not equal admin.clinicId, the system SHALL reject with forbidden error.
**Validates: Requirements 4.3, 20.3**

### Property 9: Clinic Admin Super Admin Feature Block
*For any* clinic admin attempting to access super admin features (packages, campaigns, user management), the system SHALL block access and log the attempt.
**Validates: Requirements 4.5**

### Property 10: Parent Admin Route Restriction
*For any* parent user attempting to access any /admin route, the system SHALL redirect to /dashboard.
**Validates: Requirements 5.3, 11.3, 12.5, 13.5**

### Property 11: Parent Data Scoping
*For any* parent viewing children data, the returned results SHALL only include children where child.parentId equals parent.id.
**Validates: Requirements 5.4**

### Property 12: Parent Cross-Access Prevention
*For any* parent attempting to access another parent's resources, the system SHALL reject with forbidden error.
**Validates: Requirements 5.5**

### Property 13: Parent Educational Content Access
*For any* parent accessing /discovery, /behavioral, or /interventions routes, the system SHALL allow access.
**Validates: Requirements 6.3, 6.4, 6.5**

### Property 14: Age-Appropriate Content Filtering
*For any* parent accessing educational content, the system SHALL filter content to show only items appropriate for their children's ages.
**Validates: Requirements 6.1**

### Property 15: Clinic Admin Whitelist History Filtering
*For any* clinic admin viewing whitelisting history, the system SHALL display only actions where action.clinicId equals admin.clinicId.
**Validates: Requirements 8.4**

### Property 16: Cross-Clinic Approval Prevention
*For any* clinic admin attempting to approve a parent from a different clinic, the system SHALL reject the request.
**Validates: Requirements 8.3**

### Property 17: Role Fetch on Sign-In
*For any* authenticated user completing sign-in, the system SHALL fetch their role from the database.
**Validates: Requirements 9.1**

### Property 18: Protected Route Authentication Check
*For any* user accessing a protected route, the system SHALL verify authentication before rendering the page.
**Validates: Requirements 10.1, 14.1**

### Property 19: Role-Restricted Route Verification
*For any* user accessing a role-restricted route, the system SHALL verify their role matches the required permissions.
**Validates: Requirements 10.2, 15.1**

### Property 20: Unauthorized Access Redirect
*For any* unauthorized user attempting to access a protected route, the system SHALL redirect them to their role-appropriate dashboard.
**Validates: Requirements 10.3, 15.3**

### Property 21: Unauthorized Access Logging
*For any* failed role verification, the system SHALL log the unauthorized access attempt with user ID, role, and requested route.
**Validates: Requirements 10.4, 18.1**

### Property 22: Unauthenticated Admin Dashboard Redirect
*For any* unauthenticated user attempting to access /admin/dashboard, the system SHALL redirect to /sign-in.
**Validates: Requirements 11.4, 14.2**

### Property 23: Unauthenticated Protected Route Redirect
*For any* unauthenticated user accessing a protected route, the middleware SHALL redirect to /sign-in.
**Validates: Requirements 14.2**

### Property 24: Public Route Access
*For any* authenticated user accessing a public route, the middleware SHALL allow access without role checks.
**Validates: Requirements 14.3**

### Property 25: Server Component Authorization
*For any* protected page component loading, the system SHALL call requireAuth or requireRole on the server before rendering.
**Validates: Requirements 15.1**

### Property 26: Successful Authorization Rendering
*For any* successful role verification, the system SHALL render the page with appropriate content.
**Validates: Requirements 15.2**

### Property 27: User Data Scoping
*For any* server component fetching user data, the system SHALL use the authenticated user's ID from Clerk.
**Validates: Requirements 15.4**

### Property 28: API Route Authentication
*For any* API route call, the system SHALL verify authentication using Clerk.
**Validates: Requirements 16.1**

### Property 29: API Role Verification
*For any* role-restricted API route call, the system SHALL verify the user has the required role.
**Validates: Requirements 16.2**

### Property 30: API Unauthorized Response
*For any* unauthorized API call, the system SHALL return 403 Forbidden with error details.
**Validates: Requirements 16.3**

### Property 31: API Unauthenticated Response
*For any* unauthenticated API call, the system SHALL return 401 Unauthorized.
**Validates: Requirements 16.4**

### Property 32: API Successful Processing
*For any* API call with successful role verification, the system SHALL process the request and return appropriate data.
**Validates: Requirements 16.5**

### Property 33: API Error Structure
*For any* API call failing due to authorization, the system SHALL return a structured error with code and message.
**Validates: Requirements 17.2**

### Property 34: API Authorization Logging
*For any* API call rejected due to authorization, the system SHALL log the endpoint, user ID, and rejection reason.
**Validates: Requirements 18.3**

### Property 35: Redirect Logging
*For any* user redirected due to insufficient permissions, the system SHALL log the redirect action.
**Validates: Requirements 18.2**

### Property 36: Dashboard Role-Specific Rendering
*For any* user viewing their dashboard, the system SHALL render role-specific components and hide unauthorized sections.
**Validates: Requirements 19.4**

### Property 37: Clinic Admin Action Verification
*For any* clinic admin performing an action, the system SHALL verify the target resource belongs to their clinic.
**Validates: Requirements 20.1**

### Property 38: Clinic Admin Query Filtering
*For any* clinic admin querying data, the system SHALL automatically filter results by their clinic ID.
**Validates: Requirements 20.2**

### Property 39: Clinic Admin Analytics Scoping
*For any* clinic admin viewing analytics, the system SHALL display only their clinic's metrics.
**Validates: Requirements 20.4**

### Property 40: Super Admin Clinic Scope Bypass
*For any* super admin performing actions, the system SHALL bypass clinic scoping and allow cross-clinic operations.
**Validates: Requirements 20.5**

## Error Handling

### Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_ROLE: 'INVALID_ROLE',
  CLINIC_MISMATCH: 'CLINIC_MISMATCH',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  ROLE_DATA_MISSING: 'ROLE_DATA_MISSING',
} as const;
```

### Error Scenarios

1. **Unauthenticated Access**: Return 401, redirect to /sign-in
2. **Insufficient Permissions**: Return 403, redirect to role-appropriate dashboard
3. **Cross-Clinic Access**: Return 403 with CLINIC_MISMATCH code
4. **Session Expired**: Return 401, redirect to /sign-in with message
5. **Role Data Missing**: Return 500, redirect to /sign-in with support message
6. **Invalid Route for Role**: Redirect to dashboard with toast notification

### User-Facing Messages

```typescript
const ErrorMessages = {
  UNAUTHORIZED: 'Authentication required. Please sign in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  CLINIC_MISMATCH: 'You can only access resources from your clinic.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  ROLE_DATA_MISSING: 'Unable to verify permissions. Please contact support.',
  ADMIN_ONLY: 'This feature is only available to administrators.',
  SUPER_ADMIN_ONLY: 'This feature is only available to super administrators.',
};
```

## Testing Strategy

### Property-Based Testing

The module will use **fast-check** for property-based testing with:
- Minimum 100 iterations per property test
- Seed logging for reproducibility
- Shrinking enabled for minimal counterexamples

**Test Organization:**
- `auth-service.property.test.ts` - Properties 1, 2, 18, 19, 20, 25, 26, 27, 28, 29, 30, 31, 32
- `routing-service.property.test.ts` - Properties 3, 6, 10, 22, 23, 24
- `clinic-scoping.property.test.ts` - Properties 4, 5, 7, 8, 15, 16, 37, 38, 39, 40
- `parent-access.property.test.ts` - Properties 11, 12, 13, 14
- `audit-logging.property.test.ts` - Properties 9, 21, 34, 35
- `api-protection.property.test.ts` - Properties 28, 29, 30, 31, 32, 33, 34
- `ui-rendering.property.test.ts` - Property 36

**Test Annotation Format:**
```typescript
// **Feature: rbac-routing-fix, Property 1: Super Admin Route Access**
// **Validates: Requirements 1.2**
```

### Unit Testing

Unit tests will cover:
- Specific redirect scenarios for each role
- Error message formatting
- Audit log creation
- Whitelist approval/rejection workflows
- Role permission calculation
- Route configuration matching

### Integration Testing

Integration tests will verify:
- End-to-end sign-in and redirect flow
- Protected page access with different roles
- API route protection with authentication
- Clinic scoping across multiple operations
- Whitelist workflow from request to approval

## Implementation Notes

### Middleware Constraints

The Next.js Edge Runtime middleware cannot:
- Access Prisma/database directly
- Perform complex role verification
- Execute heavy computations

Therefore, middleware only handles:
- Basic Clerk authentication check
- Public route matching
- Passing authenticated users to pages

### Server Component Protection

All protected pages must:
1. Be server components (not client components)
2. Call `requireAuth()` or `requireRole()` at the top
3. Handle redirects for unauthorized access
4. Fetch user-scoped data only

### Client Component Considerations

Client components should:
- Receive user data as props from server components
- Use `useUserContext()` for UI rendering decisions
- Not perform authorization checks (server handles this)
- Display role-appropriate UI elements

### Performance Optimization

- Cache role permissions in memory for request duration
- Use database indexes on role, clinicId, isActive fields
- Implement query result caching for frequently accessed data
- Minimize database calls in authorization checks

This comprehensive design provides a robust foundation for implementing proper RBAC routing in the SKIDS Advanced platform.
