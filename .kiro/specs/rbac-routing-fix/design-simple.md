# Simple Parent Whitelisting System - Design Document

## Overview

This design implements a minimal parent approval system for SKIDS Advanced. Super admins approve parent registrations, and approved parents access educational content and view their subscription plans. The system uses Clerk for authentication with minimal additional access control logic.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
├──────────────────────────┬──────────────────────────────────┤
│   Super Admin Portal     │      Parent Portal               │
│   - Admin Dashboard      │      - Dashboard (if approved)   │
│   - Whitelist Parents    │      - Educational Content       │
│   - Approve/Reject       │      - Plan Details              │
│   - Manage Plans         │      - Reminders                 │
│   - Manage Campaigns     │      - Pending Page (if not)     │
└────────────┬─────────────┴──────────────┬───────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────────────────────────────────────────┐
│              Next.js Middleware (Edge)                      │
│  - Clerk Auth Check                                         │
│  - Redirect inactive parents to /pending-approval           │
└────────────────────────┬───────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────────┐
│   Pages    │  │ API Routes │  │  Auth Helpers  │
│ - Check    │  │ - Approve  │  │  - requireAuth │
│   role     │  │ - Reject   │  │  - isAdmin     │
│ - Render   │  │ - Get list │  │                │
└─────┬──────┘  └─────┬──────┘  └────────┬───────┘
      │               │                  │
      └───────────────┼──────────────────┘
                      ▼
           ┌─────────────────────┐
           │   Prisma/Neon DB    │
           │   - User.role       │
           │   - User.isActive   │
           │   - User.planId     │
           └─────────────────────┘
```

## Components and Interfaces

### 1. User Model (Simplified)

```typescript
interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: 'super_admin' | 'parent';  // Just 2 roles!
  isActive: boolean;                // Whitelist status
  planId?: string;                  // Subscription plan
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionPlan {
  id: string;
  name: string;  // 'Essential Care', 'Comprehensive Care', 'Premium Care'
  price: number;
  features: string[];
  reminderConfig?: ReminderConfig;
}

interface ReminderConfig {
  enabled: boolean;
  frequency: 'weekly' | 'monthly';
  types: string[];  // ['screening', 'assessment', 'checkup']
}
```

### 2. Authentication Service (Minimal)

```typescript
interface AuthService {
  // Basic auth
  requireAuth(): Promise<AuthenticatedUser>;
  isAdmin(user: AuthenticatedUser): boolean;
  isActiveParent(user: AuthenticatedUser): boolean;
  
  // Simple checks
  canAccessAdminRoutes(user: AuthenticatedUser): boolean;
  canAccessDashboard(user: AuthenticatedUser): boolean;
}

interface AuthenticatedUser {
  userId: string;
  email: string;
  role: 'super_admin' | 'parent';
  isActive: boolean;
  planId?: string;
}
```

### 3. Whitelisting Service (Simple)

```typescript
interface WhitelistService {
  // Get pending parents
  getPendingParents(): Promise<PendingParent[]>;
  
  // Actions
  approveParent(parentId: string, planId: string): Promise<void>;
  rejectParent(parentId: string): Promise<void>;
}

interface PendingParent {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
```

### 4. Plan Management Service

```typescript
interface PlanManagementService {
  // CRUD operations
  getAllPlans(): Promise<SubscriptionPlan[]>;
  createPlan(data: CreatePlanInput): Promise<SubscriptionPlan>;
  updatePlan(planId: string, data: UpdatePlanInput): Promise<SubscriptionPlan>;
  deletePlan(planId: string): Promise<void>;
}

interface CreatePlanInput {
  name: string;
  price: number;
  features: string[];
  reminderConfig?: ReminderConfig;
}

interface UpdatePlanInput {
  name?: string;
  price?: number;
  features?: string[];
  reminderConfig?: ReminderConfig;
}
```

### 5. Campaign Management Service

```typescript
interface CampaignManagementService {
  // CRUD operations
  getAllCampaigns(): Promise<Campaign[]>;
  createCampaign(data: CreateCampaignInput): Promise<Campaign>;
  sendCampaign(campaignId: string, targetAudience: string[]): Promise<void>;
  getCampaignStats(campaignId: string): Promise<CampaignStats>;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  targetAudience: 'all' | 'plan_specific' | 'custom';
  planId?: string;  // If plan_specific
  status: 'draft' | 'sent';
  sentAt?: Date;
  createdAt: Date;
}

interface CreateCampaignInput {
  name: string;
  subject: string;
  content: string;
  targetAudience: 'all' | 'plan_specific' | 'custom';
  planId?: string;
  recipientIds?: string[];
}

interface CampaignStats {
  campaignId: string;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
}
```

### 6. Routing Logic (Simple)

```typescript
function getRedirectAfterLogin(user: AuthenticatedUser): string {
  // Super admin → admin dashboard
  if (user.role === 'super_admin') {
    return '/admin/dashboard';
  }
  
  // Pending parent → pending page
  if (user.role === 'parent' && !user.isActive) {
    return '/pending-approval';
  }
  
  // Approved parent → dashboard
  if (user.role === 'parent' && user.isActive) {
    return '/dashboard';
  }
  
  // Fallback
  return '/';
}

function canAccessRoute(user: AuthenticatedUser, route: string): boolean {
  // Admin routes - super admin only
  if (route.startsWith('/admin')) {
    return user.role === 'super_admin';
  }
  
  // Dashboard - active parents and admins
  if (route === '/dashboard') {
    return user.role === 'super_admin' || (user.role === 'parent' && user.isActive);
  }
  
  // Public routes - everyone
  return true;
}
```

## Data Models

### Prisma Schema (Minimal Changes)

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String
  role      String   @default("parent") // 'super_admin' or 'parent'
  isActive  Boolean  @default(false)    // Whitelist status
  planId    String?                     // Subscription plan
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  plan      SubscriptionPlan? @relation(fields: [planId], references: [id])
  
  @@index([role])
  @@index([isActive])
  @@index([planId])
}

model SubscriptionPlan {
  id          String   @id @default(cuid())
  name        String   @unique
  price       Int
  features    String   @default("[]") // JSON array
  reminderConfig String? @db.Text    // JSON config
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  users       User[]
}

model Campaign {
  id              String   @id @default(cuid())
  name            String
  subject         String
  content         String   @db.Text
  targetAudience  String   // 'all', 'plan_specific', 'custom'
  planId          String?
  recipientIds    String?  @db.Text // JSON array
  status          String   @default("draft") // 'draft', 'sent'
  sentAt          DateTime?
  sentCount       Int      @default(0)
  openedCount     Int      @default(0)
  clickedCount    Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  plan            SubscriptionPlan? @relation(fields: [planId], references: [id])
  
  @@index([status])
  @@index([planId])
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do.*

### Property 1: Admin Route Access
*For any* user with role 'super_admin', accessing any /admin route SHALL be allowed.
**Validates: Requirements 1.2**

### Property 2: Parent Admin Route Block
*For any* user with role 'parent', attempting to access any /admin route SHALL redirect to /dashboard.
**Validates: Requirements 1.3, 8.2**

### Property 3: Pending Parent Dashboard Block
*For any* parent user where isActive = false, attempting to access /dashboard SHALL redirect to /pending-approval.
**Validates: Requirements 3.2**

### Property 4: Active Parent Dashboard Access
*For any* parent user where isActive = true, accessing /dashboard SHALL be allowed.
**Validates: Requirements 3.5, 4.2**

### Property 5: Approval Activates Account
*For any* pending parent, when approved by admin, isActive SHALL be set to true.
**Validates: Requirements 2.2, 3.4**

### Property 6: Plan Assignment on Approval
*For any* pending parent, when approved with a planId, the parent's planId SHALL be set to the specified plan.
**Validates: Requirements 2.2, 2.5**

### Property 7: Admin Login Redirect
*For any* user with role 'super_admin' completing sign-in, redirect SHALL be to /admin/dashboard.
**Validates: Requirements 1.1, 7.2**

### Property 8: Pending Parent Login Redirect
*For any* parent user where isActive = false completing sign-in, redirect SHALL be to /pending-approval.
**Validates: Requirements 7.3**

### Property 9: Active Parent Login Redirect
*For any* parent user where isActive = true completing sign-in, redirect SHALL be to /dashboard.
**Validates: Requirements 7.4**

### Property 10: Educational Content Access
*For any* active parent, accessing /discovery or /behavioral routes SHALL be allowed.
**Validates: Requirements 4.4, 4.5**

### Property 11: Plan Display
*For any* active parent viewing dashboard, their subscription plan details SHALL be displayed.
**Validates: Requirements 5.1, 5.2**

### Property 12: Unauthenticated Admin Access Block
*For any* unauthenticated user attempting to access /admin/dashboard, redirect SHALL be to /sign-in.
**Validates: Requirements 8.3, 9.2**

### Property 13: Plan Creation by Admin
*For any* super admin creating a plan, the plan SHALL be saved and available for assignment to parents.
**Validates: Plan Management**

### Property 14: Campaign Targeting
*For any* campaign with targetAudience = 'plan_specific', only parents with matching planId SHALL receive the campaign.
**Validates: Campaign Management**

## Error Handling

### Simple Error Messages

```typescript
const Messages = {
  PENDING_APPROVAL: 'Your account is pending admin approval. You will receive an email once approved.',
  UNAUTHORIZED: 'You do not have permission to access this page.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  APPROVAL_SUCCESS: 'Parent account approved successfully!',
  REJECTION_SUCCESS: 'Parent account rejected.',
};
```

### Error Scenarios

1. **Pending parent tries to access dashboard**: Redirect to /pending-approval with message
2. **Parent tries to access admin**: Redirect to /dashboard silently
3. **Unauthenticated user**: Redirect to /sign-in
4. **Session expired**: Redirect to /sign-in with message

## Implementation Flow

### 1. Middleware (src/middleware.ts)

```typescript
export default clerkMiddleware(async (auth, req) => {
  // Public routes - allow
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    await auth.protect();
    return;
  }

  // For dashboard access, check if parent is active
  if (req.nextUrl.pathname === '/dashboard') {
    const user = await getUserFromDB(userId);
    if (user.role === 'parent' && !user.isActive) {
      return NextResponse.redirect(new URL('/pending-approval', req.url));
    }
  }

  return NextResponse.next();
});
```

### 2. Admin Dashboard Page (src/app/admin/dashboard/page.tsx)

```typescript
export default async function AdminDashboard() {
  // Server-side auth check
  const user = await requireAuth();
  
  if (user.role !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch pending parents
  const pendingParents = await getPendingParents();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <PendingParentsList parents={pendingParents} />
    </div>
  );
}
```

### 3. Whitelist API Route (src/app/api/admin/whitelist/approve/route.ts)

```typescript
export async function POST(req: Request) {
  const user = await requireAuth();
  
  if (user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { parentId, planId } = await req.json();
  
  // Approve parent
  await prisma.user.update({
    where: { id: parentId },
    data: { isActive: true, planId }
  });

  // Send confirmation email
  await sendApprovalEmail(parentId);

  return NextResponse.json({ success: true });
}
```

### 4. Parent Dashboard (src/app/dashboard/page.tsx)

```typescript
export default async function Dashboard() {
  const user = await requireAuth();

  // Check if parent is active
  if (user.role === 'parent' && !user.isActive) {
    redirect('/pending-approval');
  }

  // Fetch user's plan
  const plan = user.planId ? await getPlan(user.planId) : null;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      
      {/* Show plan details */}
      {plan && <PlanCard plan={plan} />}
      
      {/* Educational content links */}
      <EducationalContentLinks />
      
      {/* Reminders if configured */}
      {plan?.reminderConfig?.enabled && <RemindersSection plan={plan} />}
    </div>
  );
}
```

### 5. Pending Approval Page (src/app/pending-approval/page.tsx)

```typescript
export default async function PendingApproval() {
  const user = await requireAuth();

  return (
    <div className="text-center p-8">
      <h1>Account Pending Approval</h1>
      <p>
        Your account is awaiting admin approval. 
        You will receive an email once your account is activated.
      </p>
      <p>Thank you for your patience!</p>
    </div>
  );
}
```

## Testing Strategy

### Property-Based Testing

Using **fast-check** with 100 iterations per test:

**Test Files:**
- `auth-routing.property.test.ts` - Properties 1, 2, 3, 4, 7, 8, 9, 10, 12
- `whitelist-approval.property.test.ts` - Properties 5, 6
- `plan-display.property.test.ts` - Property 11

**Test Annotation Format:**
```typescript
// **Feature: rbac-routing-fix, Property 1: Admin Route Access**
// **Validates: Requirements 1.2**
```

### Unit Testing

- Admin approval workflow
- Parent rejection workflow
- Plan assignment logic
- Redirect logic for each role/status combination
- Error message display

### Integration Testing

- Complete sign-up → approval → login flow
- Admin whitelist page functionality
- Parent dashboard with plan display
- Pending approval page display

## Summary

This simplified design:
- ✅ Uses Clerk for authentication (no reinventing the wheel)
- ✅ Adds minimal logic: just `isActive` check and role check
- ✅ Two roles only: super_admin and parent
- ✅ Simple whitelist: approve/reject + assign plan
- ✅ Clean parent experience: educational content + plan details
- ✅ Easy to implement and maintain

**Total new code needed:**
- 1 middleware check (isActive)
- 3 admin pages (whitelist, plans, campaigns)
- 8 API routes (approve, reject, plan CRUD, campaign CRUD)
- 1 pending page
- Minor dashboard updates

**Admin Features:**
- ✅ Whitelist parents (approve/reject + assign plan)
- ✅ Manage plans (create, edit, delete subscription plans)
- ✅ Manage campaigns (create, send targeted campaigns)

That's it!
