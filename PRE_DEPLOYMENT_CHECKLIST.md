# Pre-Deployment Checklist

**CRITICAL: Complete ALL items before deployment**

---

## ✅ Phase 1: Local Verification (COMPLETE FIRST)

### 1.1 Code Quality
- [ ] All tests passing locally
  ```bash
  npm test
  npm run test:properties
  ```
- [ ] Build successful
  ```bash
  npm run build
  ```
- [ ] No TypeScript errors
  ```bash
  npm run type-check
  ```
- [ ] Linting clean
  ```bash
  npm run lint
  ```

### 1.2 Environment Variables Documented
- [ ] All required variables listed
- [ ] Sample values prepared
- [ ] Secrets identified

---

## ✅ Phase 2: External Services Setup (DO IN ORDER)

### 2.1 Turso Database (FIRST - Foundation)
**Why first:** All other services depend on database

- [ ] Install Turso CLI
  ```bash
  curl -sSfL https://get.tur.so/install.sh | bash
  ```
- [ ] Login to Turso
  ```bash
  turso auth login
  ```
- [ ] Create production database
  ```bash
  turso db create skids-advanced-prod --location iad
  ```
- [ ] Get database URL
  ```bash
  turso db show skids-advanced-prod --url
  ```
- [ ] Create auth token
  ```bash
  turso db tokens create skids-advanced-prod
  ```
- [ ] Save DATABASE_URL
  ```
  Format: libsql://[db-name].turso.io?authToken=[token]
  ```
- [ ] Test connection
  ```bash
  turso db shell skids-advanced-prod "SELECT 1;"
  ```
- [ ] Run migrations
  ```bash
  DATABASE_URL="[your-url]" npx prisma db push
  ```
- [ ] Verify tables created
  ```bash
  turso db shell skids-advanced-prod "SELECT name FROM sqlite_master WHERE type='table';"
  ```

**✅ Turso Complete - Save DATABASE_URL**

---

### 2.2 Cloudflare R2 Storage (SECOND)
**Why second:** Needed for media uploads

- [ ] Login to Cloudflare Dashboard
- [ ] Navigate to R2
- [ ] Create bucket: `skids-advanced-production`
- [ ] Configure CORS:
  ```json
  {
    "CORSRules": [{
      "AllowedOrigins": ["https://skids-advanced.pages.dev"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }]
  }
  ```
- [ ] Create API token
  - Name: `skids-advanced-production`
  - Permissions: Object Read & Write
  - Bucket: `skids-advanced-production`
- [ ] Save credentials:
  - CLOUDFLARE_R2_ACCESS_KEY_ID
  - CLOUDFLARE_R2_SECRET_ACCESS_KEY
  - CLOUDFLARE_R2_ENDPOINT
  - CLOUDFLARE_R2_BUCKET
- [ ] Test access
  ```bash
  aws s3 ls s3://skids-advanced-production --endpoint-url=[endpoint]
  ```

**✅ R2 Complete - Save all 4 variables**

---

### 2.3 Clerk Authentication (THIRD)
**Why third:** Needed for user authentication

- [ ] Login to Clerk Dashboard
- [ ] Create new application
  - Name: `SKIDS Advanced Production`
  - Enable: Email/Password, Google OAuth
- [ ] Configure Google OAuth
  - Add Google credentials
  - Test OAuth flow
- [ ] Get API keys:
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - CLERK_SECRET_KEY
- [ ] Configure webhook
  - URL: `https://skids-advanced.pages.dev/api/webhooks/clerk`
  - Events: user.created, user.updated, user.deleted
  - Save CLERK_WEBHOOK_SECRET
- [ ] Test webhook endpoint (after deployment)

**✅ Clerk Complete - Save 3 variables**

---

### 2.4 Firebase FCM (FOURTH)
**Why fourth:** Needed for push notifications

- [ ] Login to Firebase Console
- [ ] Create new project
  - Name: `skids-advanced-prod`
  - Enable Analytics (optional)
- [ ] Enable Cloud Messaging
  - Go to Project Settings → Cloud Messaging
  - Enable Cloud Messaging API
- [ ] Generate service account key
  - Project Settings → Service Accounts
  - Generate new private key
  - Download JSON file
  - Save entire JSON as FIREBASE_SERVICE_ACCOUNT_KEY
- [ ] Get project configuration
  - Project Settings → General
  - Register web app: `skids-advanced-web`
  - Save NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] Test FCM (after deployment)

**✅ Firebase Complete - Save 2 variables**

---

## ✅ Phase 3: Cloudflare Pages Setup

### 3.1 Create Pages Project
- [ ] Login to Cloudflare Dashboard
- [ ] Navigate to Pages
- [ ] Create new project
  - Connect to GitHub repository
  - Select repository
  - Configure build settings:
    - Framework: Next.js
    - Build command: `npm run build`
    - Build output: `.next`
    - Root directory: `skidadvanced`
    - Node version: `18`

### 3.2 Set Environment Variables
**CRITICAL: Set ALL variables before first deployment**

Navigate to: Pages → skids-advanced → Settings → Environment variables

**Required Variables:**
```bash
# Database (from Turso)
DATABASE_URL=libsql://skids-advanced-prod.turso.io?authToken=[token]

# Clerk (from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# R2 Storage (from Cloudflare R2)
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET=skids-advanced-production
CLOUDFLARE_R2_ACCESS_KEY_ID=xxxxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxxxx
NEXT_PUBLIC_R2_PUBLIC_URL=https://[account-id].r2.cloudflarestorage.com/skids-advanced-production

# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skids-advanced-prod
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Application
NEXT_PUBLIC_APP_URL=https://skids-advanced.pages.dev
NODE_ENV=production
```

- [ ] All 13 variables set
- [ ] Values verified (no typos)
- [ ] Secrets properly formatted

**✅ Environment Variables Complete**

---

## ✅ Phase 4: Pre-Deployment Verification

### 4.1 Local Build Test
- [ ] Clean build
  ```bash
  rm -rf .next node_modules
  npm ci
  npm run build
  ```
- [ ] Build successful
- [ ] No errors in output

### 4.2 Test with Production-like Environment
- [ ] Create `.env.production.local` with production values
- [ ] Test database connection
- [ ] Test R2 upload
- [ ] Test authentication flow

### 4.3 Security Check
- [ ] No secrets in code
- [ ] No console.logs with sensitive data
- [ ] CORS configured correctly
- [ ] Rate limiting enabled

### 4.4 Performance Check
- [ ] Bundle size acceptable
  ```bash
  npm run analyze
  ```
- [ ] Code splitting working
- [ ] Images optimized

---

## ✅ Phase 5: Deployment

### 5.1 GitHub Deployment (Recommended)
- [ ] Commit all changes
  ```bash
  git add .
  git commit -m "Production ready - all services configured"
  ```
- [ ] Push to main
  ```bash
  git push origin main
  ```
- [ ] Monitor GitHub Actions
  - Watch deployment progress
  - Check for errors
- [ ] Wait for Cloudflare deployment
  - Check Cloudflare Dashboard
  - Wait for "Success" status

### 5.2 Manual Deployment (Alternative)
- [ ] Install Wrangler
  ```bash
  npm install -g wrangler
  ```
- [ ] Login
  ```bash
  wrangler login
  ```
- [ ] Deploy
  ```bash
  cd skidadvanced
  wrangler pages deploy .next --project-name=skids-advanced
  ```

---

## ✅ Phase 6: Post-Deployment Verification

### 6.1 Health Check
- [ ] Check health endpoint
  ```bash
  curl https://skids-advanced.pages.dev/api/health
  ```
- [ ] Expected: `{"status":"healthy",...}`

### 6.2 Critical Path Testing
- [ ] Homepage loads
- [ ] Sign-in works
- [ ] Sign-up with clinic code works
- [ ] Dashboard accessible
- [ ] Images load from R2
- [ ] Database queries work

### 6.3 Monitor Logs
- [ ] Check Cloudflare logs
  ```bash
  wrangler pages functions tail
  ```
- [ ] No errors in logs
- [ ] All services responding

### 6.4 Performance Verification
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify load times

---

## 🚨 Rollback Plan (If Issues Occur)

### Immediate Rollback
```bash
# List deployments
wrangler pages deployment list --project-name=skids-advanced

# Rollback to previous
wrangler pages deployment rollback [previous-deployment-id] --project-name=skids-advanced
```

### Database Rollback
```bash
# Restore from backup
turso db shell skids-advanced-prod ".restore backup-YYYYMMDD.db"
```

---

## 📝 Deployment Log Template

```markdown
## Deployment: [Date] [Time]

### Services Setup
- [x] Turso: skids-advanced-prod
- [x] R2: skids-advanced-production
- [x] Clerk: SKIDS Advanced Production
- [x] Firebase: skids-advanced-prod

### Environment Variables
- [x] All 13 variables set
- [x] Values verified

### Deployment
- [x] Build successful
- [x] Deployed to: https://skids-advanced.pages.dev
- [x] Health check: PASSED

### Issues
- None

### Notes
- [Any observations]
```

---

## ✅ FINAL CHECKLIST

Before clicking deploy:
- [ ] All Phase 1 items complete
- [ ] All Phase 2 services configured
- [ ] All Phase 3 Cloudflare setup complete
- [ ] All Phase 4 verifications passed
- [ ] Rollback plan understood
- [ ] Team notified

**Only proceed when ALL items are checked!**

---

**Status:** Ready for careful, methodical deployment
