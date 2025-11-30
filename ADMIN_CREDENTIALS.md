# 🔐 SKIDS Advanced - Admin Credentials

**CONFIDENTIAL - For Internal Use Only**

---

## 👨‍💼 Super Admin Accounts

### 1. Satish (Owner)
- **Email:** satish@skids.health
- **Role:** Super Admin
- **Access:** Full system access
- **Capabilities:**
  - Add/remove clinics
  - Manage all admins
  - View all data across clinics
  - System configuration
  - User management
  - Reports and analytics

### 2. Dr. Pratichi (Co-Admin)
- **Email:** drpratichi@skids.health
- **Role:** Super Admin
- **Access:** Full system access
- **Capabilities:**
  - Add/remove clinics
  - Manage all admins
  - View all data across clinics
  - System configuration
  - User management
  - Reports and analytics

---

## 🎭 Demo Accounts

### 1. Demo Account (For Demonstrations)
- **Email:** demo@skids.health
- **Password:** *(Set during first login)*
- **Purpose:** Product demonstrations, client presentations
- **Access:** Full parent + admin features
- **Clinic:** Mumbai Pediatric Center (MPC001)
- **Note:** Can be used to showcase all features

### 2. Marketing Account (For Marketing)
- **Email:** marketing@skids.health
- **Password:** *(Set during first login)*
- **Purpose:** Marketing materials, screenshots, videos
- **Access:** Full parent + admin features
- **Clinic:** Mumbai Pediatric Center (MPC001)
- **Note:** Use for creating marketing content

---

## 🏥 Clinic Codes

| Code | Clinic Name | Location |
|------|-------------|----------|
| **MPC001** | Mumbai Pediatric Center | Mumbai, Maharashtra |
| **DCH001** | Delhi Children's Hospital | New Delhi, Delhi |
| **BKC001** | Bangalore Kids Clinic | Bangalore, Karnataka |
| **CPC001** | Chennai Pediatric Care | Chennai, Tamil Nadu |
| **PCHC01** | Pune Child Health Center | Pune, Maharashtra |

---

## 🔑 First-Time Setup

### For Super Admins (Satish & Dr. Pratichi):

**Step 1: Initial Sign-Up**
1. Go to: https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-up
2. Enter clinic code: **MPC001**
3. Use your email (satish@skids.health or drpratichi@skids.health)
4. Choose authentication method:
   - **Option A:** Continue with Google (recommended)
   - **Option B:** Email + Password
5. Complete registration

**Step 2: Verify Admin Access**
1. After login, you should see **Admin Dashboard**
2. Verify you can access:
   - Clinic Management
   - User Management
   - System Settings
   - Reports & Analytics

**Step 3: Set Up Additional Admins**
1. Go to "User Management" or "Admins"
2. Click "Add Admin"
3. Enter admin email and assign clinic
4. Admin receives invitation email

---

### For Demo Accounts:

**Step 1: Initial Setup**
1. Go to: https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-up
2. Enter clinic code: **MPC001**
3. Use demo email (demo@skids.health or marketing@skids.health)
4. Set a memorable password
5. Complete registration

**Step 2: Create Sample Data**
1. Add 2-3 child profiles
2. Complete sample assessments
3. Upload sample documents
4. Generate sample reports

**Step 3: Use for Demonstrations**
- Show parent portal features
- Demonstrate assessment flow
- Display reports and analytics
- Showcase educational content

---

## 📊 Role-Based Access

### Super Admin Can:
✅ Add/remove clinics  
✅ Manage all clinic admins  
✅ View data across all clinics  
✅ Configure system settings  
✅ Generate system-wide reports  
✅ Manage user roles and permissions  
✅ Access all features  

### Clinic Admin Can:
✅ Manage their clinic settings  
✅ Add parents to whitelist  
✅ View clinic patients  
✅ Generate clinic reports  
✅ Manage clinic staff  
❌ Cannot add/remove clinics  
❌ Cannot access other clinics' data  

### Parent Can:
✅ Manage their children's profiles  
✅ Take assessments  
✅ View reports  
✅ Access educational content  
✅ Upload documents  
❌ Cannot access admin features  
❌ Cannot see other families' data  

---

## 🧪 Testing Checklist

### Test 1: Super Admin Access
- [ ] Login with satish@skids.health
- [ ] Verify Admin Dashboard loads
- [ ] Check "Add Clinic" option exists
- [ ] Check "Manage Admins" option exists
- [ ] Verify can view all clinics
- [ ] Test adding a new clinic
- [ ] Test adding a clinic admin

### Test 2: Clinic Admin Access
- [ ] Create a clinic admin account
- [ ] Login as clinic admin
- [ ] Verify Admin Dashboard loads
- [ ] Check can only see assigned clinic
- [ ] Test adding parent to whitelist
- [ ] Verify cannot add clinics
- [ ] Verify cannot access other clinics

### Test 3: Parent Access
- [ ] Login with test parent email
- [ ] Verify Parent Portal loads (NOT Admin Dashboard)
- [ ] Check can add children
- [ ] Test taking assessment
- [ ] Verify cannot access admin features
- [ ] Check can view own data only

### Test 4: Demo Account
- [ ] Login with demo@skids.health
- [ ] Create sample child profiles
- [ ] Complete sample assessments
- [ ] Generate sample reports
- [ ] Take screenshots for marketing

---

## 🔒 Security Notes

### Important:
1. **Never share Super Admin credentials** publicly
2. **Use strong passwords** for all accounts
3. **Enable 2FA** when available
4. **Regularly review** user access
5. **Audit logs** for suspicious activity
6. **Rotate passwords** every 90 days

### For Demo Accounts:
1. **Use generic data** only (no real patient info)
2. **Reset regularly** to remove old demo data
3. **Monitor usage** to prevent misuse
4. **Disable if not needed** for extended periods

---

## 📞 Support

**Technical Issues:**
- Contact: Satish (satish@skids.health)
- Emergency: +91-98765-00001

**Account Issues:**
- Reset password via Clerk
- Contact super admin for role changes
- Check whitelist if cannot register

---

## 🔄 Password Reset

If you forget your password:

1. Go to sign-in page
2. Click "Forgot password?"
3. Enter your email
4. Check email for reset link
5. Set new password
6. Login with new credentials

---

## 📝 Change Log

**November 30, 2024:**
- ✅ Added satish@skids.health as Super Admin
- ✅ Added drpratichi@skids.health as Super Admin
- ✅ Created demo@skids.health for demonstrations
- ✅ Created marketing@skids.health for marketing
- ✅ Removed fake test admin emails
- ✅ Configured role-based access

---

**KEEP THIS DOCUMENT SECURE AND CONFIDENTIAL** 🔒
