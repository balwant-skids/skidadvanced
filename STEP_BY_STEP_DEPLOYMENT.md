# 🚀 Step-by-Step Production Deployment Guide

**Status:** Ready to Execute  
**Estimated Time:** 1-2 hours  
**Last Updated:** Session Transfer

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Current Status (Based on .env.local)

| Service | Status | Notes |
|---------|--------|-------|
| **Turso Database** | ✅ Configured | `skidsadvanced-satishskid.aws-ap-south-1.turso.io` |
| **Clerk Auth** | ✅ Configured | Test keys present |
| **Firebase FCM** | ✅ Configured | Project: `skidsadvanced` |
| **Cloudflare R2** | ✅ Configured | Bucket: `skidsadvanced` |
| **Environment Variables** | ⚠️ Needs Review | Need to set in Cloudflare Pages |

---

## 🎯 STEP 1: VERIFY ALL SERVICES (15 minutes)

### 1.1 Verify Turso Database

```bash
# Test database connection
turso db show skidsadvanced-satishskid

# Test query
turso db shell skidsadvanced-satishskid "SELECT name FROM sqlite_master WHERE type='table' LIMIT 5;"
```

**Expected Output:** List of tables (User, Parent, Child, etc.)

**✅ Verification:**
- [ ] Database is accessible
- [ ] Tables exist
- [ ] Auth token is valid

---

### 1.2 Verify Clerk Authentication

**Test in Browser:**
1. Go to: https://dashboard.clerk.com
2. Select your application
3. Verify:
   - [ ] Application is active
   - [ ] Test keys match `.env.local`
   - [ ] Sign-in/Sign-up URLs are configured
   - [ ] Webhooks are set up (if needed)

**API Keys to Verify:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZW5hYmxlZC1waWdlb24tMTIuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_lhfnTrK221l4X1VCyYkTu3oAF6OwPRcDeOfPZ1gUUj
```

---

### 1.3 Verify Firebase Configuration

**Test Firebase Project:**
1. Go to: https://console.firebase.google.com
2. Select project: `skidsadvanced`
3. Verify:
   - [ ] Cloud Messaging is enabled
   - [ ] Service account key is valid
   - [ ] Web app is registered

**Test Service Account:**
```bash
cd skidadvanced

# Create test script
cat > test-firebase.js << 'EOF'
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
console.log('✅ Project ID:', serviceAccount.project_id);
console.log('✅ Client Email:', serviceAccount.client_email);
console.log('✅ Service account is valid');
EOF

# Run test
node test-firebase.js

# Clean up
rm test-firebase.js
```

---

### 1.4 Verify Cloudflare R2 Storage

**Test R2 Access:**
```bash
# Install AWS CLI if not present
# brew install awscli  # macOS
# or use npm: npm install -g aws-cli

# Configure AWS CLI for R2
aws configure set aws_access_key_id 53da3ff3a3f0ab3bc06e6d7ebadf6203
aws configure set aws_secret_access_key dbac6de2f429ad4e89042ad6aca6965449ccdaf9a834a22e586610b9544aef90
aws configure set region auto

# Test bucket access
aws s3 ls s3://skidsadvanced \
  --endpoint-url https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com
```

**Expected Output:** List of files in bucket (or empty if new)

**✅ Verification:**
- [ ] Bucket is accessible
- [ ] Credentials are valid
- [ ] Endpoint URL is correct

---

## 🎯 STEP 2: SET UP CLOUDFLARE PAGES (30 minutes)

### 2.1 Create Cloudflare Pages Project

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **Pages**
3. Click: **Create application** → **Connect to Git**
4. Select your GitHub repository
5. Configure build settings:

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: skidadvanced
Node version: 18
```

6. Click **Save and Deploy** (this will fail initially - that's OK)

---

### 2.2 Set Environment Variables in Cloudflare

**Go to:** Pages Project → Settings → Environment variables

**Add these variables for PRODUCTION:**

```bash
# Database
DATABASE_URL=libsql://skidsadvanced-satishskid.aws-ap-south-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQzOTUwOTksImlkIjoiY2RjNjk0NWYtMjExMS00NDI2LTkxZmYtYzQwZTkzZTc5ZGNmIiwicmlkIjoiZTAzMjgxZGItN2RlNi00ZjlmLWIyNmQtMGFmYzQxMzRlNGQzIn0.T21ObBIMZQhJ313oWmpioEH7KU-huzcZxNXo-ftYqornU-Rg1dXVpHpC0imzBD-G3PUJU6C_kUDltfM0aHCUAg

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZW5hYmxlZC1waWdlb24tMTIuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_lhfnTrK221l4X1VCyYkTu3oAF6OwPRcDeOfPZ1gUUj
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbaiPB_y1WanpGfCdNzq7ds41eMV_t8eY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skidsadvanced.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skidsadvanced
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skidsadvanced.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=576880068310
NEXT_PUBLIC_FIREBASE_APP_ID=1:576880068310:web:e9aef8b82dffdf4a016b77
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"skidsadvanced","private_key_id":"3a338ce557a0bdbcf0fc00893e5d462d3aa73566","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD7UUN8mGz0Rjcr\n8fGqaTco9lVt0uoqnB97oBbCLjaaHa8jbAZl7C6qcqeXYyyWp8RZ7Oc4aqv1sDyC\n8l/dHalVlLe/LK5KZNbjo0usyWHHDC/ddycB4Q0yJ1wDNjwhoXLIdJkw2tb/xshi\ngsHlWI6dnT5loWvkIK0lpMja3qyklB5lYbwdZBWIIYZMq36nuaJ0iVbqZqYD0Kgb\npg18C8Ecr2XTJFMwbNwfbHtTJSWoVqlf7tLoTi5C5puZNuFOetDE4A5tc9dKakDp\ntLAzyIZdiVi6HKlG1/Fd73PslEFfZBm9lYXeWRsJYQBCo+72Sk/nNb/SC/U5F8F3\nBpjo1f9zAgMBAAECggEAJwXhF5goFtf473hpIMpR7SjZbqz40kvysYSpSVaEAPM0\nriiIZ8wVb5RPrziQLwZ20nXFbg5WNtc6K3piEJiZ92FuafS7TW7nVRUWhjUGMIeV\nE8DRdupl3PtH6hxs7YCUV57kkzWae8B3KKC1ZcdrQaWtuiR8ocFse/Nggr0KYUrA\na1OqDG+LoqnOHpYriBFGOTO5hPJpQTn7JBzXFsk45DDPZqzCHW6AKDd8DiPohtZ2\nVqK3J6RTbJgIwI/WKlOwVqgvY+64JaUfcSxdHfEw9o9aFULkooZNbQA79JqKyOg+\nJ+WbFjQImXXG5jvXvhOIu6dBF4yUDMUigDPh/oIvbQKBgQD+tq7I3Fxvx4TYX8F4\nMeH82AD1B0AJP9Iajz+gXfLI+mLyojLm4Xq4W4MoyYSerhWRadNAIWQWlKU/d5ta\n3eegFATQBeDXyUEE0uIEINQyJY3VH0JeFDQpzzaYS/GFuEEQfhP4vMrXjMLVPsD1\n0Mqk66yq7AhRJ+vvVI4XCCUZzwKBgQD8ljCjBsKXF+Ht05UUi94sB3V76XM+TFv+\nLWd7YNj3QocgPbs2EuoiJ2poZU9Wejb3vcwIYnFYs1RkBQxQceUp6jrrDHdNdvli\nXtF5XwRFvA948JM+v0wdCogUdwsKSklaQgYHC7u8P4Gz0mfLH8XToZq27zAfwSA7\nxsO0Wnh9HQKBgQD6pPW1vfJQJHt7GC8fgaap0jyO4YWIFH9Bl3i66/f/ATThIe8I\n9xR12cdlGXghVZjvsL0qPDFrbvZ1T9NWRUqqYUijE0W/0dDjWEkEWvG0LvQ0pj/+\np8703W0RzJlsRnXwLsCkYdMQ7PjEMq5atgzS4P7WatF8WtZ2ejQgQemQTQKBgF7j\nXSohZAC27B0YGy04ziHkO3JtZOnGbdiy3ekvnNJmn7Sw/B94Q5TJEeReCswF5Zh0\nKK4NrV8RH2bjrpiZ8OkqITAj4r2rMEyQKklaNJSt7XIVjntICiPuzOhDQFaBScUq\ngHEtKz2w7dzL8koQiZTTZPfMK1wChUVvih26zwDRAoGAZ/8yx72o0T11GKiORzFd\nWDP7Pg5+X8BH8eDQipIY1SdWxN+qHIF4lC9DwlkY0lBezKMMWp/RDMyvkVXKQH8T\nCrGKu8JRAYRGYkI1cqkezmDBW3KUG3qRVvtTBxqvWsSYdgcyImDPG7N4NWvAH5fn\nVvXQeWg7xvVbow5fYRF2yXE=\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@skidsadvanced.iam.gserviceaccount.com","client_id":"114799434283517846104","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40skidsadvanced.iam.gserviceaccount.com","universe_domain":"googleapis.com"}

# Cloudflare R2
CLOUDFLARE_R2_ENDPOINT=https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET=skidsadvanced
CLOUDFLARE_R2_ACCESS_KEY_ID=53da3ff3a3f0ab3bc06e6d7ebadf6203
CLOUDFLARE_R2_SECRET_ACCESS_KEY=dbac6de2f429ad4e89042ad6aca6965449ccdaf9a834a22e586610b9544aef90
CLOUDFLARE_ACCOUNT_ID=9f4998a66a5d7bd7a230d0222544fbe6
NEXT_PUBLIC_R2_PUBLIC_URL=https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com/skidsadvanced

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=SKIDS Advanced
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
```

**Important Notes:**
- Set these for **Production** environment
- You can also set for **Preview** if you want staging
- Click **Save** after adding each variable

---

### 2.3 Update Clerk Production URLs

Once you get your Cloudflare Pages URL (e.g., `skids-advanced.pages.dev`):

1. Go to Clerk Dashboard
2. Navigate to: **Domains**
3. Add your production domain
4. Update redirect URLs to match production

---

## 🎯 STEP 3: VERIFY BUILD LOCALLY (10 minutes)

Before deploying, ensure the build works locally:

```bash
cd skidadvanced

# Clean previous builds
rm -rf .next

# Install dependencies
npm install

# Run production build
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**✅ Verification:**
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size is reasonable

---

## 🎯 STEP 4: DEPLOY TO PRODUCTION (5 minutes)

### Option A: Deploy via Git Push (Recommended)

```bash
# Ensure you're on main branch
git checkout main

# Commit any pending changes
git add .
git commit -m "chore: prepare for production deployment"

# Push to trigger deployment
git push origin main
```

Cloudflare Pages will automatically:
1. Detect the push
2. Run the build
3. Deploy to production

---

### Option B: Deploy via Wrangler CLI

```bash
# Install Wrangler if not present
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
cd skidadvanced
wrangler pages deploy .next --project-name=skids-advanced
```

---

## 🎯 STEP 5: POST-DEPLOYMENT VERIFICATION (15 minutes)

### 5.1 Check Deployment Status

1. Go to Cloudflare Dashboard → Pages
2. Check deployment status
3. Note the production URL (e.g., `https://skids-advanced.pages.dev`)

---

### 5.2 Test Critical Paths

**Test 1: Homepage**
```bash
curl -I https://skids-advanced.pages.dev
```
Expected: `200 OK`

**Test 2: Authentication**
1. Visit: `https://skids-advanced.pages.dev/sign-in`
2. Try signing in with test account
3. Verify redirect to dashboard

**Test 3: Database Connection**
1. Sign in as parent
2. Try creating a child profile
3. Verify data is saved

**Test 4: File Upload (R2)**
1. Try uploading a profile picture
2. Verify file is stored in R2
3. Verify file is accessible

**Test 5: Push Notifications**
1. Allow notifications in browser
2. Trigger a test notification
3. Verify notification is received

---

### 5.3 Monitor Logs

**Cloudflare Logs:**
```bash
wrangler pages deployment tail --project-name=skids-advanced
```

**Check for:**
- [ ] No 500 errors
- [ ] No database connection errors
- [ ] No authentication errors
- [ ] No R2 access errors

---

## 🎯 STEP 6: CONFIGURE CUSTOM DOMAIN (Optional, 30 minutes)

### 6.1 Add Custom Domain

1. Go to Cloudflare Pages → Custom domains
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `app.skids-advanced.com`)
4. Follow DNS configuration instructions

### 6.2 Update Clerk URLs

1. Go to Clerk Dashboard → Domains
2. Add custom domain
3. Update all redirect URLs

### 6.3 Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` in Cloudflare Pages:
```
NEXT_PUBLIC_APP_URL=https://app.skids-advanced.com
```

---

## 📊 FINAL CHECKLIST

### Pre-Deployment
- [ ] All services verified (Turso, Clerk, Firebase, R2)
- [ ] Local build successful
- [ ] Environment variables documented
- [ ] Git repository up to date

### Deployment
- [ ] Cloudflare Pages project created
- [ ] All environment variables set
- [ ] Build configuration correct
- [ ] Deployment triggered

### Post-Deployment
- [ ] Deployment successful
- [ ] Homepage accessible
- [ ] Authentication working
- [ ] Database operations working
- [ ] File uploads working
- [ ] Push notifications working
- [ ] No errors in logs

### Optional
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] DNS propagated
- [ ] Monitoring set up

---

## 🚨 TROUBLESHOOTING

### Build Fails

**Check:**
1. Node version (should be 18+)
2. Environment variables are set
3. Dependencies are installed
4. No TypeScript errors

**Fix:**
```bash
npm install
npm run build
```

### Database Connection Error

**Check:**
1. DATABASE_URL is correct
2. Auth token is valid
3. Database is accessible

**Fix:**
```bash
turso db show skidsadvanced-satishskid
turso db tokens create skidsadvanced-satishskid
```

### Authentication Not Working

**Check:**
1. Clerk keys are correct
2. Redirect URLs match production domain
3. Clerk application is active

**Fix:**
- Update Clerk dashboard with production URLs
- Regenerate keys if needed

### R2 Upload Fails

**Check:**
1. R2 credentials are correct
2. Bucket exists
3. CORS is configured

**Fix:**
```bash
aws s3 ls s3://skidsadvanced \
  --endpoint-url https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com
```

---

## 📞 SUPPORT

If you encounter issues:

1. Check Cloudflare Pages logs
2. Check browser console for errors
3. Verify all environment variables
4. Test each service individually
5. Review TROUBLESHOOTING_GUIDE.md

---

## 🎉 SUCCESS!

Once all checks pass, your application is live at:
**https://skids-advanced.pages.dev**

Congratulations on deploying SKIDS Advanced to production! 🚀

---

**Next Steps:**
1. Monitor application performance
2. Set up error tracking (Sentry)
3. Configure analytics
4. Plan for scaling
5. Document operational procedures
