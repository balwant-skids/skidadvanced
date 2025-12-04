# Production Environment Setup Guide

**Status:** Ready for execution  
**Estimated Time:** 2-3 hours

---

## 🎯 Overview

This guide walks through setting up all production services for SKIDS Advanced.

**Services to Configure:**
1. Turso Production Database
2. Cloudflare R2 Storage
3. Firebase FCM
4. Clerk Authentication
5. Cloudflare Pages

---

## 1️⃣ Turso Production Database

### Step 1: Create Production Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth login

# Create production database
turso db create skids-advanced-prod --location iad

# Enable replication (optional, for better performance)
turso db replicate skids-advanced-prod --location lhr
turso db replicate skids-advanced-prod --location sin

# Get database URL
turso db show skids-advanced-prod --url
# Save this as DATABASE_URL
```

### Step 2: Create Auth Token

```bash
# Create production auth token
turso db tokens create skids-advanced-prod

# Save this token - it will be part of DATABASE_URL
# Format: libsql://[db-name].turso.io?authToken=[token]
```

### Step 3: Run Migrations

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="libsql://skids-advanced-prod.turso.io?authToken=[your-token]"

# Run Prisma migrations
cd skidadvanced
npx prisma db push

# Verify tables created
turso db shell skids-advanced-prod "SELECT name FROM sqlite_master WHERE type='table';"
```

### Step 4: Configure Backups

```bash
# Turso automatically backs up every 24 hours
# Verify backup settings
turso db show skids-advanced-prod
```

**✅ Turso Setup Complete**

---

## 2️⃣ Cloudflare R2 Storage

### Step 1: Create R2 Bucket

1. Go to Cloudflare Dashboard → R2
2. Click **Create bucket**
3. Name: `skids-advanced-production`
4. Location: Automatic
5. Click **Create bucket**

### Step 2: Configure CORS

```bash
# Create CORS configuration file
cat > cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://skids-advanced.pages.dev", "https://app.skids-advanced.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
EOF

# Apply CORS configuration
aws s3api put-bucket-cors \
  --bucket skids-advanced-production \
  --cors-configuration file://cors-config.json \
  --endpoint-url https://[account-id].r2.cloudflarestorage.com
```

### Step 3: Create Access Keys

1. Go to R2 → Manage R2 API Tokens
2. Click **Create API token**
3. Name: `skids-advanced-production`
4. Permissions: Object Read & Write
5. Bucket: `skids-advanced-production`
6. Click **Create API token**

**Save these values:**
- Access Key ID → `CLOUDFLARE_R2_ACCESS_KEY_ID`
- Secret Access Key → `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- Endpoint → `CLOUDFLARE_R2_ENDPOINT`

### Step 4: Configure Public Access (Optional)

1. Go to bucket settings
2. Enable **Public Access** if needed
3. Configure custom domain for CDN
4. Save public URL → `NEXT_PUBLIC_R2_PUBLIC_URL`

**✅ R2 Setup Complete**

---

## 3️⃣ Firebase FCM

### Step 1: Create Production Project

1. Go to Firebase Console: https://console.firebase.google.com
2. Click **Add project**
3. Name: `skids-advanced-prod`
4. Enable Google Analytics (optional)
5. Click **Create project**

### Step 2: Enable Cloud Messaging

1. Go to Project Settings → Cloud Messaging
2. Click **Enable Cloud Messaging API**
3. Note the **Server key** (legacy, for reference)

### Step 3: Generate Service Account Key

1. Go to Project Settings → Service Accounts
2. Click **Generate new private key**
3. Download JSON file
4. Save entire JSON content → `FIREBASE_SERVICE_ACCOUNT_KEY`

### Step 4: Get Project Configuration

1. Go to Project Settings → General
2. Under "Your apps", click Web app icon
3. Register app: `skids-advanced-web`
4. Copy configuration values:

```javascript
const firebaseConfig = {
  apiKey: "...",           // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "...",
  projectId: "...",        // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

**✅ Firebase Setup Complete**

---

## 4️⃣ Clerk Authentication

### Step 1: Create Production Application

1. Go to Clerk Dashboard: https://dashboard.clerk.com
2. Click **Create application**
3. Name: `SKIDS Advanced Production`
4. Enable authentication methods:
   - Email/Password
   - Google OAuth
5. Click **Create application**

### Step 2: Configure OAuth

**Google OAuth:**
1. Go to Clerk → Social Connections → Google
2. Click **Configure**
3. Enter Google OAuth credentials
4. Save

### Step 3: Get API Keys

1. Go to API Keys
2. Copy values:
   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret Key → `CLERK_SECRET_KEY`

### Step 4: Configure Webhooks

1. Go to Webhooks
2. Click **Add Endpoint**
3. Endpoint URL: `https://skids-advanced.pages.dev/api/webhooks/clerk`
4. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy Signing Secret → `CLERK_WEBHOOK_SECRET`

### Step 5: Configure Domains

1. Go to Domains
2. Add production domain: `app.skids-advanced.com`
3. Verify domain ownership

**✅ Clerk Setup Complete**

---

## 5️⃣ Cloudflare Pages Environment Variables

### Set All Environment Variables

1. Go to Cloudflare Dashboard → Pages
2. Select `skids-advanced` project
3. Go to Settings → Environment variables
4. Click **Add variable** for each:

```bash
# Database
DATABASE_URL=libsql://skids-advanced-prod.turso.io?authToken=[token]

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# R2 Storage
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET=skids-advanced-production
CLOUDFLARE_R2_ACCESS_KEY_ID=xxxxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxxxx
NEXT_PUBLIC_R2_PUBLIC_URL=https://cdn.skids-advanced.com

# Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skids-advanced-prod
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Application
NEXT_PUBLIC_APP_URL=https://skids-advanced.pages.dev
NODE_ENV=production
```

5. Click **Save**

**✅ Environment Variables Set**

---

## 6️⃣ Verification

### Test Each Service

**1. Database:**
```bash
turso db shell skids-advanced-prod "SELECT 1;"
```

**2. R2 Storage:**
```bash
aws s3 ls s3://skids-advanced-production \
  --endpoint-url https://[account-id].r2.cloudflarestorage.com
```

**3. Firebase:**
- Send test notification from Firebase Console

**4. Clerk:**
- Test sign-in at https://accounts.skids-advanced.pages.dev

---

## 📋 Environment Variables Checklist

- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `CLERK_WEBHOOK_SECRET`
- [ ] `CLOUDFLARE_R2_ENDPOINT`
- [ ] `CLOUDFLARE_R2_BUCKET`
- [ ] `CLOUDFLARE_R2_ACCESS_KEY_ID`
- [ ] `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- [ ] `NEXT_PUBLIC_R2_PUBLIC_URL`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NODE_ENV`

---

## 🚀 Deploy

Once all services are configured:

```bash
git push origin main
```

GitHub Actions will deploy to production with all environment variables.

---

**✅ Production Environment Setup Complete!**
