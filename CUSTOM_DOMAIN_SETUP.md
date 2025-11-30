# 🌐 Custom Domain Setup Guide

**Current URL:** https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/  
**Goal:** Get a shorter, professional URL like `app.skids.health` or `skids.health`

---

## 📋 Prerequisites

Before starting, you need:
1. **A domain name** (e.g., `skids.health`, `skidsadvanced.com`)
2. **Access to domain registrar** (GoDaddy, Namecheap, Google Domains, etc.)
3. **Vercel account access** (you already have this)

---

## 🎯 Option 1: Use Existing Domain (Recommended)

If you already own `skids.health` or similar:

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/satishs-projects-89f8c44c/skids-advanced-production
2. Click on your project: **skids-advanced-production**
3. Go to **Settings** tab
4. Click **Domains** in the left sidebar

### Step 2: Add Custom Domain

1. Click **Add Domain** button
2. Enter your desired domain:
   - `app.skids.health` (recommended for app)
   - `skids.health` (for main site)
   - `portal.skids.health` (alternative)
3. Click **Add**

### Step 3: Configure DNS

Vercel will show you DNS records to add. You'll see something like:

**For subdomain (app.skids.health):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

**For root domain (skids.health):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 4: Add DNS Records to Your Domain Registrar

**If using GoDaddy:**
1. Go to: https://dcc.godaddy.com/manage/dns
2. Select your domain
3. Click **Add** under DNS Records
4. Add the CNAME/A records from Vercel
5. Save changes

**If using Namecheap:**
1. Go to: https://ap.www.namecheap.com/domains/list/
2. Click **Manage** next to your domain
3. Go to **Advanced DNS** tab
4. Click **Add New Record**
5. Add the CNAME/A records from Vercel
6. Save changes

**If using Google Domains:**
1. Go to: https://domains.google.com/registrar
2. Select your domain
3. Click **DNS** in the left menu
4. Scroll to **Custom resource records**
5. Add the CNAME/A records from Vercel
6. Save

**If using Cloudflare:**
1. Go to: https://dash.cloudflare.com
2. Select your domain
3. Click **DNS** tab
4. Click **Add record**
5. Add the CNAME/A records from Vercel
6. Save

### Step 5: Wait for DNS Propagation

- **Time:** 5 minutes to 48 hours (usually 15-30 minutes)
- **Check status:** Vercel will show "Valid Configuration" when ready
- **Test:** Try accessing your new domain

### Step 6: Update Application URLs

Once domain is active, update environment variables in Vercel:

1. Go to: **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL`:
   - Old: `https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app`
   - New: `https://app.skids.health` (or your domain)
3. Click **Save**
4. Redeploy the application

### Step 7: Update Clerk Configuration

1. Go to Clerk Dashboard: https://dashboard.clerk.com/apps/app_36BjVtGI7ulpUv1OvWEWdFl9X7w/instances/ins_36BjVzktPwSi7wUKsLbVEoWIKBZ
2. Go to **Domains** section
3. Add your new domain: `app.skids.health`
4. Update redirect URLs:
   - Sign-in URL: `https://app.skids.health/sign-in`
   - Sign-up URL: `https://app.skids.health/sign-up`
   - After sign-in: `https://app.skids.health/dashboard`
5. Save changes

---

## 🎯 Option 2: Buy New Domain

If you don't have a domain yet:

### Step 1: Choose Domain Name

**Suggestions:**
- `skidsadvanced.com`
- `skidshealth.com`
- `skidscreening.com`
- `mykids.health`
- `childhealth.app`

### Step 2: Buy Domain

**Recommended Registrars:**

**A. Namecheap (Cheapest)**
1. Go to: https://www.namecheap.com
2. Search for your domain
3. Add to cart
4. Complete purchase
5. Cost: ~$10-15/year

**B. Google Domains (Easy)**
1. Go to: https://domains.google.com
2. Search for your domain
3. Add to cart
4. Complete purchase
5. Cost: ~$12-20/year

**C. GoDaddy (Popular)**
1. Go to: https://www.godaddy.com
2. Search for your domain
3. Add to cart
4. Complete purchase
5. Cost: ~$15-20/year

### Step 3: Follow Option 1 Steps

Once you own the domain, follow Steps 1-7 from Option 1 above.

---

## 🎯 Option 3: Use Vercel's Free Domain

Vercel offers free `.vercel.app` domains with shorter names:

### Step 1: Change Project Name

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **General**
4. Change project name to something shorter:
   - `skids` → `skids.vercel.app`
   - `skids-app` → `skids-app.vercel.app`
   - `skidshealth` → `skidshealth.vercel.app`
5. Save

### Step 2: Access New URL

Your new URL will be: `https://[project-name].vercel.app`

**Note:** This is free but still has `.vercel.app` in the URL.

---

## 📊 Domain Comparison

| Option | URL Example | Cost | Setup Time | Professional |
|--------|-------------|------|------------|--------------|
| **Custom Domain** | app.skids.health | $10-20/year | 30 min | ⭐⭐⭐⭐⭐ |
| **New Domain** | skidsadvanced.com | $10-20/year | 1 hour | ⭐⭐⭐⭐⭐ |
| **Vercel Domain** | skids.vercel.app | Free | 5 min | ⭐⭐⭐ |

---

## 🎯 Recommended Setup

**Best Option:** Use subdomain of existing domain

**Suggested URLs:**
- **Main App:** `app.skids.health`
- **Admin Portal:** `admin.skids.health`
- **Marketing Site:** `www.skids.health` or `skids.health`
- **API:** `api.skids.health`

**Benefits:**
- Professional appearance
- Easy to remember
- Consistent branding
- SEO friendly

---

## ✅ Post-Setup Checklist

After setting up custom domain:

- [ ] Domain is accessible
- [ ] SSL certificate is active (https://)
- [ ] Old URL redirects to new URL
- [ ] `NEXT_PUBLIC_APP_URL` updated in Vercel
- [ ] Clerk domain added and verified
- [ ] Clerk redirect URLs updated
- [ ] Test sign-in/sign-up flow
- [ ] Test all features
- [ ] Update documentation with new URL
- [ ] Inform users of new URL

---

## 🆘 Troubleshooting

### Issue 1: Domain Not Working

**Problem:** "This site can't be reached"

**Solutions:**
1. Wait longer (DNS can take up to 48 hours)
2. Check DNS records are correct
3. Clear browser cache
4. Try incognito mode
5. Use DNS checker: https://dnschecker.org

### Issue 2: SSL Certificate Error

**Problem:** "Your connection is not private"

**Solutions:**
1. Wait for Vercel to provision SSL (5-10 minutes)
2. Check domain is verified in Vercel
3. Try accessing after 15 minutes
4. Contact Vercel support if persists

### Issue 3: Clerk Authentication Not Working

**Problem:** "Invalid redirect URL"

**Solutions:**
1. Verify domain is added in Clerk dashboard
2. Check redirect URLs match exactly
3. Ensure https:// is included
4. Wait 5 minutes for Clerk to update
5. Clear browser cookies

---

## 📞 Need Help?

**Vercel Support:**
- Documentation: https://vercel.com/docs/concepts/projects/domains
- Support: https://vercel.com/support

**Domain Registrar Support:**
- GoDaddy: https://www.godaddy.com/help
- Namecheap: https://www.namecheap.com/support
- Google Domains: https://support.google.com/domains

**Clerk Support:**
- Documentation: https://clerk.com/docs/deployments/overview
- Support: https://clerk.com/support

---

## 🎉 Quick Start

**Fastest way to get a shorter URL:**

1. **If you own skids.health:**
   - Add `app.skids.health` in Vercel
   - Add CNAME record in DNS
   - Wait 15 minutes
   - Done!

2. **If you don't own a domain:**
   - Buy `skidsadvanced.com` on Namecheap ($10)
   - Add to Vercel
   - Configure DNS
   - Wait 30 minutes
   - Done!

3. **Free option:**
   - Rename Vercel project to `skids`
   - Use `skids.vercel.app`
   - Done in 5 minutes!

---

**Which option would you like to proceed with?**

Let me know and I'll guide you through the specific steps!
