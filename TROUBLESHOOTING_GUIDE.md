# Troubleshooting Guide

## Common Issues and Solutions

### Build Issues

**Issue: Build fails with TypeScript errors**
```bash
# Solution: Run type check to see all errors
npm run type-check

# Fix errors and rebuild
npm run build
```

**Issue: Out of memory during build**
```bash
# Solution: Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Deployment Issues

**Issue: Health check fails after deployment**
```bash
# Check individual services
curl https://skids-advanced.pages.dev/api/health

# Check logs
wrangler pages functions tail
```

**Issue: Environment variables not set**
- Verify in Cloudflare Dashboard → Pages → Settings → Environment variables
- Ensure all required variables are set for Production environment

### Database Issues

**Issue: Database connection fails**
```bash
# Test connection
turso db shell skids-advanced-prod "SELECT 1;"

# Check DATABASE_URL format
# Should be: libsql://[db].turso.io?authToken=[token]
```

**Issue: Migration fails**
```bash
# Backup first
turso db shell skids-advanced-prod ".backup backup.db"

# Run migration
DATABASE_URL="[prod-url]" npx prisma db push

# If fails, restore backup
turso db shell skids-advanced-prod ".restore backup.db"
```

### Performance Issues

**Issue: Slow page loads**
```bash
# Check bundle size
npm run analyze

# Verify code splitting
ls -lh .next/static/chunks/

# Run performance audit
npx lighthouse https://skids-advanced.pages.dev
```

**Issue: Images not loading**
- Check R2 bucket permissions
- Verify CORS configuration
- Check NEXT_PUBLIC_R2_PUBLIC_URL

### Authentication Issues

**Issue: Sign-in fails**
- Verify Clerk production keys are set
- Check Clerk dashboard for errors
- Verify webhook endpoint is accessible

**Issue: Session expires immediately**
- Check Clerk session settings
- Verify cookie domain configuration

### Security Issues

**Issue: CORS errors**
- Check allowed origins in `src/lib/cors.ts`
- Verify production URL is whitelisted

**Issue: Rate limiting too aggressive**
- Adjust limits in `src/lib/rate-limiter.ts`
- Check IP blocking status

### Monitoring

**Issue: High error rates**
```bash
# Check error logs
wrangler pages functions tail

# Query ErrorLog table
turso db shell skids-advanced-prod "SELECT * FROM ErrorLog ORDER BY timestamp DESC LIMIT 10;"
```

## Emergency Procedures

### Rollback Deployment
```bash
# List deployments
wrangler pages deployment list --project-name=skids-advanced

# Rollback
wrangler pages deployment rollback [deployment-id] --project-name=skids-advanced
```

### Database Restore
```bash
# Restore from backup
turso db shell skids-advanced-prod ".restore backup-YYYYMMDD.db"
```

## Support Contacts

- **Cloudflare:** https://dash.cloudflare.com/support
- **Clerk:** support@clerk.dev
- **Turso:** support@turso.tech
