# 🚀 Setup Your SKIDS Domains - Step by Step

**You own:** `skids.health` and `skids.clinic`  
**Current URL:** https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/

---

## 🎯 Recommended Setup

I recommend setting up **BOTH**:

1. **Custom domain:** `app.skids.health` (Professional, for production)
2. **Vercel domain:** `skids.vercel.app` (Easy to remember, for demos)

---

## 📋 PART 1: Setup `skids.vercel.app` (5 minutes)

### Step 1: Rename Vercel Project

**Option A: Via Vercel Dashboard (Easiest)**

1. Go to: https://vercel.com/satishs-projects-89f8c44c/skids-advanced-production/settings
2. Scroll to **Project Name**
3. Change from: `skids-advanced-production`
4. Change to: `skids`
5. Click **Save**
6. Your new URL will be: `https://skids.vercel.app`

**Option B: Via CLI**

```bash
cd skidadvanced
vercel project rename skids-advanced-production skids
```

### Step 2: Verify New URL

Wait 1-2 minutes, then visit:
```
https://skids.vercel.app
```

✅ **Done!** You now have a short Vercel URL.

---

## 📋 PART 2: Setup `app.skids.health` (30 minutes)

### Step 1: Add Domain in Vercel

1. Go to: https://vercel.com/satishs-projects-89f8c44c/skids-advanced-production/settings/domains
2. Click **Add Domain**
3. Enter: `app.skids.health`
4. Click **Add**

Vercel will show you DNS records to add.

### Step 2: Get DNS Records from Vercel

You'll see something like:

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

**Copy these values** - you'll need them in the next step.

### Step 3: Add DNS Records to Your Domain

**Where is your domain registered?**
- GoDaddy?
- Namecheap?
- Google Domains?
- Cloudflare?
- Other?

**For GoDaddy:**

1. Go to: https://dcc.godaddy.com/manage/dns
2. Select `skids.health`
3. Click **Add** under DNS Records
4. Select **CNAME**
5. Enter:
   - **Name:** `app`
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** 1 Hour (or default)
6. Click **Save**

**For Namecheap:**

1. Go to: https://ap.www.namecheap.com/domains/list/
2. Click **Manage** next to `skids.health`
3. Go to **Advanced DNS** tab
4. Click **Add New Record**
5. Select **CNAME Record**
6. Enter:
   - **Host:** `app`
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** Automatic
7. Click **Save**

**For Google Domains:**

1. Go to: https://domains.google.com/registrar
2. Select `skids.health`
3. Click **DNS** in the left menu
4. Scroll to **Custom resource records**
5. Enter:
   - **Name:** `app`
   - **Type:** `CNAME`
   - **TTL:** `1H`
   - **Data:** `cname.vercel-dns.com`
6. Click **Add**

**For Cloudflare:**

1. Go to: https://dash.cloudflare.com
2. Select `skids.health`
3. Click **DNS** tab
4. Click **Add record**
5. Enter:
   - **Type:** `CNAME`
   - **Name:** `app`
   - **Target:** `cname.vercel-dns.com`
   - **Proxy status:** DNS only (gray cloud)
6. Click **Save**

### Step 4: Wait for DNS Propagation

- **Time:** Usually 15-30 minutes (can take up to 48 hours)
- **Check status:** Go back to Vercel, it will show "Valid Configuration" when ready

**Check DNS propagation:**
- Visit: https://dnschecker.org
- Enter: `app.skids.health`
- Type: `CNAME`
- Click **Search**

### Step 5: Verify Domain is Working

Once Vercel shows "Valid Configuration":

1. Visit: `https://app.skids.health`
2. You should see your SKIDS Advanced application
3. SSL certificate will be automatically provisioned

---

## 📋 PART 3: Setup `app.skids.clinic` (Optional)

If you want to use `skids.clinic` as well:

### Repeat Part 2 with:
- Domain: `app.skids.clinic`
- DNS Record: Same CNAME setup

**Use cases:**
- `app.skids.health` - Main production URL
- `app.skids.clinic` - Alternative/backup URL
- Both will point to the same application

---

## 📋 PART 4: Update Application Configuration

Once your custom domain is working:

### Step 1: Update Vercel Environment Variables

1. Go to: https://vercel.com/satishs-projects-89f8c44c/skids-advanced-production/settings/environment-variables
2. Find `NEXT_PUBLIC_APP_URL`
3. Click **Edit**
4. Change to: `https://app.skids.health`
5. Click **Save**
6. Click **Redeploy** to apply changes

### Step 2: Update Clerk Configuration

1. Go to: https://dashboard.clerk.com/apps/app_36BjVtGI7ulpUv1OvWEWdFl9X7w/instances/ins_36BjVzktPwSi7wUKsLbVEoWIKBZ/domains
2. Click **Add satellite domain**
3. Enter: `app.skids.health`
4. Click **Add domain**
5. Wait for verification (1-2 minutes)

### Step 3: Update Clerk Redirect URLs

1. Go to: https://dashboard.clerk.com/apps/app_36BjVtGI7ulpUv1OvWEWdFl9X7w/instances/ins_36BjVzktPwSi7wUKsLbVEoWIKBZ/paths
2. Update URLs:
   - Sign-in URL: `https://app.skids.health/sign-in`
   - Sign-up URL: `https://app.skids.health/sign-up`
   - After sign-in: `https://app.skids.health/dashboard`
   - After sign-up: `https://app.skids.health/dashboard`
3. Click **Save**

---

## ✅ Final Result

After completing all steps, you'll have:

**Primary URLs:**
- ✅ `https://app.skids.health` - Professional custom domain
- ✅ `https://skids.vercel.app` - Short Vercel domain
- ✅ `https://app.skids.clinic` - Alternative domain (optional)

**Old URL (still works):**
- `https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app`

All URLs will point to the same application!

---

## 🎯 Recommended Domain Strategy

**For different purposes:**

| Domain | Purpose | Users |
|--------|---------|-------|
| `app.skids.health` | Main production app | Parents, Admins |
| `admin.skids.health` | Admin portal (future) | Admins only |
| `api.skids.health` | API endpoint (future) | Developers |
| `www.skids.health` | Marketing website | Public |
| `skids.vercel.app` | Demo/Testing | Demos, Testing |

---

## 🆘 Troubleshooting

### Issue: "Domain not available"

**If `skids.vercel.app` is taken:**

Try these alternatives:
- `skidshealth.vercel.app`
- `skidsapp.vercel.app`
- `myskids.vercel.app`
- `skids-health.vercel.app`

### Issue: DNS not propagating

**Solutions:**
1. Wait longer (can take up to 48 hours)
2. Clear browser cache: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
3. Try incognito mode
4. Check DNS with: https://dnschecker.org
5. Verify DNS records are correct in your registrar

### Issue: SSL certificate error

**Solutions:**
1. Wait 5-10 minutes for Vercel to provision SSL
2. Verify domain is showing "Valid Configuration" in Vercel
3. Clear browser cache
4. Try again in 15 minutes

---

## 📞 Need Help?

**Where is your domain registered?**

Tell me and I'll give you exact screenshots and steps for your specific registrar!

Common registrars:
- GoDaddy
- Namecheap  
- Google Domains
- Cloudflare
- AWS Route 53
- Other?

---

## 🚀 Quick Start

**Want to start right now?**

**Fastest option (5 minutes):**
1. Rename Vercel project to `skids`
2. Get `skids.vercel.app` instantly
3. Done!

**Best option (30 minutes):**
1. Add `app.skids.health` in Vercel
2. Add CNAME record in your DNS
3. Wait 15-30 minutes
4. Professional custom domain ready!

**Which would you like to do first?**
