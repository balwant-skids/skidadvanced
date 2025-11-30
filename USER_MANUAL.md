# 📚 SKIDS Advanced - Complete User Manual

**Version:** 1.0  
**Last Updated:** November 30, 2024  
**Production URL:** https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/

---

## 🎯 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Test Accounts](#test-accounts)
5. [Complete User Flows](#complete-user-flows)
6. [Features Guide](#features-guide)
7. [Troubleshooting](#troubleshooting)

---

## 📖 Introduction

SKIDS Advanced is a comprehensive pediatric health screening platform that helps clinics manage child health assessments, track development, and engage parents in their child's health journey.

### Key Features:
- ✅ Multi-clinic support
- ✅ Parent registration with clinic codes
- ✅ Child profile management
- ✅ Health assessments and screenings
- ✅ Educational content integration
- ✅ Secure authentication (Clerk)
- ✅ Real-time notifications (Firebase)
- ✅ File storage (Cloudflare R2)

---

## 🚀 Getting Started

### Step 1: Access the Application

**Production URL:** https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/

### Step 2: Choose Your Path

**For Parents:**
1. Click "Begin Discovery Journey" on homepage
2. Click "Sign Up" if you're new
3. Enter your clinic code
4. Complete registration

**For Admins:**
1. Go directly to Sign In
2. Use admin credentials
3. Access admin dashboard

---

## 👥 User Roles

### 1. Super Admin
- **Access:** Full system access
- **Capabilities:**
  - Manage all clinics
  - View all data
  - System configuration
  - User management

### 2. Clinic Admin
- **Access:** Single clinic access
- **Capabilities:**
  - Manage clinic settings
  - View clinic patients
  - Generate reports
  - Manage staff

### 3. Parent
- **Access:** Own family data
- **Capabilities:**
  - Register children
  - View assessments
  - Track development
  - Access educational content

---

## 🔑 Test Accounts

### Admin Accounts

| Role | Email | Clinic | Clinic Code |
|------|-------|--------|-------------|
| Super Admin | admin@skids.health | Mumbai Pediatric Center | MPC001 |
| Mumbai Admin | mumbai.admin@skids.health | Mumbai Pediatric Center | MPC001 |
| Delhi Admin | delhi.admin@skids.health | Delhi Children's Hospital | DCH001 |

### Clinic Information

| Clinic Name | Code | Location | Phone |
|-------------|------|----------|-------|
| Mumbai Pediatric Center | **MPC001** | Andheri West, Mumbai | +91-22-2673-4567 |
| Delhi Children's Hospital | **DCH001** | Connaught Place, Delhi | +91-11-4567-8901 |
| Bangalore Kids Clinic | **BKC001** | Koramangala, Bangalore | +91-80-4123-4567 |
| Chennai Pediatric Care | **CPC001** | T Nagar, Chennai | +91-44-2345-6789 |
| Pune Child Health Center | **PCHC01** | Kothrud, Pune | +91-20-2567-8901 |

### Test Parent Accounts

#### Mumbai Clinic (Code: MPC001)
| Name | Email | Phone |
|------|-------|-------|
| Priya Sharma | priya.sharma@example.com | +91-98765-11111 |
| Rajesh Kumar | rajesh.kumar@example.com | +91-98765-11112 |
| Anita Patel | anita.patel@example.com | +91-98765-11113 |

#### Delhi Clinic (Code: DCH001)
| Name | Email | Phone |
|------|-------|-------|
| Amit Singh | amit.singh@example.com | +91-98765-22221 |
| Neha Gupta | neha.gupta@example.com | +91-98765-22222 |
| Vikram Mehta | vikram.mehta@example.com | +91-98765-22223 |

#### Bangalore Clinic (Code: BKC001)
| Name | Email | Phone |
|------|-------|-------|
| Lakshmi Reddy | lakshmi.reddy@example.com | +91-98765-33331 |
| Karthik Rao | karthik.rao@example.com | +91-98765-33332 |
| Divya Nair | divya.nair@example.com | +91-98765-33333 |

#### Chennai Clinic (Code: CPC001)
| Name | Email | Phone |
|------|-------|-------|
| Suresh Iyer | suresh.iyer@example.com | +91-98765-44441 |
| Meena Krishnan | meena.krishnan@example.com | +91-98765-44442 |
| Ravi Subramanian | ravi.subramanian@example.com | +91-98765-44443 |

#### Pune Clinic (Code: PCHC01)
| Name | Email | Phone |
|------|-------|-------|
| Pooja Deshmukh | pooja.deshmukh@example.com | +91-98765-55551 |
| Sandeep Joshi | sandeep.joshi@example.com | +91-98765-55552 |
| Kavita Kulkarni | kavita.kulkarni@example.com | +91-98765-55553 |

---

## 🔄 Complete User Flows

### Flow 1: Parent Registration & First Login

**Step 1: Access Sign-Up Page**
```
URL: https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-up
```

**Step 2: Enter Clinic Code**
- Enter one of the clinic codes (e.g., **MPC001**)
- Click "Continue"

**Step 3: Choose Authentication Method**
- **Option A:** Continue with Google
- **Option B:** Enter email address

**Step 4: Complete Registration**
- If using email: Check your email for verification
- If using Google: Authorize Google account
- Complete profile information

**Step 5: Access Dashboard**
- You'll be redirected to your parent dashboard
- See welcome message
- View available features

---

### Flow 2: Adding a Child Profile

**Step 1: Navigate to Children Section**
- From dashboard, click "Children" or "Add Child"

**Step 2: Enter Child Information**
- **Required Fields:**
  - Child's full name
  - Date of birth
  - Gender
- **Optional Fields:**
  - Photo
  - Medical history
  - Allergies
  - Notes

**Step 3: Save Profile**
- Click "Save" or "Add Child"
- Child profile is created
- You'll see the child in your dashboard

---

### Flow 3: Taking an Assessment

**Step 1: Select Child**
- From dashboard, select the child
- Click "Start Assessment" or "New Screening"

**Step 2: Choose Assessment Type**
- **Developmental Screening**
- **Growth Monitoring**
- **Behavioral Assessment**
- **Health Check**

**Step 3: Complete Assessment**
- Answer all questions
- Follow on-screen instructions
- Save progress (can resume later)

**Step 4: View Results**
- See assessment results
- View recommendations
- Download report (PDF)
- Share with doctor

---

### Flow 4: Admin - Managing Clinic

**Step 1: Admin Login**
```
URL: https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-in
Email: mumbai.admin@skids.health (or other admin email)
```

**Step 2: Access Admin Dashboard**
- View clinic statistics
- See registered parents
- Monitor assessments
- Check system health

**Step 3: Manage Parents**
- View parent list
- Add to whitelist
- Remove access
- View parent activity

**Step 4: Generate Reports**
- Select date range
- Choose report type
- Export data (CSV/PDF)
- Share with stakeholders

---

### Flow 5: Admin - Adding Parents to Whitelist

**Step 1: Access Whitelist Management**
- From admin dashboard
- Click "Whitelist" or "Manage Parents"

**Step 2: Add New Parent**
- Click "Add Parent"
- Enter details:
  - Email address
  - Full name
  - Phone number
  - Clinic assignment

**Step 3: Send Invitation**
- System sends email invitation
- Parent receives clinic code
- Parent can now register

---

## 📱 Features Guide

### 1. Dashboard

**Parent Dashboard:**
- Overview of all children
- Recent assessments
- Upcoming appointments
- Educational content
- Notifications

**Admin Dashboard:**
- Clinic statistics
- Active users
- Assessment completion rates
- System alerts
- Quick actions

### 2. Child Profiles

**Information Stored:**
- Personal details (name, DOB, gender)
- Medical history
- Growth charts
- Assessment history
- Photos and documents
- Parent notes

**Actions Available:**
- Edit profile
- Add medical history
- Upload documents
- View growth trends
- Schedule assessments

### 3. Assessments

**Types Available:**
- **Developmental Screening:** Milestones, motor skills, language
- **Growth Monitoring:** Height, weight, BMI tracking
- **Behavioral Assessment:** Social, emotional development
- **Health Check:** General health, symptoms

**Features:**
- Progress saving
- Multi-page forms
- Photo/video upload
- Automatic scoring
- Instant results
- PDF reports

### 4. Educational Content

**Content Partners:**
- Kurzgesagt
- National Geographic Kids
- Discovery Kids
- BrainPOP
- TED-Ed

**Content Types:**
- Videos
- Articles
- Interactive activities
- Quizzes
- Age-appropriate recommendations

### 5. Notifications

**Types:**
- Assessment reminders
- Appointment notifications
- New content alerts
- System updates
- Clinic announcements

**Delivery Methods:**
- In-app notifications
- Email
- Push notifications (if enabled)
- SMS (optional)

---

## 🔧 Troubleshooting

### Issue 1: Can't Sign Up

**Problem:** "Clinic code not recognized"

**Solution:**
1. Verify you're using the correct clinic code
2. Check with your clinic for the correct code
3. Ensure code is entered in UPPERCASE
4. Contact admin if issue persists

**Valid Codes:**
- MPC001 (Mumbai)
- DCH001 (Delhi)
- BKC001 (Bangalore)
- CPC001 (Chennai)
- PCHC01 (Pune)

---

### Issue 2: Email Not Whitelisted

**Problem:** "Your email is not authorized"

**Solution:**
1. Contact your clinic admin
2. Provide your email address
3. Admin will add you to whitelist
4. Try signing up again after 5 minutes

---

### Issue 3: Can't Access Dashboard

**Problem:** Stuck on loading screen

**Solution:**
1. Clear browser cache
2. Try incognito/private mode
3. Check internet connection
4. Try different browser
5. Contact support if issue persists

---

### Issue 4: Assessment Not Saving

**Problem:** Progress lost when navigating away

**Solution:**
1. Ensure stable internet connection
2. Click "Save Progress" button regularly
3. Don't close browser tab during assessment
4. Use "Resume" feature if interrupted

---

### Issue 5: Can't Upload Files

**Problem:** File upload fails

**Solution:**
1. Check file size (max 10MB)
2. Verify file format (JPG, PNG, PDF)
3. Ensure stable internet connection
4. Try compressing large files
5. Contact support for large file uploads

---

## 📞 Support & Contact

### Technical Support
- **Email:** support@skids.health
- **Phone:** +91-22-2673-4567
- **Hours:** Monday-Friday, 9 AM - 6 PM IST

### Clinic-Specific Support

**Mumbai Pediatric Center:**
- Email: contact@mumbaipediatric.com
- Phone: +91-22-2673-4567

**Delhi Children's Hospital:**
- Email: info@delhichildrens.com
- Phone: +91-11-4567-8901

**Bangalore Kids Clinic:**
- Email: hello@bangalorekids.com
- Phone: +91-80-4123-4567

**Chennai Pediatric Care:**
- Email: care@chennaipediatric.com
- Phone: +91-44-2345-6789

**Pune Child Health Center:**
- Email: contact@punechildhealth.com
- Phone: +91-20-2567-8901

---

## 🔐 Security & Privacy

### Data Protection
- All data encrypted in transit (HTTPS)
- Secure authentication (Clerk)
- HIPAA-compliant storage
- Regular security audits
- Access controls and permissions

### Privacy Policy
- Data used only for health screening
- No data sharing without consent
- Parent controls data access
- Right to delete data
- Transparent data practices

---

## 📊 Quick Reference

### Important URLs

| Purpose | URL |
|---------|-----|
| Homepage | https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/ |
| Sign In | https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-in |
| Sign Up | https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/sign-up |

### Clinic Codes Quick Reference

| Code | Clinic | City |
|------|--------|------|
| **MPC001** | Mumbai Pediatric Center | Mumbai |
| **DCH001** | Delhi Children's Hospital | Delhi |
| **BKC001** | Bangalore Kids Clinic | Bangalore |
| **CPC001** | Chennai Pediatric Care | Chennai |
| **PCHC01** | Pune Child Health Center | Pune |

---

## 🎓 Training Resources

### Video Tutorials
- Getting Started (5 min)
- Adding Your First Child (3 min)
- Taking an Assessment (10 min)
- Understanding Results (7 min)
- Admin Features (15 min)

### Documentation
- API Documentation
- Developer Guide
- Admin Manual
- Parent Guide
- Clinic Setup Guide

---

## 📈 System Status

**Current Version:** 1.0  
**Last Updated:** November 30, 2024  
**Status:** ✅ Operational  
**Uptime:** 99.9%

**Recent Updates:**
- ✅ Clerk authentication integrated
- ✅ Multi-clinic support added
- ✅ Educational content partnerships
- ✅ Mobile-responsive design
- ✅ Push notifications enabled

---

## 🎉 Getting Help

**Need Help?**
1. Check this manual first
2. Review troubleshooting section
3. Contact your clinic admin
4. Email technical support
5. Call support hotline

**Feedback:**
We value your feedback! Please share your experience:
- Email: feedback@skids.health
- In-app feedback form
- Clinic feedback sessions

---

**Thank you for using SKIDS Advanced!** 🚀

*Empowering parents and clinics to ensure every child's healthy development.*
