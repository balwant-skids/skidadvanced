# 🎬 Demo Mode Setup - Complete Guide

**Goal:** Create a fully working demo with sample data that you can show to parents TODAY

---

## ✅ What Demo Mode Includes:

### Sample Data:
- **3 Children:** Aarav (5yo boy), Priya (3yo girl), Rohan (7yo boy)
- **3 Assessments:** Developmental, Growth, Behavioral
- **1 Health Report:** Comprehensive report for Aarav
- **2 Appointments:** 1 upcoming, 1 completed
- **2 Messages:** Welcome message, Appointment reminder

### Features Demonstrated:
- ✅ Parent dashboard with multiple children
- ✅ Child profile management
- ✅ Assessment history and results
- ✅ Health reports and recommendations
- ✅ Appointment scheduling
- ✅ System notifications
- ✅ Discovery educational content
- ✅ Growth tracking

---

## 🚀 Quick Setup (5 Minutes):

### Step 1: Load Demo Data

```bash
cd skidadvanced

# Load demo data into database
turso db shell skidsadvanced < seed-demo-data.sql
```

### Step 2: Test Demo Account

1. Go to: **https://skidsadvanced.vercel.app/sign-up**
2. Enter clinic code: **MPC001**
3. Sign in with: **demo@skids.health**
4. Complete registration
5. See demo data automatically!

---

## 👨‍💼 Super Admin Setup:

### Your Admin Accounts (Already Added):

| Email | Role | Access |
|-------|------|--------|
| **satish@skids.health** | Super Admin | Everything |
| **drpratichi@skids.health** | Super Admin | Everything |
| **demo@skids.health** | Demo Account | Full parent portal with sample data |
| **marketing@skids.health** | Marketing Demo | Full parent portal with sample data |

### To Use:

1. Go to: **https://skidsadvanced.vercel.app/sign-up**
2. Enter clinic code: **MPC001**
3. Sign in with your email
4. Access full portal!

---

## 🎬 Demo Script (7 Minutes):

### 1. Introduction (30 seconds)
"Let me show you SKIDS Advanced - a platform that makes tracking your child's health incredibly easy."

### 2. Sign Up (1 minute)
"Getting started is simple. Your pediatrician gives you a clinic code - here's MPC001. Just sign in with Google and you're in!"

**Show:**
- Enter clinic code
- Google sign-in
- Instant access

### 3. Dashboard Overview (1 minute)
"This is your parent dashboard. You can see all your children at a glance."

**Show:**
- 3 children displayed
- Quick stats for each
- Recent activity
- Upcoming appointments

### 4. Child Profile (1 minute)
"Let's look at Aarav's profile. You can see his complete health history, assessments, and growth tracking."

**Show:**
- Child details
- Medical history
- Allergies
- Assessment history

### 5. Assessment Results (1 minute)
"Here's a recent developmental assessment. You get detailed results and personalized recommendations."

**Show:**
- Assessment scores
- Results breakdown
- Recommendations
- Progress over time

### 6. Health Reports (1 minute)
"You can generate and download comprehensive health reports anytime."

**Show:**
- Report summary
- Growth charts
- Vaccination status
- Download PDF option

### 7. Discovery Page (1 minute)
"We've partnered with leading educational brands to bring you quality content about child development."

**Show:**
- Educational modules
- Video content
- Age-appropriate filtering
- Interactive learning

### 8. Appointments & Reminders (30 seconds)
"Never miss an appointment. You'll get automatic reminders and can schedule directly through the app."

**Show:**
- Upcoming appointments
- Past appointments
- Reminder notifications

### 9. Closing (30 seconds)
"Everything is secure, easy to use, and works on any device. Questions?"

---

## 📊 Demo Data Details:

### Child 1: Aarav Kumar (5 years old)
- **Gender:** Male
- **Health:** Excellent
- **Assessments:** Developmental screening (Score: 85/100)
- **Status:** All vaccinations up to date
- **Activities:** Cricket, Reading
- **Report:** Comprehensive health report available

### Child 2: Priya Sharma (3 years old)
- **Gender:** Female
- **Health:** Good
- **Assessments:** Growth monitoring (Score: 90/100)
- **Allergies:** Peanuts
- **Activities:** Drawing, Music
- **Appointment:** Upcoming check-up in 7 days

### Child 3: Rohan Patel (7 years old)
- **Gender:** Male
- **Health:** Good (Mild Asthma)
- **Assessments:** Behavioral assessment (Score: 78/100)
- **Allergies:** Dust
- **Medication:** Inhaler as needed
- **Appointment:** Recent follow-up completed

---

## 🎯 Key Points to Emphasize:

### 1. Easy to Use
"See how simple it is? Sign in with Google, enter your code, and you're done. No complicated setup."

### 2. Comprehensive
"Everything in one place - assessments, reports, appointments, educational content. No more juggling multiple apps."

### 3. Personalized
"Every child gets personalized recommendations based on their assessments and development stage."

### 4. Trusted
"We partner with leading educational brands like National Geographic Kids and BrainPOP."

### 5. Secure
"Bank-level security. Your data is encrypted and protected."

### 6. Accessible
"Works on your phone, tablet, or computer. Access from anywhere."

---

## 💬 Handling Common Questions:

**Q: How much does it cost?**
A: "Your clinic sets the pricing. Typically ₹500-1000/month. Contact them for details."

**Q: Can I add more children?**
A: "Yes! Add as many as you need. No extra charge."

**Q: What if I change clinics?**
A: "Your data stays with you. We can transfer your account easily."

**Q: Is there a mobile app?**
A: "The web app works perfectly on mobile. A native app is coming soon!"

**Q: How often should I do assessments?**
A: "Your pediatrician will recommend a schedule. Usually every 3-6 months."

**Q: Can I share reports with my doctor?**
A: "Absolutely! Download as PDF and share via email or WhatsApp."

---

## 🔧 Troubleshooting Demo Mode:

### Issue: Demo data not showing

**Solution:**
```bash
# Re-run demo data script
cd skidadvanced
turso db shell skidsadvanced < seed-demo-data.sql
```

### Issue: Can't sign in with demo account

**Solution:**
1. Verify email is whitelisted:
```bash
turso db shell skidsadvanced "SELECT * FROM ParentWhitelist WHERE email='demo@skids.health';"
```

2. If not found, add it:
```bash
turso db shell skidsadvanced "INSERT INTO ParentWhitelist (id, email, name, phone, isRegistered, clinicId, createdAt) VALUES ('demo-001', 'demo@skids.health', 'Demo User', '+91-98765-99999', 0, 'clinic-mumbai-001', datetime('now'));"
```

### Issue: Children not showing in dashboard

**Solution:**
1. Check if children exist:
```bash
turso db shell skidsadvanced "SELECT * FROM Child WHERE parentId='parent-demo-001';"
```

2. If not found, re-run seed script

---

## ✅ Pre-Demo Checklist:

Before showing to parents:

- [ ] Demo data loaded successfully
- [ ] Can sign in with demo@skids.health
- [ ] Dashboard shows 3 children
- [ ] Can view child profiles
- [ ] Can see assessment results
- [ ] Can access health reports
- [ ] Discovery page loads
- [ ] Appointments visible
- [ ] Messages/notifications work

---

## 🎥 Recording Demo Video:

### Setup (5 minutes):
1. Open https://skidsadvanced.vercel.app/
2. Open screen recording tool (QuickTime, OBS, Loom)
3. Set resolution to 1920x1080
4. Test audio

### Recording (7 minutes):
1. Start recording
2. Follow demo script above
3. Speak clearly and slowly
4. Show each feature
5. End with call-to-action

### Editing (10 minutes):
1. Trim beginning/end
2. Add title slide
3. Add contact information
4. Export as MP4
5. Upload to YouTube/Drive

---

## 📱 Sharing Demo:

### Via WhatsApp:
"Hi! Check out SKIDS Advanced - a platform for tracking your child's health. Here's a quick demo: [link]"

### Via Email:
Subject: "See How Easy Child Health Tracking Can Be"
Body: "I wanted to show you SKIDS Advanced - a comprehensive platform for tracking your child's development. Watch this 7-minute demo: [link]"

### In Person:
1. Open laptop/tablet
2. Go to demo URL
3. Sign in with demo account
4. Walk through features
5. Let them try it

---

## 🚀 Ready to Demo!

**Everything is set up and ready to show.**

**To start:**
1. Load demo data (5 minutes)
2. Test with demo account (2 minutes)
3. Practice demo script (10 minutes)
4. Show to first parent!

**Demo URL:** https://skidsadvanced.vercel.app/  
**Demo Email:** demo@skids.health  
**Clinic Code:** MPC001

---

**Go show it to parents and get feedback!** 🎉
