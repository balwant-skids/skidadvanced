# RBAC & Routing Analysis - SKIDS Advanced

## 🎯 Current RBAC Implementation (13h ago deployment)

### Role Hierarchy
```
1. super_admin (Full Access)
   └── Can access ALL admin routes
   └── Can manage clinics, care plans, campaigns
   └── Can approve/reject parents
   └── Can perform bulk operations
   └── Can export data
   └── Can view analytics

2. clinic_manager (Limited Admin Access)
   └── Can access admin dashboard
   └── Can view their clinic's data only
   └── Can manage their clinic's whitelist
   └── Cannot create/edit clinics
   └── Cannot manage other clinics

3. parent (User Access)
   └── Must be whitelisted and approved
   └── Can access parent dashboard
   └── Can manage children
   └── Can view assessments
   └── Cannot access admin routes
```

## 🔐 Authentication & Authorization Flow

### 1. Middleware Protection (`src/middleware.ts`)
```typescript
Public Routes (No Auth Required):
- / (homepage)
- /sign-in, /sign-up
- /api/webhooks
- /care-plans, /plans
- /interventions, /specialists
- /discovery, /behavioral
- /demo
- /pending-approval

Protected Routes (Auth Required):
- /admin/* → Requires super_admin or clinic_manager
- /dashboard/* → Requires active parent
- /children/* → Requires parent role
- /assessments/* → Requires parent role
```

### 2. API-Level Authorization (`src/lib/auth-utils.ts`)

**Helper Functions:**
- `getOrCreateUser()` - Auto-creates user from Clerk session
- `requireUser()` - Throws if not authenticated
- `requireRole(['super_admin'])` - Checks specific role
- `requireAdmin()` - Allows super_admin OR clinic_manager
- `requireSuperAdmin()` - Only super_admin

**Usage in APIs:**
```typescript
// Example: Only super admins can create clinics
export async function POST(req: NextRequest) {
  await requireSuperAdmin() // ✅ Enforces role
  // ... create clinic logic
}

// Example: Both admin types can view data
export async function GET(req: NextRequest) {
  const user = await requireAdmin() // ✅ super_admin OR clinic_manager
  
  // Role-based filtering
  if (user.role === 'clinic_manager') {
    // Filter to only their clinic
    where.clinicId = user.clinicId
  }
  // ... fetch data
}
```

## 📋 Admin Dashboard Routes

### Available Admin Pages:
```
/admin/dashboard       - Overview stats
/admin/analytics       - Charts & metrics (NEW)
/admin/clinics         - Clinic management (super_admin only)
/admin/whitelist       - Parent approval (both admin types)
/admin/parents         - Parent management
/admin/campaigns       - Campaign management
/admin/care-plans      - Care plan management
/admin/staff-management - Staff management
/admin/vendor-management - Vendor management
```

## 🎫 Parent Whitelisting Flow

### Current Implementation:

1. **Clinic Manager adds email to whitelist**
   ```
   POST /api/clinics/{clinicId}/whitelist
   Body: { email, name, phone }
   ```

2. **Parent signs up with Clerk**
   - User created with role='parent', isActive=false
   - Redirected to pending approval page

3. **Super Admin approves parent**
   ```
   POST /api/admin/whitelist/approve
   Body: { parentId, planId }
   ```
   - Sets isActive=true
   - Assigns care plan
   - Creates subscription

4. **Parent can now access dashboard**
   - Middleware checks isActive status
   - Redirects to /pending-approval if not active

### Bulk Operations (NEW):
```
POST /api/admin/whitelist/bulk-approve
Body: { parentIds: string[], planId: string }

POST /api/admin/whitelist/bulk-reject
Body: { parentIds: string[] }
```

## ❌ What's NOT Implemented (As Per Requirements)

### 1. **No Clinic Code Entry for Parents**
- ✅ CORRECT: Parents don't enter clinic codes
- ✅ Whitelisting is done by clinic managers/admins
- ✅ Parents are pre-approved before signup

### 2. **No Clinic Manager Self-Service**
- ✅ CORRECT: Clinic managers are created by super admins
- ✅ No public clinic manager registration
- ✅ Clinic managers are assigned to specific clinics

### 3. **Simplified Parent Flow**
- ✅ Parents only sign up with email
- ✅ No clinic selection during signup
- ✅ Approval happens on admin side

## 🔍 Role-Based Data Filtering

### Clinic Managers See Only Their Data:
```typescript
// In APIs that support clinic managers
const user = await requireAdmin()

if (user.role === 'clinic_manager' && user.clinicId) {
  where.clinicId = user.clinicId // ✅ Filter to their clinic
}
```

### Super Admins See Everything:
```typescript
// No filtering applied for super_admin
if (user.role === 'super_admin') {
  // Can access all clinics, all parents, all data
}
```

## 📊 Admin Dashboard Features (Latest Deployment)

### 1. Analytics Dashboard
- Total counts (clinics, parents, children, subscriptions)
- Registrations over time (line chart)
- Subscription distribution (pie chart)
- Children per clinic (bar chart)
- Auto-refresh every 30 seconds

### 2. Bulk Operations
- Multi-select parents
- Bulk approve with plan assignment
- Bulk reject
- Progress tracking
- Error reporting

### 3. CSV Export
- Export clinics data
- Export parents data
- Role-based filtering (clinic managers see only their data)
- Timestamped filenames

### 4. Search & Filter
- Search clinics by name, code, email
- Filter clinics by status (active/inactive)
- Real-time result updates
- Empty state handling

## ✅ Security Checklist

- [x] Middleware protects all admin routes
- [x] API endpoints verify roles before operations
- [x] Clinic managers can only access their clinic's data
- [x] Super admins have full access
- [x] Parents must be whitelisted and approved
- [x] Inactive parents redirected to pending page
- [x] No public admin registration
- [x] No clinic code entry for parents
- [x] Bulk operations have proper authorization
- [x] Export respects role-based filtering

## 🚀 Deployment URLs

**Latest (with enhancements):**
https://skidsa1-i69e8zyb2-satishs-projects-89f8c44c.vercel.app

**13h ago deployment:**
https://skidsa1-aa34e3old-satishs-projects-89f8c44c.vercel.app

**Existing domain (older version):**
https://skidsadvanced.vercel.app

## 📝 Summary

The current RBAC implementation correctly follows the requirements:

✅ **Super Admin** - Full access to all admin features
✅ **Clinic Manager** - Limited to their clinic's data
✅ **Parent Whitelisting** - Pre-approval required, no clinic codes
✅ **No Self-Service** - Admins are created by super admins
✅ **Role-Based Filtering** - Data access based on role
✅ **Secure APIs** - All endpoints check authorization

The 13h ago deployment and the latest deployment both have the same RBAC structure. The latest deployment adds:
- Analytics dashboard
- Bulk operations
- CSV export
- Search & filter

All new features respect the existing RBAC rules.
