# 🚀 Super Admin User Guide - SKIDS Advanced

## 📍 Deployment Information

### Latest Production Deployment (with all enhancements)
**Vercel URL**: https://skidsa1-i69e8zyb2-satishs-projects-89f8c44c.vercel.app

**Git Repository**: https://github.com/satishskids-org/skidsadv_new.git
- Branch: `main`
- Latest Commit: Admin dashboard enhancements (analytics, bulk ops, CSV export, search/filter)

### Alternative URLs
- **13h ago deployment**: https://skidsa1-aa34e3old-satishs-projects-89f8c44c.vercel.app
- **Existing domain** (older version): https://skidsadvanced.vercel.app

---

## 👤 Super Admin Login Flow

### Step 1: Access the Application
1. Go to: https://skidsa1-i69e8zyb2-satishs-projects-89f8c44c.vercel.app
2. Click **"Get Started"** or **"Sign In"** button in the navigation

### Step 2: Sign In with Clerk
1. You'll be redirected to Clerk authentication page
2. Enter your super admin credentials:
   - Email: [Your super admin email]
   - Password: [Your password]
3. Or use social login if configured (Google, etc.)

### Step 3: Automatic Role Detection
- After successful login, the system checks your role in the database
- If you're a `super_admin`, you'll have access to all admin features
- You'll be redirected to `/admin/dashboard` or `/provider` (admin landing page)

---

## 🎯 Super Admin Features & Capabilities

### 1️⃣ **Admin Dashboard** (`/admin/dashboard`)

**What You See:**
- 📊 Total Clinics count
- 👥 Total Admins count
- 👨‍👩‍👧‍👦 Total Parents count
- 👶 Total Children count

**What You Can Do:**
- View system-wide statistics
- Quick overview of platform health
- Navigate to other admin sections

---

### 2️⃣ **Analytics Dashboard** (`/admin/analytics`) 🆕

**What You See:**
- **Metric Cards:**
  - Total Clinics
  - Total Parents
  - Total Children
  - Total Active Subscriptions

- **Charts:**
  - 📈 **Registrations Over Time** (Line Chart)
    - Shows parent registrations for last 30 days
    - Trend analysis
  
  - 🥧 **Subscription Distribution** (Pie Chart)
    - Breakdown by care plan
    - Percentage distribution
  
  - 📊 **Children Per Clinic** (Bar Chart)
    - Top 10 clinics by child count
    - Comparative view

**What You Can Do:**
- View real-time analytics (auto-refreshes every 30 seconds)
- Click manual refresh button
- See last updated timestamp
- Export data for reporting

---

### 3️⃣ **Clinic Management** (`/admin/clinics`)

**What You See:**
- List of all clinics with:
  - Clinic name
  - Unique 6-character code
  - Status (Active/Inactive)
  - Contact information (address, phone, email, WhatsApp)
  - Parent count
  - Whitelist count

**What You Can Do:**
- ➕ **Create New Clinic**
  - Enter clinic name (required)
  - Add address, phone, email, WhatsApp
  - System auto-generates unique 6-character code
  - Assign clinic manager (optional)

- ✏️ **Edit Clinic**
  - Update clinic information
  - Change contact details
  - Modify clinic settings

- 🔄 **Activate/Deactivate Clinic**
  - Toggle clinic status
  - Inactive clinics cannot accept new parents

- 🔍 **Search Clinics** 🆕
  - Search by name, code, or email
  - Real-time filtering

- 🎯 **Filter Clinics** 🆕
  - Filter by status (Active/Inactive)
  - Combine search and filters

- 📥 **Export Clinics** 🆕
  - Download all clinic data as CSV
  - Includes all fields and counts
  - Timestamped filename

---

### 4️⃣ **Parent Whitelist & Approval** (`/admin/whitelist`)

**What You See:**
- List of pending parents (not yet approved):
  - Email address
  - Name
  - Registration date
  - Status (Pending)

**What You Can Do:**

**Individual Actions:**
- ✅ **Approve Parent**
  1. Select a care plan from dropdown
  2. Click "Approve" button
  3. Parent gets:
     - `isActive` set to `true`
     - Assigned care plan
     - Active subscription created
     - Can now access parent dashboard

- ❌ **Reject Parent**
  1. Click "Reject" button
  2. Confirm rejection
  3. Parent remains inactive
  4. Can be removed from system

**Bulk Operations:** 🆕
- ☑️ **Select Multiple Parents**
  - Use checkboxes to select parents
  - "Select All" checkbox for all on page
  - Selected count displayed

- ✅ **Bulk Approve**
  1. Select multiple parents
  2. Click "Bulk Approve" button
  3. Choose care plan for all
  4. Confirm with count
  5. See progress indicator
  6. View success/error summary

- ❌ **Bulk Reject**
  1. Select multiple parents
  2. Click "Bulk Reject" button
  3. Confirm with count
  4. See progress indicator
  5. View success/error summary

---

### 5️⃣ **Parent Management** (`/admin/parents`)

**What You See:**
- List of all parents (approved and pending):
  - Name
  - Email
  - Clinic assignment
  - Subscription status
  - Number of children
  - Registration date

**What You Can Do:**
- View all parents across all clinics
- See parent details
- Check subscription status
- View associated children count
- 📥 **Export Parents** 🆕
  - Download all parent data as CSV
  - Includes subscription info
  - Timestamped filename

---

### 6️⃣ **Care Plan Management** (`/admin/care-plans`)

**What You See:**
- List of all care plans:
  - Plan name
  - Description
  - Price (in INR)
  - Billing cycle (monthly/yearly)
  - Features list
  - Active/Inactive status
  - Display order

**What You Can Do:**
- ➕ **Create New Care Plan**
  - Set plan name and description
  - Define price and billing cycle
  - Add features list
  - Set display order
  - Activate/deactivate

- ✏️ **Edit Care Plan**
  - Update plan details
  - Modify pricing
  - Change features
  - Reorder plans

- 🔄 **Activate/Deactivate Plan**
  - Toggle plan availability
  - Inactive plans not shown to new users

- 🏥 **Clinic-Specific Plans**
  - Create plans for specific clinics
  - Or create global plans (available to all)

---

### 7️⃣ **Campaign Management** (`/admin/campaigns`)

**What You See:**
- List of all campaigns:
  - Campaign title
  - Description
  - Status (Draft/Active/Completed/Archived)
  - Target audience
  - Start/End dates
  - View/Click counts

**What You Can Do:**
- ➕ **Create Campaign**
  - Set title and description
  - Add content (rich text)
  - Upload media (image/video/PDF)
  - Define target audience:
    - All users
    - Specific clinic
    - Specific care plan
  - Set CTA (Call-to-Action) button
  - Schedule start/end dates

- ✏️ **Edit Campaign**
  - Update campaign details
  - Change targeting
  - Modify schedule

- 📊 **View Analytics**
  - See view count
  - Track click-through rate
  - Monitor engagement

- 🔄 **Change Status**
  - Draft → Active → Completed → Archived
  - Control campaign lifecycle

---

### 8️⃣ **Staff Management** (`/admin/staff-management`)

**What You Can Do:**
- View all admin users
- Create new clinic managers
- Assign clinic managers to clinics
- Manage admin permissions
- Deactivate admin accounts

---

### 9️⃣ **Vendor Management** (`/admin/vendor-management`)

**What You Can Do:**
- Manage external vendors
- Track vendor relationships
- View vendor services
- Manage vendor contracts

---

## 🔐 Access Control Summary

### What Super Admin CAN Do:
✅ Access ALL admin routes
✅ View data from ALL clinics
✅ Create/Edit/Delete clinics
✅ Approve/Reject parents (individual & bulk)
✅ Create/Edit care plans (global & clinic-specific)
✅ Create/Edit campaigns
✅ Manage clinic managers
✅ View system-wide analytics
✅ Export all data
✅ Search and filter across all data

### What Super Admin CANNOT Do:
❌ Access parent dashboard (different role)
❌ Impersonate other users (not implemented)

---

## 🎨 Navigation Structure

```
After Login → /admin/dashboard (or /provider)
├── Dashboard (Overview)
├── Analytics (Charts & Metrics) 🆕
├── Clinics (Clinic Management)
├── Whitelist (Parent Approval)
├── Parents (Parent List)
├── Care Plans (Plan Management)
├── Campaigns (Campaign Management)
├── Staff Management
└── Vendor Management
```

---

## 🔄 Typical Super Admin Workflows

### Workflow 1: Onboard a New Clinic
1. Go to `/admin/clinics`
2. Click "Add Clinic"
3. Enter clinic details
4. System generates unique code
5. Optionally assign clinic manager
6. Clinic is now active

### Workflow 2: Approve Parents (Bulk)
1. Go to `/admin/whitelist`
2. See list of pending parents
3. Select multiple parents using checkboxes
4. Click "Bulk Approve"
5. Choose care plan
6. Confirm
7. Watch progress
8. Review success/error summary
9. Parents can now log in

### Workflow 3: Create a Campaign
1. Go to `/admin/campaigns`
2. Click "Create Campaign"
3. Enter title and content
4. Upload media
5. Set target audience (all/clinic/plan)
6. Add CTA button
7. Schedule dates
8. Activate campaign
9. Monitor analytics

### Workflow 4: View Analytics
1. Go to `/admin/analytics`
2. View metric cards
3. Analyze charts:
   - Registration trends
   - Subscription distribution
   - Clinic performance
4. Click refresh for latest data
5. Export data if needed

### Workflow 5: Export Data
1. Go to `/admin/clinics` or `/admin/parents`
2. Click "Export CSV" button
3. Wait for generation (progress shown)
4. File downloads automatically
5. Filename includes timestamp

---

## 🆘 Troubleshooting

### Can't Access Admin Dashboard?
- Check your role in database (must be `super_admin`)
- Clear browser cache and cookies
- Try logging out and back in
- Contact system administrator

### Don't See All Clinics?
- Verify you're logged in as `super_admin` (not `clinic_manager`)
- Clinic managers only see their assigned clinic

### Bulk Operations Not Working?
- Ensure you've selected at least one parent
- Check that you've selected a care plan (for bulk approve)
- Verify network connection
- Check browser console for errors

---

## 📞 Support

For technical issues or questions:
- Check the RBAC_ANALYSIS.md document
- Review API documentation
- Contact development team

---

## 🔗 Quick Links

- **Production App**: https://skidsa1-i69e8zyb2-satishs-projects-89f8c44c.vercel.app
- **Git Repository**: https://github.com/satishskids-org/skidsadv_new.git
- **Admin Dashboard**: /admin/dashboard
- **Analytics**: /admin/analytics
- **Whitelist**: /admin/whitelist

---

**Last Updated**: December 3, 2024
**Version**: Latest with Admin Dashboard Enhancements
