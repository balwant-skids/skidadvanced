# Simplified User Flow

## Core Features Only

### 1. Educational Content & Care Plans
**Who can access**: Admins + Whitelisted Parents
- View educational videos (Kurzgesagt-style)
- Browse care plans
- Interactive learning modules

### 2. Admin Dashboard
**Who can access**: Super Admins only
- Whitelist parents (add parent email)
- Create/Edit/Delete care plans
- Create/Edit/Delete campaigns

---

## User Flows

### Admin Flow
1. Login with admin email (satish@skids.health, etc.)
2. Redirect to `/admin/dashboard`
3. Admin dashboard shows:
   - **Whitelist Parents** - Add parent emails
   - **Manage Care Plans** - CRUD operations
   - **Manage Campaigns** - CRUD operations
4. Admin can also browse educational content

### Parent Flow (Not Whitelisted)
1. Visit homepage
2. Click "Get Started" → Goes to sign-up
3. After sign-up → Shows message: "Please wait for admin approval"
4. Cannot access educational content yet

### Parent Flow (Whitelisted)
1. Login with whitelisted email
2. Redirect to `/dashboard` (parent dashboard)
3. Parent dashboard shows:
   - Educational videos
   - Care plans
   - Learning progress
4. Can browse and watch content

---

## What to Remove
- ❌ Clinic codes
- ❌ Clinic management
- ❌ Staff management
- ❌ Analytics
- ❌ Reports
- ❌ Multiple clinic support

## What to Keep
- ✅ Parent whitelisting
- ✅ Care plans CRUD
- ✅ Campaigns CRUD
- ✅ Educational content
- ✅ Simple admin dashboard
- ✅ Simple parent dashboard
