# Cloudflare Pages Environment Variables

**Project:** SKIDS Advanced  
**Status:** Ready to Configure  
**Last Updated:** Pre-Deployment

---

## 📋 COMPLETE LIST OF ENVIRONMENT VARIABLES

Copy and paste these into Cloudflare Pages Dashboard:  
**Dashboard → Pages → skids-advanced → Settings → Environment variables**

---

### 🗄️ DATABASE (Turso)

```bash
DATABASE_URL=libsql://skidsadvanced-satishskid.aws-ap-south-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjQzOTUwOTksImlkIjoiY2RjNjk0NWYtMjExMS00NDI2LTkxZmYtYzQwZTkzZTc5ZGNmIiwicmlkIjoiZTAzMjgxZGItN2RlNi00ZjlmLWIyNmQtMGFmYzQxMzRlNGQzIn0.T21ObBIMZQhJ313oWmpioEH7KU-huzcZxNXo-ftYqornU-Rg1dXVpHpC0imzBD-G3PUJU6C_kUDltfM0aHCUAg
```

---

### 🔐 AUTHENTICATION (Clerk)

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c3VtbWFyeS1zd2luZS0zOS5jbGVyay5hY2NvdW50cy5kZXYk

CLERK_SECRET_KEY=sk_test_joJOEjS1U0oaZe2ktjLVNMdK3v1Ejnrr87eOijX2b1

CLERK_WEBHOOK_SECRET=whsec_BC1cir8/9s7aTVKgm0RsFVVFooC/AkJ0

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard

NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

### 🔥 FIREBASE (Push Notifications)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbaiPB_y1WanpGfCdNzq7ds41eMV_t8eY

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skidsadvanced.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID=skidsadvanced

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skidsadvanced.firebasestorage.app

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=576880068310

NEXT_PUBLIC_FIREBASE_APP_ID=1:576880068310:web:e9aef8b82dffdf4a016b77
```

**Firebase Service Account (Single Line - IMPORTANT!):**

```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"skidsadvanced","private_key_id":"3a338ce557a0bdbcf0fc00893e5d462d3aa73566","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD7UUN8mGz0Rjcr\n8fGqaTco9lVt0uoqnB97oBbCLjaaHa8jbAZl7C6qcqeXYyyWp8RZ7Oc4aqv1sDyC\n8l/dHalVlLe/LK5KZNbjo0usyWHHDC/ddycB4Q0yJ1wDNjwhoXLIdJkw2tb/xshi\ngsHlWI6dnT5loWvkIK0lpMja3qyklB5lYbwdZBWIIYZMq36nuaJ0iVbqZqYD0Kgb\npg18C8Ecr2XTJFMwbNwfbHtTJSWoVqlf7tLoTi5C5puZNuFOetDE4A5tc9dKakDp\ntLAzyIZdiVi6HKlG1/Fd73PslEFfZBm9lYXeWRsJYQBCo+72Sk/nNb/SC/U5F8F3\nBpjo1f9zAgMBAAECggEAJwXhF5goFtf473hpIMpR7SjZbqz40kvysYSpSVaEAPM0\nriiIZ8wVb5RPrziQLwZ20nXFbg5WNtc6K3piEJiZ92FuafS7TW7nVRUWhjUGMIeV\nE8DRdupl3PtH6hxs7YCUV57kkzWae8B3KKC1ZcdrQaWtuiR8ocFse/Nggr0KYUrA\na1OqDG+LoqnOHpYriBFGOTO5hPJpQTn7JBzXFsk45DDPZqzCHW6AKDd8DiPohtZ2\nVqK3J6RTbJgIwI/WKlOwVqgvY+64JaUfcSxdHfEw9o9aFULkooZNbQA79JqKyOg+\nJ+WbFjQImXXG5jvXvhOIu6dBF4yUDMUigDPh/oIvbQKBgQD+tq7I3Fxvx4TYX8F4\nMeH82AD1B0AJP9Iajz+gXfLI+mLyojLm4Xq4W4MoyYSerhWRadNAIWQWlKU/d5ta\n3eegFATQBeDXyUEE0uIEINQyJY3VH0JeFDQpzzaYS/GFuEEQfhP4vMrXjMLVPsD1\n0Mqk66yq7AhRJ+vvVI4XCCUZzwKBgQD8ljCjBsKXF+Ht05UUi94sB3V76XM+TFv+\nLWd7YNj3QocgPbs2EuoiJ2poZU9Wejb3vcwIYnFYs1RkBQxQceUp6jrrDHdNdvli\nXtF5XwRFvA948JM+v0wdCogUdwsKSklaQgYHC7u8P4Gz0mfLH8XToZq27zAfwSA7\nxsO0Wnh9HQKBgQD6pPW1vfJQJHt7GC8fgaap0jyO4YWIFH9Bl3i66/f/ATThIe8I\n9xR12cdlGXghVZjvsL0qPDFrbvZ1T9NWRUqqYUijE0W/0dDjWEkEWvG0LvQ0pj/+\np8703W0RzJlsRnXwLsCkYdMQ7PjEMq5atgzS4P7WatF8WtZ2ejQgQemQTQKBgF7j\nXSohZAC27B0YGy04ziHkO3JtZOnGbdiy3ekvnNJmn7Sw/B94Q5TJEeReCswF5Zh0\nKK4NrV8RH2bjrpiZ8OkqITAj4r2rMEyQKklaNJSt7XIVjntICiPuzOhDQFaBScUq\ngHEtKz2w7dzL8koQiZTTZPfMK1wChUVvih26zwDRAoGAZ/8yx72o0T11GKiORzFd\nWDP7Pg5+X8BH8eDQipIY1SdWxN+qHIF4lC9DwlkY0lBezKMMWp/RDMyvkVXKQH8T\nCrGKu8JRAYRGYkI1cqkezmDBW3KUG3qRVvtTBxqvWsSYdgcyImDPG7N4NWvAH5fn\nVvXQeWg7xvVbow5fYRF2yXE=\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@skidsadvanced.iam.gserviceaccount.com","client_id":"114799434283517846104","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40skidsadvanced.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

---

### ☁️ CLOUDFLARE R2 (File Storage)

```bash
CLOUDFLARE_R2_ENDPOINT=https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com

CLOUDFLARE_R2_BUCKET=skidsadvanced

CLOUDFLARE_R2_ACCESS_KEY_ID=53da3ff3a3f0ab3bc06e6d7ebadf6203

CLOUDFLARE_R2_SECRET_ACCESS_KEY=dbac6de2f429ad4e89042ad6aca6965449ccdaf9a834a22e586610b9544aef90

CLOUDFLARE_ACCOUNT_ID=9f4998a66a5d7bd7a230d0222544fbe6

NEXT_PUBLIC_R2_PUBLIC_URL=https://9f4998a66a5d7bd7a230d0222544fbe6.r2.cloudflarestorage.com/skidsadvanced
```

---

### ⚙️ APPLICATION SETTINGS

```bash
NODE_ENV=production

NEXT_PUBLIC_APP_NAME=SKIDS Advanced

NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true

NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true

NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
```

**IMPORTANT:** Update this after deployment:
```bash
NEXT_PUBLIC_APP_URL=https://skids-advanced.pages.dev
```

---

## 📝 STEP-BY-STEP INSTRUCTIONS

### 1. Go to Cloudflare Dashboard

1. Visit: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **Pages**
3. Select your project (or create it if it doesn't exist)

---

### 2. Add Environment Variables

1. Click on **Settings** tab
2. Scroll to **Environment variables** section
3. Click **Add variable**

For each variable above:
- **Variable name:** Copy the name (e.g., `DATABASE_URL`)
- **Value:** Copy the value
- **Environment:** Select **Production** (and **Preview** if you want)
- Click **Save**

---

### 3. Important Notes

**Firebase Service Account:**
- This MUST be on a single line
- Copy the entire JSON object as shown above
- Do NOT add line breaks or formatting

**After Deployment:**
- Update `NEXT_PUBLIC_APP_URL` with your actual Cloudflare Pages URL
- Update Clerk dashboard with production URLs
- Test all services

---

## ✅ VERIFICATION CHECKLIST

After adding all variables:

- [ ] All 23 variables are added
- [ ] Production environment is selected
- [ ] Firebase service account is single line
- [ ] No typos in variable names
- [ ] All values are copied correctly
- [ ] Saved all changes

---

## 🚀 READY TO DEPLOY

Once all environment variables are set:

```bash
git push origin main
```

Cloudflare Pages will automatically build and deploy your application.

---

## 📊 VARIABLE COUNT

| Category | Count |
|----------|-------|
| Database | 1 |
| Authentication | 7 |
| Firebase | 7 |
| R2 Storage | 6 |
| Application | 5 |
| **TOTAL** | **26** |

---

## 🔄 POST-DEPLOYMENT UPDATES

After your first deployment, you'll need to update:

1. **NEXT_PUBLIC_APP_URL**
   - Get your Cloudflare Pages URL
   - Update this variable
   - Redeploy

2. **Clerk Dashboard**
   - Add production domain
   - Update redirect URLs
   - Update webhook URLs

3. **Firebase Console**
   - Add production domain to authorized domains
   - Update FCM configuration

---

## 🆘 TROUBLESHOOTING

**Build fails:**
- Check all variables are set
- Verify no typos in variable names
- Check Firebase service account is single line

**Authentication not working:**
- Verify Clerk keys are correct
- Check redirect URLs in Clerk dashboard
- Ensure production domain is added

**Database connection fails:**
- Verify DATABASE_URL includes auth token
- Check Turso database is accessible
- Verify auth token is valid

**File uploads fail:**
- Verify R2 credentials are correct
- Check bucket name matches
- Verify endpoint URL is correct

---

**Need help?** See STEP_BY_STEP_DEPLOYMENT.md for detailed instructions.
