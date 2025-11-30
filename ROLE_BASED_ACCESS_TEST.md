# 🧪 Role-Based Access Testing Guide

**Purpose:** Verify that different user roles see appropriate dashboards and features

---

## 🎯 Test Scenarios

### Test 1: Super Admin Access ✅

**Account:** satish@skids.health or drpratichi@skids.health  
**Expected:** Admin Dashboard with full access

**Steps:**
1. Go to: https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-up
2. Enter clinic code: **MPC001**
3. Enter email: satish@skids.health
4. Complete registration (Google or Email)
5. After login, verify you see:

**Expected Features:**
- ✅ **Admin Dashboard** (NOT Parent Portal)
- ✅ "Clinics" menu - Add/Edit/Delete clinics
- ✅ "Admins" menu - Manage clinic admins
- ✅ "Users" menu - View all users across clinics
- ✅ "Whitelist" menu - Manage parent whitelist
- ✅ "Reports" menu - System-wide analytics
- ✅ "Settings" menu - System configuration
- ✅ Can switch between clinics
- ✅ Can view data from all clinics

**Test Actions:**
- [ ] Try adding a new clinic
- [ ] Try adding a clinic admin
- [ ] Try viewing users from different clinics
- [ ] Try generating system-wide report

---

### Test 2: Clinic Admin Access ✅

**Account:** Create a new clinic admin  
**Expected:** Admin Dashboard with clinic-specific access

**Setup:**
1. Login as Super Admin (satish@skids.health)
2. Go to "Admins" → "Add Admin"
3. Create admin for Delhi clinic:
   - Email: delhi.admin@example.com
   - Clinic: Delhi Children's Hospital (DCH001)
   - Role: Clinic Admin
4. Logout and login as delhi.admin@example.com

**Expected Features:**
- ✅ **Admin Dashboard** (NOT Parent Portal)
- ✅ "My Clinic" menu - Edit clinic settings
- ✅ "Whitelist" menu - Add parents to their clinic only
- ✅ "Patients" menu - View clinic patients only
- ✅ "Reports" menu - Clinic-specific analytics
- ❌ **Cannot** add/remove clinics
- ❌ **Cannot** access other clinics' data
- ❌ **Cannot** manage other admins

**Test Actions:**
- [ ] Try adding parent to whitelist (should work)
- [ ] Try viewing patients (should see Delhi clinic only)
- [ ] Try accessing Mumbai clinic data (should be blocked)
- [ ] Try adding a new clinic (option should not exist)

---

### Test 3: Parent Access ✅

**Account:** priya.sharma@example.com  
**Expected:** Parent Portal (NOT Admin Dashboard)

**Steps:**
1. Go to: https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-up
2. Enter clinic code: **MPC001**
3. Enter email: priya.sharma@example.com
4. Complete registration
5. After login, verify you see:

**Expected Features:**
- ✅ **Parent Portal** (NOT Admin Dashboard)
- ✅ "My Children" - Add/manage children
- ✅ "Assessments" - Take health screenings
- ✅ "Reports" - View child reports
- ✅ "Educational Content" - Access resources
- ✅ "Profile" - Manage own profile
- ❌ **No** admin menus
- ❌ **No** clinic management options
- ❌ **No** user management options
- ❌ **Cannot** see other families' data

**Test Actions:**
- [ ] Try adding a child profile (should work)
- [ ] Try taking an assessment (should work)
- [ ] Try accessing admin features (should not exist)
- [ ] Try viewing other families' data (should be blocked)

---

### Test 4: Demo Account Access ✅

**Account:** demo@skids.health  
**Expected:** Full access for demonstration purposes

**Steps:**
1. Go to: https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-up
2. Enter clinic code: **MPC001**
3. Enter email: demo@skids.health
4. Complete registration
5. Create sample data:
   - Add 2-3 children
   - Complete assessments
   - Upload documents
   - Generate reports

**Expected Features:**
- ✅ Can access both Parent Portal and Admin features
- ✅ Can create realistic demo scenarios
- ✅ Can showcase all features
- ✅ Data is isolated to demo account

**Test Actions:**
- [ ] Create complete family profile
- [ ] Complete multiple assessments
- [ ] Generate various reports
- [ ] Take screenshots for marketing
- [ ] Record demo videos

---

## 🔍 Verification Checklist

### Dashboard Routing
- [ ] Super Admin → Admin Dashboard
- [ ] Clinic Admin → Admin Dashboard (limited)
- [ ] Parent → Parent Portal
- [ ] Demo → Full access

### Feature Access
- [ ] Super Admin can add clinics
- [ ] Clinic Admin cannot add clinics
- [ ] Parent cannot access admin features
- [ ] Each role sees appropriate menus

### Data Isolation
- [ ] Super Admin sees all clinics
- [ ] Clinic Admin sees only their clinic
- [ ] Parent sees only their family
- [ ] No cross-access between roles

### Security
- [ ] Cannot access unauthorized routes
- [ ] API calls respect role permissions
- [ ] Database queries filter by role
- [ ] Webhooks validate user roles

---

## 🐛 Common Issues & Solutions

### Issue 1: Parent Sees Admin Dashboard

**Problem:** Parent account shows admin features

**Cause:** Role not properly set in database

**Solution:**
```sql
-- Check user role
SELECT id, email, role FROM User WHERE email = 'parent@example.com';

-- Update role if needed
UPDATE User SET role = 'PARENT' WHERE email = 'parent@example.com';
```

---

### Issue 2: Admin Cannot Add Clinic

**Problem:** Super Admin doesn't see "Add Clinic" option

**Cause:** Role is set to CLINIC_ADMIN instead of SUPER_ADMIN

**Solution:**
```sql
-- Update to Super Admin
UPDATE User SET role = 'SUPER_ADMIN' WHERE email = 'satish@skids.health';
```

---

### Issue 3: Clinic Admin Sees Other Clinics

**Problem:** Clinic Admin can access data from other clinics

**Cause:** Clinic assignment not properly set

**Solution:**
```sql
-- Check clinic assignment
SELECT id, email, role, clinicId FROM User WHERE email = 'admin@example.com';

-- Update clinic assignment
UPDATE User SET clinicId = 'clinic-delhi-001' WHERE email = 'delhi.admin@example.com';
```

---

## 📊 Test Results Template

### Test Date: _______________
### Tester: _______________

| Test | Account | Expected Result | Actual Result | Status |
|------|---------|----------------|---------------|--------|
| Super Admin Dashboard | satish@skids.health | Admin Dashboard | | ⬜ Pass ⬜ Fail |
| Super Admin Add Clinic | satish@skids.health | Can add clinic | | ⬜ Pass ⬜ Fail |
| Clinic Admin Dashboard | delhi.admin@example.com | Admin Dashboard (limited) | | ⬜ Pass ⬜ Fail |
| Clinic Admin Data Isolation | delhi.admin@example.com | See Delhi only | | ⬜ Pass ⬜ Fail |
| Parent Portal | priya.sharma@example.com | Parent Portal | | ⬜ Pass ⬜ Fail |
| Parent No Admin Access | priya.sharma@example.com | No admin menus | | ⬜ Pass ⬜ Fail |
| Demo Account | demo@skids.health | Full access | | ⬜ Pass ⬜ Fail |

**Notes:**
```
[Add any observations or issues here]
```

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - Document any edge cases
   - Update user manual
   - Train team on role management
   - Deploy to production

2. **If tests fail:**
   - Document failures
   - Create bug tickets
   - Fix role-based routing
   - Re-test after fixes

3. **Additional testing:**
   - Test with real users
   - Load testing with multiple roles
   - Security penetration testing
   - Mobile device testing

---

## 📝 Testing Commands

### Check User Roles in Database
```bash
turso db shell skidsadvanced "SELECT email, role FROM User;"
```

### Check Clinic Assignments
```bash
turso db shell skidsadvanced "SELECT email, clinicId FROM User WHERE role = 'CLINIC_ADMIN';"
```

### Check Whitelist
```bash
turso db shell skidsadvanced "SELECT email, name, clinicId FROM ParentWhitelist;"
```

### Reset Demo Account
```bash
turso db shell skidsadvanced "DELETE FROM Child WHERE parentId IN (SELECT id FROM ParentProfile WHERE userId IN (SELECT id FROM User WHERE email = 'demo@skids.health'));"
```

---

**Start testing now!** 🧪
