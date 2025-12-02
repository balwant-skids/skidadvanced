# SKIDS Advanced - Admin Dashboard Guide

## 🎯 Overview

The SKIDS Advanced Admin Dashboard provides comprehensive management capabilities for super admins and clinic managers. The dashboard includes analytics, clinic management, parent whitelisting, campaign management, and more.

---

## 👥 Admin Users in the System

### Super Admins (Hardcoded)

The following emails are automatically assigned **super_admin** role when they sign up:

1. **satish@skids.health** - Primary super admin
2. **drpratichi@skids.health** - Secondary super admin

### Demo/Marketing Accounts

These accounts have special **demo** role for testing:

- **demo@skids.health**
- **marketing@skids.health**

### Clinic Managers

Any email containing `admin@` (e.g., `admin@mumbai-clinic.com`) is automatically assigned **admin** role.

### Role Assignment Logic

Roles are assigned in the Clerk webhook (`/api/webhooks/clerk/route.ts`):

```typescript
let role = 'parent'; // Default

if (SUPER_ADMIN_EMAILS.includes(email)) {
  role = 'super_admin';
} else if (DEMO_EMAILS.includes(email)) {
  role = 'demo';
} else if (email.includes('admin@')) {
  role = 'admin';
}
```

---

## 🏗️ Admin Dashboard Features

### 1. Dashboard Home (`/admin/dashboard`)

**Features:**
- **Real-time Statistics**:
  - Total Clinics
  - Total Admins
  - Total Parents
  - Total Children
  
- **Quick Actions**:
  - Add New Clinic
  - Manage Admins
  - View Reports
  
- **Recent Activity Feed**:
  - New clinic registrations
  - Admin additions
  - Parent registrations

**Access:** Super admins only

---

### 2. Clinic Management (`/admin/clinics`)

**Features:**
- **List All Clinics**: View all registered clinics with details
- **Create New Clinic**:
  - Auto-generates unique 6-character clinic code
  - Set clinic name, address, phone, email, WhatsApp
  - Activate/deactivate clinics
  
- **Edit Clinic Details**:
  - Update clinic information
  - Manage clinic settings
  
- **View Clinic Stats**:
  - Number of parents
  - Number of whitelisted emails
  - Active status

**Access:** Super admins only

**API Endpoints:**
- `GET /api/clinics` - List all clinics
- `POST /api/clinics` - Create new clinic
- `GET /api/clinics/[id]` - Get clinic details
- `PATCH /api/clinics/[id]` - Update clinic
- `DELETE /api/clinics/[id]` - Deactivate clinic

---

### 3. Parent Management (`/admin/parents`)

**Features:**
- **View All Parents**: List of all registered parents
- **Subscription Status**: See active, paused, cancelled, expired subscriptions
- **Assign Care Plans**: Assign subscription plans to parents
- **Parent Details**: View parent profiles and children

**Access:** Super admins and clinic managers

---

### 4. Whitelist Management (`/admin/whitelist`)

**Features:**
- **Add to Whitelist**:
  - Add parent emails to clinic whitelist
  - Include name and phone (optional)
  - Parents can only register if whitelisted
  
- **View Whitelist**:
  - See all whitelisted emails for a clinic
  - Check registration status
  
- **Remove from Whitelist**:
  - Remove emails from whitelist
  - Revoke access
  
- **Pending Approvals** (`/admin/whitelist/pending`):
  - View parents waiting for approval
  - Approve and assign care plan
  - Reject applications

**Access:** Super admins and clinic managers

**API Endpoints:**
- `GET /api/clinics/[id]/whitelist` - List whitelist
- `POST /api/clinics/[id]/whitelist` - Add to whitelist
- `DELETE /api/clinics/[id]/whitelist?email=xxx` - Remove from whitelist
- `GET /api/admin/whitelist/pending` - Get pending parents
- `POST /api/admin/whitelist/approve` - Approve parent
- `POST /api/admin/whitelist/reject` - Reject parent

---

### 5. Care Plans Management (`/admin/care-plans`)

**Features:**
- **Create Care Plans**:
  - Set plan name, description, price
  - Define billing cycle (monthly, yearly)
  - List features (JSON array)
  - Make clinic-specific or global
  
- **Edit Care Plans**:
  - Update pricing and features
  - Activate/deactivate plans
  
- **View Subscriptions**:
  - See which parents are on which plans

**Access:** Super admins only

**API Endpoints:**
- `GET /api/care-plans` - List all plans
- `POST /api/care-plans` - Create new plan
- `PATCH /api/care-plans/[id]` - Update plan

---

### 6. Campaign Management (`/admin/campaigns`)

**Features:**
- **Create Campaigns**:
  - Set title, description, content (JSON)
  - Upload media to Cloudflare R2
  - Target audience: all, specific clinic, specific plan
  - Set start/end dates
  - Add CTA (call-to-action) button
  
- **Manage Campaigns**:
  - Draft, active, completed, archived status
  - View engagement metrics (views, clicks)
  
- **Target Campaigns**:
  - Target all parents
  - Target specific clinic
  - Target specific care plan subscribers

**Access:** Super admins only

**API Endpoints:**
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `PATCH /api/campaigns/[id]` - Update campaign

---

### 7. Analytics Dashboard (`/admin/analytics`)

**Features:**
- **Real-time Metrics**:
  - Active users
  - Current transactions
  - System load
  - API calls
  - Error count
  - Response time
  - Throughput
  - Active alerts
  
- **Overview Tab**:
  - Key metrics with status (on_track, at_risk, critical)
  - Total vendors, staff, revenue, system uptime
  - Customer satisfaction scores
  - Active alerts
  - Performance trends
  
- **Vendor Analytics Tab**:
  - Total vendors, active vendors
  - Pending onboarding
  - Average onboarding time
  - Top performing vendors
  - Performance distribution
  
- **Staff Productivity Tab**:
  - Staff performance metrics
  - Average productivity scores
  
- **System Health Tab**:
  - System uptime
  - Error rates
  - Performance metrics
  
- **ROI Analysis Tab**:
  - Monthly revenue
  - Overall ROI
  - Cost analysis
  
- **Predictive Insights Tab**:
  - AI-powered predictions
  - Trend forecasting

**Access:** Super admins only

**Features:**
- Auto-refresh every 30 seconds (toggleable)
- Manual refresh button
- Real-time updates
- Comprehensive charts and visualizations

---

### 8. Staff Management (`/admin/staff-management`)

**Features:**
- Manage clinic staff
- Assign roles and permissions
- Track staff activity

**Access:** Super admins and clinic managers

---

### 9. Vendor Management (`/admin/vendor-management`)

**Features:**
- Manage third-party vendors
- Track vendor performance
- Integration management

**Access:** Super admins only

---

## 🔐 Access Control

### Role Hierarchy

1. **super_admin** (Highest)
   - Full access to all features
   - Can create/manage clinics
   - Can create care plans
   - Can manage campaigns
   - Can view all analytics
   
2. **clinic_manager** / **admin**
   - Can manage their clinic's parents
   - Can whitelist parents
   - Can upload reports
   - Can view clinic-specific analytics
   
3. **parent** (Lowest)
   - Can only access parent dashboard
   - Can view their children's data
   - Can schedule appointments

### Middleware Protection

All admin routes are protected by middleware that checks:
1. User is authenticated (Clerk session)
2. User has admin role (super_admin or clinic_manager)

**Middleware file:** `src/middleware.ts`

**Auth helpers:**
- `requireAuth()` - Ensures user is logged in
- `requireAdmin()` - Ensures user is admin
- `requireSuperAdmin()` - Ensures user is super admin

---

## 📊 Database Schema for Admins

### User Table

```sql
CREATE TABLE User (
  id TEXT PRIMARY KEY,
  clerkId TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'parent', -- super_admin, clinic_manager, parent
  isActive BOOLEAN DEFAULT false,
  planId TEXT,
  clinicId TEXT,
  fcmToken TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Roles:**
- `super_admin` - Platform administrators
- `clinic_manager` / `admin` - Clinic administrators
- `parent` - Regular users
- `demo` - Demo/marketing accounts

---

## 🚀 How to Become an Admin

### Method 1: Hardcoded Super Admin (Recommended)

1. Add your email to the super admin list in `/api/webhooks/clerk/route.ts`:

```typescript
const SUPER_ADMIN_EMAILS = [
  'satish@skids.health',
  'drpratichi@skids.health',
  'your-email@example.com' // Add your email here
];
```

2. Sign up with that email
3. You'll automatically get super_admin role

### Method 2: Clinic Manager Email Pattern

1. Use an email with `admin@` in it (e.g., `admin@myclinic.com`)
2. Get whitelisted by a super admin
3. Sign up
4. You'll automatically get admin role

### Method 3: Manual Database Update

1. Sign up as a regular user
2. Update the database directly:

```sql
UPDATE User 
SET role = 'super_admin' 
WHERE email = 'your-email@example.com';
```

---

## 📝 Common Admin Tasks

### Task 1: Create a New Clinic

1. Go to `/admin/clinics`
2. Click "Add Clinic"
3. Fill in clinic details
4. System generates unique clinic code
5. Share code with clinic manager

### Task 2: Whitelist a Parent

1. Go to `/admin/whitelist` or `/admin/parents`
2. Click "Add to Whitelist"
3. Enter parent email, name, phone
4. Parent can now register with clinic code

### Task 3: Approve a Pending Parent

1. Go to `/admin/whitelist/pending`
2. Review pending applications
3. Click "Approve" and assign a care plan
4. Or click "Reject" to deny access

### Task 4: Create a Care Plan

1. Go to `/admin/care-plans`
2. Click "Create Plan"
3. Set name, price, billing cycle
4. Add features (JSON array)
5. Make global or clinic-specific

### Task 5: Launch a Campaign

1. Go to `/admin/campaigns`
2. Click "Create Campaign"
3. Add title, description, content
4. Upload media (stored in Cloudflare R2)
5. Set target audience
6. Set start/end dates
7. Publish

---

## 🔧 API Endpoints Summary

### Clinics
- `GET /api/clinics` - List all
- `POST /api/clinics` - Create
- `GET /api/clinics/[id]` - Get details
- `PATCH /api/clinics/[id]` - Update
- `DELETE /api/clinics/[id]` - Deactivate

### Whitelist
- `GET /api/clinics/[id]/whitelist` - List
- `POST /api/clinics/[id]/whitelist` - Add
- `DELETE /api/clinics/[id]/whitelist?email=xxx` - Remove
- `GET /api/admin/whitelist/pending` - Pending
- `POST /api/admin/whitelist/approve` - Approve
- `POST /api/admin/whitelist/reject` - Reject

### Care Plans
- `GET /api/care-plans` - List
- `POST /api/care-plans` - Create
- `PATCH /api/care-plans/[id]` - Update

### Campaigns
- `GET /api/campaigns` - List
- `POST /api/campaigns` - Create
- `PATCH /api/campaigns/[id]` - Update

### Analytics
- `GET /api/admin/analytics` - Dashboard data
- `GET /api/admin/stats` - Quick stats

---

## 🎨 UI Components

### Admin Layout
- Navigation sidebar
- Header with user info
- Role badge (Super Admin, Clinic Manager)
- Quick actions menu

### Dashboard Cards
- Stat cards with icons
- Trend indicators (up/down arrows)
- Color-coded status badges
- Real-time updates

### Data Tables
- Sortable columns
- Search/filter functionality
- Pagination
- Bulk actions

### Forms
- Modal dialogs
- Inline editing
- Validation
- Loading states

---

## 🔍 Monitoring & Alerts

### Real-time Monitoring
- Active users count
- System load percentage
- API call volume
- Error tracking
- Response time metrics

### Alert System
- Critical alerts (red)
- Error alerts (orange)
- Warning alerts (yellow)
- Info alerts (blue)

### Alert Types
- System health issues
- Performance degradation
- Security incidents
- Vendor issues
- Staff productivity concerns

---

## 📱 Mobile Responsiveness

All admin pages are fully responsive:
- Desktop: Full sidebar navigation
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation bar

---

## 🔒 Security Features

1. **Role-based Access Control**: Strict role checking on all routes
2. **Clerk Authentication**: Industry-standard auth
3. **API Protection**: All endpoints require authentication
4. **Audit Logging**: Track all admin actions
5. **Rate Limiting**: Prevent abuse
6. **CORS Protection**: Secure API access

---

## 📈 Performance

- **Real-time Updates**: Auto-refresh every 30 seconds
- **Optimized Queries**: Indexed database queries
- **Caching**: Redis caching for frequently accessed data
- **Lazy Loading**: Components load on demand
- **Code Splitting**: Optimized bundle sizes

---

## 🎯 Next Steps

1. **Add More Admins**: Update the super admin email list
2. **Create Clinics**: Set up your first clinic
3. **Whitelist Parents**: Add parent emails
4. **Create Care Plans**: Define subscription tiers
5. **Launch Campaigns**: Engage with parents
6. **Monitor Analytics**: Track system health

---

## 📞 Support

For admin support, contact:
- **Email**: satish@skids.health
- **Email**: drpratichi@skids.health

---

**Last Updated**: December 2, 2024
**Version**: 1.0.0
