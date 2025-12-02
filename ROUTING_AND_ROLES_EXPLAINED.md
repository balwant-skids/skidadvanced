# 🔐 SKIDS Advanced - Routing & Role Logic Explained

**Last Updated:** November 30, 2024

---

## 📊 User Roles in the System

Based on the Prisma schema, there are **3 main user roles**:

```typescript
role: String @default("parent") 
// Possible values: "super_admin", "clinic_manager", "parent"
```

### Role Hierarchy:

1. **super_admin** - Full system access
2. **clinic_manager** - Clinic-specific admin access  
3. **parent** - Family/child management access

---

## 🗺️ Route Structure

### Public Routes (No Authentication Required)
```
/                    → Homepage (landing page)
/sign-in             → Clerk sign-in page
/sign-up             → Clerk sign-up page (requires clinic code)
```

### Parent Routes (role: "parent")
```
/dashboard           → Parent dashboard
/dashboard/children  → Manage children
/dashboard/appointments → View appointments
/dashboard/messages  → Messages
/dashboard/reports   → Health reports
/discovery           → Educational content
/behavioral          → Behavioral assessments
/interventions       → Health interventions
/care-plans          → Care plan management
/profile             → Parent profile
```

### Admin Routes (role: "super_admin" or "clinic_manager")
```
/admin/dashboard     → Admin dashboard
/admin/clinics       → Manage clinics (super_admin only)
/admin/parents       → Manage parent whitelist
/admin/staff-management → Manage staff
/admin/analytics     → View analytics
/admin/campaigns     → Create campaigns
/admin/care-plans    → Manage care plans
/admin/vendor-management → Vendor management
```

### API Routes
```
/api/auth/*          → Authentication endpoints
/api/users/*         → User management
/api/clinics/*       → Clinic management
/api/children/*      → Child management
/api/appointments/*  → Appointment management
/api/admin/*         → Admin-only endpoints
/api/webhooks/clerk  → Clerk webhook handler
```

---

## 🔄 Current Routing Logic

### How It Works Now:

#### 1. **Authentication Check**
```typescript
// In dashboard/page.tsx
const { userDetails, isAuthenticated, isLoading } = useUserContext();

if (!isAuthenticated) {
  // Redirect to /sign-in
}
```

#### 2. **Role-Based Rendering**
```typescript
// In dashboard/page.tsx
const isProvider = userDetails?.role === 'provider' || userDetails?.role === 'admin';
const isParent = userDetails?.role === 'parent';

if (isParent) {
  return <EnhancedParentDashboard />
}

if (isProvider) {
  return <ProviderDashboard />
}
```

#### 3. **Admin Dashboard**
```typescript
// In admin/dashboard/page.tsx
useEffect(() => {
  if (isLoaded && !user) {
    router.push('/sign-in');
  }
}, [isLoaded, user, router]);

// Shows "Super Admin" badge
// No role check currently implemented!
```

---

## ⚠️ Current Issues

### Issue 1: No Role-Based Access Control
**Problem:** Admin routes don't check user role
```typescript
// admin/dashboard/page.tsx
// ❌ Missing: Role check
// Anyone who is authenticated can access /admin/dashboard
```

**Solution Needed:**
```typescript
// ✅ Should have:
if (userDetails?.role !== 'super_admin' && userDetails?.role !== 'clinic_manager') {
  router.push('/dashboard'); // Redirect to parent dashboard
}
```

### Issue 2: No Middleware Protection
**Problem:** No Next.js middleware to protect routes
```typescript
// ❌ Missing: middleware.ts file
```

**Solution Needed:**
```typescript
// ✅ Should have: middleware.ts
export default function middleware(request: NextRequest) {
  // Check authentication
  // Check role
  // Redirect if unauthorized
}
```

### Issue 3: Role Assignment Not Automated
**Problem:** When user signs up via Clerk, role is not automatically assigned
```typescript
// ❌ Missing: Webhook handler to set role
```

**Solution Needed:**
```typescript
// ✅ Should have: /api/webhooks/clerk/route.ts
// On user.created event:
// 1. Check ParentWhitelist
// 2. Assign role based on whitelist
// 3. Create User record in database
```

---

## ✅ Recommended Routing Logic

### Step 1: Create Middleware for Route Protection

```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  
  afterAuth(auth, req) {
    // If not authenticated and trying to access protected route
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    // Get user role from database
    const userRole = await getUserRole(auth.userId);
    
    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (userRole !== 'super_admin' && userRole !== 'clinic_manager') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    
    // Redirect admins from parent routes
    if (req.nextUrl.pathname === '/dashboard') {
      if (userRole === 'super_admin' || userRole === 'clinic_manager') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
    }
    
    return NextResponse.next();
  }
});
```

### Step 2: Implement Webhook Handler

```typescript
// app/api/webhooks/clerk/route.ts
export async function POST(req: Request) {
  const payload = await req.json();
  
  if (payload.type === 'user.created') {
    const { id: clerkId, email_addresses } = payload.data;
    const email = email_addresses[0]?.email_address;
    
    // Check whitelist
    const whitelist = await prisma.parentWhitelist.findFirst({
      where: { email },
      include: { clinic: true }
    });
    
    if (!whitelist) {
      // Not whitelisted - delete user or mark as pending
      await clerk.users.deleteUser(clerkId);
      return new Response('User not whitelisted', { status: 403 });
    }
    
    // Determine role
    let role = 'parent';
    if (email.includes('admin@') || email.includes('.admin@')) {
      role = 'clinic_manager';
    }
    if (email === 'satish@skids.health' || email === 'drpratichi@skids.health') {
      role = 'super_admin';
    }
    
    // Create user in database
    await prisma.user.create({
      data: {
        clerkId,
        email,
        name: whitelist.name || email,
        role,
        clinicId: whitelist.clinicId
      }
    });
    
    // Mark as registered
    await prisma.parentWhitelist.update({
      where: { id: whitelist.id },
      data: { isRegistered: true }
    });
  }
  
  return new Response('OK', { status: 200 });
}
```

### Step 3: Update Dashboard Routing

```typescript
// app/dashboard/page.tsx
useEffect(() => {
  if (isAuthenticated && userDetails) {
    // Redirect admins to admin dashboard
    if (userDetails.role === 'super_admin' || userDetails.role === 'clinic_manager') {
      router.push('/admin/dashboard');
    }
  }
}, [isAuthenticated, userDetails]);
```

```typescript
// app/admin/dashboard/page.tsx
useEffect(() => {
  if (isAuthenticated && userDetails) {
    // Redirect parents to parent dashboard
    if (userDetails.role === 'parent') {
      router.push('/dashboard');
    }
  }
}, [isAuthenticated, userDetails]);
```

---

## 🎯 Complete User Flow

### Flow 1: Parent Registration

1. **User visits:** `/sign-up`
2. **Enters clinic code:** `MPC001`
3. **Clerk validates** and creates account
4. **Webhook fires:** `user.created` event
5. **Backend checks:** ParentWhitelist table
6. **If whitelisted:**
   - Create User record with `role: "parent"`
   - Assign to clinic
   - Mark whitelist entry as registered
7. **User redirected to:** `/dashboard` (parent dashboard)

### Flow 2: Admin Login

1. **Admin visits:** `/sign-in`
2. **Enters credentials:** `satish@skids.health`
3. **Clerk authenticates**
4. **Backend checks:** User role = `super_admin`
5. **Middleware redirects to:** `/admin/dashboard`
6. **Admin sees:** Admin dashboard with full access

### Flow 3: Clinic Manager Login

1. **Manager visits:** `/sign-in`
2. **Enters credentials:** `mumbai.admin@skids.health`
3. **Clerk authenticates**
4. **Backend checks:** User role = `clinic_manager`
5. **Middleware redirects to:** `/admin/dashboard`
6. **Manager sees:** Admin dashboard (clinic-specific)

---

## 📊 Role Permissions Matrix

| Feature | Parent | Clinic Manager | Super Admin |
|---------|--------|----------------|-------------|
| View own children | ✅ | ❌ | ✅ |
| Add children | ✅ | ❌ | ✅ |
| Take assessments | ✅ | ❌ | ✅ |
| View educational content | ✅ | ❌ | ✅ |
| Book appointments | ✅ | ❌ | ✅ |
| View clinic dashboard | ❌ | ✅ | ✅ |
| Manage whitelist | ❌ | ✅ (own clinic) | ✅ (all clinics) |
| View all parents | ❌ | ✅ (own clinic) | ✅ (all clinics) |
| Create campaigns | ❌ | ✅ (own clinic) | ✅ (all clinics) |
| Manage clinics | ❌ | ❌ | ✅ |
| Add clinic admins | ❌ | ❌ | ✅ |
| View system analytics | ❌ | ✅ (own clinic) | ✅ (all clinics) |
| Manage care plans | ❌ | ✅ (own clinic) | ✅ (all clinics) |

---

## 🔧 Implementation Priority

### Phase 1: Critical (Do First)
1. ✅ Implement webhook handler for role assignment
2. ✅ Add role checks in admin dashboard
3. ✅ Create middleware for route protection

### Phase 2: Important (Do Next)
4. ✅ Add role-based redirects in dashboards
5. ✅ Implement API route protection
6. ✅ Add role checks in all admin pages

### Phase 3: Enhancement (Do Later)
7. ✅ Add permission-based UI rendering
8. ✅ Implement audit logging
9. ✅ Add role management UI for super admins

---

## 🧪 Testing Scenarios

### Test 1: Parent Access
- ✅ Parent can access `/dashboard`
- ❌ Parent cannot access `/admin/dashboard`
- ✅ Parent can view own children
- ❌ Parent cannot view other parents' children

### Test 2: Clinic Manager Access
- ✅ Manager can access `/admin/dashboard`
- ✅ Manager can view parents in their clinic
- ❌ Manager cannot view parents in other clinics
- ❌ Manager cannot create new clinics

### Test 3: Super Admin Access
- ✅ Super admin can access all routes
- ✅ Super admin can view all clinics
- ✅ Super admin can create new clinics
- ✅ Super admin can manage all users

---

## 📝 Summary

**Current State:**
- ❌ No role-based access control
- ❌ No middleware protection
- ❌ No automatic role assignment
- ✅ Basic authentication working
- ✅ Separate dashboards exist

**Needed:**
1. Middleware for route protection
2. Webhook handler for role assignment
3. Role checks in all protected pages
4. API route protection
5. Proper redirects based on role

**Priority:** Implement webhook handler first, then middleware, then page-level checks.

---

**Next Steps:** Would you like me to implement these missing pieces?
