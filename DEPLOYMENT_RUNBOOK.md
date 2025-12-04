# SKIDS Advanced - Deployment Runbook

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Production Ready

---

## 🎯 Quick Reference

| Environment | URL | Database | Status |
|-------------|-----|----------|--------|
| Production | https://skids-advanced.pages.dev | Turso Production | ✅ Active |
| Staging | https://staging.skids-advanced.pages.dev | Turso Staging | ✅ Active |
| Development | http://localhost:3000 | Local SQLite | 🔄 Local |

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] Property tests passing (`npm run test:properties`)
- [ ] E2E tests passing (`npx playwright test`)
- [ ] Linting clean (`npm run lint`)
- [ ] Type checking clean (`npm run type-check`)
- [ ] No console errors or warnings

### Database
- [ ] Migrations tested locally
- [ ] Backup created
- [ ] Migration scripts ready
- [ ] Rollback plan documented

### Environment Variables
- [ ] All required variables set in Cloudflare
- [ ] Secrets rotated if needed
- [ ] API keys validated
- [ ] Database URLs correct

### External Services
- [ ] Clerk production app configured
- [ ] Firebase production project ready
- [ ] R2 bucket configured
- [ ] Turso database provisioned

---

## 🚀 Deployment Process

### Automatic Deployment (Recommended)

**Trigger:** Push to `main` branch

```bash
# 1. Ensure you're on main branch
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Run tests locally
npm test
npm run test:properties
npx playwright test

# 4. Push to trigger deployment
git push origin main
```

**GitHub Actions will automatically:**
1. ✅ Run linting and type checking
2. ✅ Run property-based tests
3. ✅ Run E2E tests
4. ✅ Build application
5. ✅ Deploy to Cloudflare Pages
6. ✅ Run health checks
7. ✅ Rollback if health checks fail

**Monitor deployment:**
- GitHub Actions: https://github.com/[org]/[repo]/actions
- Cloudflare Dashboard: https://dash.cloudflare.com/pages

---

### Manual Deployment

**Use only if automatic deployment fails**

```bash
# 1. Build locally
cd skidadvanced
npm ci
npm run build

# 2. Deploy with Wrangler
wrangler pages deploy .next --project-name=skids-advanced

# 3. Verify deployment
curl https://skids-advanced.pages.dev/api/health
```

---

## 🔍 Post-Deployment Verification

### 1. Health Check

```bash
curl https://skids-advanced.pages.dev/api/health
```

**Expected Response:**
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

### 2. Critical Path Testing

**Test these flows manually:**

1. **Homepage**
   - [ ] Loads without errors
   - [ ] Images display correctly
   - [ ] Navigation works

2. **Authentication**
   - [ ] Sign-in works
   - [ ] Sign-up with clinic code works
   - [ ] Google OAuth works
   - [ ] Session persists

3. **Parent Dashboard**
   - [ ] Dashboard loads
   - [ ] Children list displays
   - [ ] Appointments visible
   - [ ] Reports accessible

4. **Admin Dashboard**
   - [ ] Clinic management works
   - [ ] Whitelist management works
   - [ ] Analytics display

5. **Discovery Modules**
   - [ ] Modules load (lazy loading)
   - [ ] 3D visualizations work
   - [ ] Animations smooth

### 3. Performance Check

```bash
# Run Lighthouse audit
npx lighthouse https://skids-advanced.pages.dev --view

# Check Core Web Vitals
# - FCP < 1.5s
# - LCP < 2.5s
# - CLS < 0.1
# - TTI < 3.5s
```

### 4. Monitor Logs

```bash
# View deployment logs
wrangler pages deployment tail

# View function logs
wrangler pages functions tail

# Check error rates in Cloudflare Dashboard
```

---

## 🔄 Rollback Procedure

### Automatic Rollback

GitHub Actions automatically rolls back if health checks fail.

### Manual Rollback

**If automatic rollback fails:**

```bash
# 1. List recent deployments
wrangler pages deployment list --project-name=skids-advanced

# 2. Identify last stable deployment
# Look for deployment with "Production" alias

# 3. Rollback to that deployment
wrangler pages deployment rollback [deployment-id] --project-name=skids-advanced

# 4. Verify rollback
curl https://skids-advanced.pages.dev/api/health
```

**Via Cloudflare Dashboard:**
1. Go to Pages → skids-advanced → Deployments
2. Find last stable deployment
3. Click **...** → **Rollback to this deployment**
4. Confirm rollback

---

## 🗄️ Database Operations

### Running Migrations

**Production:**
```bash
# 1. Backup database first
turso db shell skids-advanced-prod ".backup backup-$(date +%Y%m%d).db"

# 2. Run migrations
DATABASE_URL="libsql://[prod-db].turso.io" npx prisma db push

# 3. Verify migration
turso db shell skids-advanced-prod "SELECT name FROM sqlite_master WHERE type='table';"
```

**Rollback Migration:**
```bash
# Restore from backup
turso db shell skids-advanced-prod ".restore backup-YYYYMMDD.db"
```

### Database Backup

**Automated backups:** Turso automatically backs up every 24 hours

**Manual backup:**
```bash
turso db shell skids-advanced-prod ".backup backup-$(date +%Y%m%d).db"
```

---

## 🔐 Security Operations

### Rotating Secrets

**When to rotate:**
- Every 90 days (scheduled)
- After team member departure
- After suspected compromise

**Process:**
1. Generate new secrets in respective services
2. Update Cloudflare environment variables
3. Deploy new version
4. Verify functionality
5. Revoke old secrets

### API Key Rotation

**Clerk:**
1. Generate new API keys in Clerk dashboard
2. Update `CLERK_SECRET_KEY` in Cloudflare
3. Deploy
4. Delete old keys

**Firebase:**
1. Generate new service account key
2. Update `FIREBASE_SERVICE_ACCOUNT_KEY`
3. Deploy
4. Delete old service account

**R2:**
1. Create new access key in Cloudflare
2. Update R2 credentials
3. Deploy
4. Delete old access key

---

## 📊 Monitoring & Alerts

### Key Metrics to Monitor

**Application Health:**
- Health check endpoint status
- API response times
- Error rates
- Request volume

**Performance:**
- Core Web Vitals (FCP, LCP, CLS, TTI)
- Bundle size
- Cache hit rates
- Database query times

**Security:**
- Failed authentication attempts
- Rate limit violations
- SQL injection attempts
- CORS violations

### Setting Up Alerts

**Cloudflare:**
1. Go to Notifications
2. Create alerts for:
   - Deployment failures
   - High error rates (>5%)
   - Performance degradation
   - SSL certificate expiry

**External Monitoring:**
- UptimeRobot: 5-minute checks
- Sentry: Error tracking
- DataDog: Performance monitoring

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Deployment fails with "Build error"**
```bash
# Solution: Check build logs
# Common causes:
# - TypeScript errors
# - Missing dependencies
# - Environment variables not set

# Fix locally first:
npm run build
npm run type-check
```

**Issue: Health check fails**
```bash
# Check individual services:
# 1. Database connectivity
turso db shell skids-advanced-prod "SELECT 1;"

# 2. R2 storage
aws s3 ls s3://skids-advanced-production --endpoint-url=[R2_ENDPOINT]

# 3. Clerk authentication
curl https://api.clerk.dev/v1/health

# 4. Firebase FCM
# Check Firebase console for service status
```

**Issue: 500 Internal Server Error**
```bash
# 1. Check function logs
wrangler pages functions tail

# 2. Check error logs in database
# Query ErrorLog table

# 3. Verify environment variables
# Check Cloudflare dashboard

# 4. Check external service status
# Clerk, Firebase, Turso status pages
```

**Issue: Images not loading**
```bash
# 1. Verify R2 bucket permissions
# 2. Check CORS configuration
# 3. Verify NEXT_PUBLIC_R2_PUBLIC_URL
# 4. Check Cloudflare Image Resizing settings
```

---

## 📞 Emergency Contacts

**On-Call Engineer:** [Contact Info]  
**DevOps Lead:** [Contact Info]  
**Product Owner:** [Contact Info]

**External Support:**
- Cloudflare Support: https://dash.cloudflare.com/support
- Clerk Support: support@clerk.dev
- Turso Support: support@turso.tech

---

## 📝 Deployment Log Template

```markdown
## Deployment: [Date] [Time]

**Deployed By:** [Name]
**Version:** [Git SHA]
**Environment:** Production

### Changes
- [List of changes]

### Pre-Deployment
- [ ] Tests passed
- [ ] Code reviewed
- [ ] Backup created

### Deployment
- [ ] Deployed successfully
- [ ] Health checks passed
- [ ] Critical paths tested

### Post-Deployment
- [ ] Monitoring configured
- [ ] Team notified
- [ ] Documentation updated

### Issues
- [Any issues encountered]

### Rollback
- [If rollback was needed, document why]
```

---

## ✅ Success Criteria

Deployment is successful when:
- [ ] Health check returns 200 OK
- [ ] All critical paths tested and working
- [ ] No errors in logs
- [ ] Performance metrics within targets
- [ ] Monitoring shows normal operation
- [ ] Team notified of deployment

---

**Last Updated:** December 2024  
**Next Review:** Quarterly  
**Owner:** DevOps Team
