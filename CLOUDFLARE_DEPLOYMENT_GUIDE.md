# Cloudflare Pages Deployment Guide

**Feature:** skids-e2e-deployment  
**Status:** ✅ Configuration Complete

---

## 📋 Prerequisites

1. **Cloudflare Account** with Pages enabled
2. **GitHub Repository** connected to Cloudflare
3. **Production Database** (Turso) provisioned
4. **Environment Variables** ready

---

## 🚀 Deployment Steps

### Step 1: Create Cloudflare Pages Project

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create Pages project
wrangler pages project create skids-advanced
```

**Or via Cloudflare Dashboard:**
1. Go to Pages → Create a project
2. Connect to GitHub repository
3. Select `skidadvanced` repository
4. Configure build settings

---

### Step 2: Configure Build Settings

**Framework preset:** Next.js  
**Build command:** `npm run build`  
**Build output directory:** `.next`  
**Root directory:** `skidadvanced`  
**Node version:** `18`

---

### Step 3: Set Environment Variables

Navigate to: **Pages → skids-advanced → Settings → Environment variables**

#### Required Variables (Production)

```bash
# Database
DATABASE_URL=libsql://[your-database].turso.io

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Cloudflare R2 Storage
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET=skids-advanced-production
CLOUDFLARE_R2_ACCESS_KEY_ID=xxxxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxxxx
NEXT_PUBLIC_R2_PUBLIC_URL=https://cdn.skids-advanced.com

# Firebase FCM
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skids-advanced-prod
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Optional: Payment
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Application
NEXT_PUBLIC_APP_URL=https://skids-advanced.pages.dev
NODE_ENV=production
```

---

### Step 4: Configure Custom Domain (Optional)

1. Go to **Pages → skids-advanced → Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain: `app.skids-advanced.com`
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning

---

### Step 5: Deploy

#### Automatic Deployment (Recommended)

Push to `main` branch:
```bash
git push origin main
```

GitHub Actions will automatically:
1. Run linting and type checking
2. Run property-based tests
3. Run E2E tests
4. Build the application
5. Deploy to Cloudflare Pages
6. Run health checks
7. Rollback if health checks fail

#### Manual Deployment

```bash
# Build locally
cd skidadvanced
npm run build

# Deploy with Wrangler
wrangler pages deploy .next --project-name=skids-advanced
```

---

## 🔍 Post-Deployment Verification

### 1. Health Check

```bash
curl https://skids-advanced.pages.dev/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T00:00:00.000Z",
  "checks": {
    "database": "healthy",
    "storage": "healthy",
    "auth": "healthy",
    "fcm": "healthy"
  }
}
```

### 2. Test Critical Paths

- [ ] Homepage loads
- [ ] Sign-in works
- [ ] Sign-up with clinic code works
- [ ] Dashboard accessible
- [ ] API endpoints respond
- [ ] Images load from R2
- [ ] Notifications work

### 3. Monitor Logs

```bash
# View deployment logs
wrangler pages deployment tail

# View function logs
wrangler pages functions tail
```

---

## 🔄 Rollback Procedure

### Automatic Rollback

GitHub Actions automatically rolls back if health checks fail.

### Manual Rollback

1. Go to **Pages → skids-advanced → Deployments**
2. Find the last stable deployment
3. Click **...** → **Rollback to this deployment**
4. Confirm rollback

Or via CLI:
```bash
# List deployments
wrangler pages deployment list --project-name=skids-advanced

# Rollback to specific deployment
wrangler pages deployment rollback [deployment-id] --project-name=skids-advanced
```

---

## 📊 Performance Optimization

### Enable Cloudflare Features

1. **Auto Minify**
   - Go to **Speed → Optimization**
   - Enable JavaScript, CSS, HTML minification

2. **Brotli Compression**
   - Automatically enabled for Pages

3. **HTTP/3 (QUIC)**
   - Go to **Network**
   - Enable HTTP/3

4. **Image Resizing**
   - Already configured in code
   - Uses `/cdn-cgi/image/` path

5. **Caching**
   - Configure cache rules in `_headers` file
   - Set appropriate TTLs

---

## 🔐 Security Configuration

### 1. Security Headers

Already configured in code (`src/lib/security-headers.ts`):
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

### 2. Rate Limiting

Already configured in code (`src/lib/rate-limiter.ts`):
- 100 requests per 15 minutes per IP
- Configurable per endpoint

### 3. CORS Policy

Already configured in code (`src/lib/cors.ts`):
- Origin whitelisting
- Credentials support

---

## 📈 Monitoring & Alerts

### 1. Set Up Cloudflare Analytics

- Go to **Analytics → Web Analytics**
- View traffic, performance, and errors

### 2. Configure Alerts

- Go to **Notifications**
- Set up alerts for:
  - Deployment failures
  - High error rates
  - Performance degradation
  - SSL certificate expiry

### 3. External Monitoring

Consider adding:
- **Uptime monitoring** (UptimeRobot, Pingdom)
- **Error tracking** (Sentry)
- **Performance monitoring** (DataDog, New Relic)

---

## 🐛 Troubleshooting

### Build Failures

**Issue:** Build fails with "Module not found"
```bash
# Solution: Clear cache and rebuild
rm -rf node_modules .next
npm ci
npm run build
```

**Issue:** Out of memory during build
```bash
# Solution: Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Runtime Errors

**Issue:** 500 Internal Server Error
- Check function logs: `wrangler pages functions tail`
- Verify environment variables are set
- Check database connectivity

**Issue:** Images not loading
- Verify R2 bucket permissions
- Check CORS configuration on R2
- Verify `NEXT_PUBLIC_R2_PUBLIC_URL` is correct

### Performance Issues

**Issue:** Slow page loads
- Check bundle size: `npm run analyze`
- Verify code splitting is working
- Check Cloudflare cache hit rate

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Database migrations applied
- [ ] R2 bucket configured
- [ ] Clerk production app created
- [ ] Firebase production project created

### Deployment
- [ ] GitHub Actions workflow configured
- [ ] Cloudflare Pages project created
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

### Post-Deployment
- [ ] Health check passing
- [ ] Critical paths tested
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Team notified

---

## 🔗 Useful Links

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Wrangler CLI Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Next.js on Pages:** https://developers.cloudflare.com/pages/framework-guides/nextjs/
- **Environment Variables:** https://developers.cloudflare.com/pages/platform/build-configuration/

---

## 📞 Support

**Cloudflare Support:** https://dash.cloudflare.com/support  
**Community Forum:** https://community.cloudflare.com/

---

**Status:** ✅ Ready for deployment  
**Last Updated:** December 2024
