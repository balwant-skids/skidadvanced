# 🔄 Rename Vercel Project - Quick Guide

**Current URL:** https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app/  
**Goal:** Get `skidsa1.vercel.app` or `skidsplus.vercel.app`

---

## ⚡ Quick Steps (5 minutes)

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/satishs-projects-89f8c44c
2. Find your project: **skids-advanced-production** or **skids**
3. Click on the project

### Step 2: Rename Project

1. Click **Settings** tab (top navigation)
2. Scroll to **Project Name** section
3. Click **Edit** button
4. Enter new name:
   - **Option A:** `skidsa1` → URL will be `skidsa1.vercel.app`
   - **Option B:** `skidsplus` → URL will be `skidsplus.vercel.app`
   - **Option C:** `skids-app` → URL will be `skids-app.vercel.app`
5. Click **Save**

### Step 3: Verify New URL

1. Wait 1-2 minutes
2. Visit your new URL:
   - `https://skidsa1.vercel.app` OR
   - `https://skidsplus.vercel.app`
3. Verify the SKIDS Advanced homepage loads

### Step 4: Update Environment Variables

1. Still in **Settings** tab
2. Click **Environment Variables** in left sidebar
3. Find `NEXT_PUBLIC_APP_URL`
4. Click **Edit**
5. Update value:
   - Old: `https://skids-advanced-production-531csxif9-satishs-projects-89f8c44c.vercel.app`
   - New: `https://skidsa1.vercel.app` (or your chosen name)
6. Click **Save**

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋯** (three dots menu)
4. Click **Redeploy**
5. Wait for deployment to complete (~2 minutes)

### Step 6: Update Clerk

1. Go to Clerk Dashboard: https://dashboard.clerk.com/apps/app_36BjVtGI7ulpUv1OvWEWdFl9X7w/instances/ins_36BjVzktPwSi7wUKsLbVEoWIKBZ
2. Click **Domains** in left sidebar
3. Click **Add satellite domain**
4. Enter: `skidsa1.vercel.app` (or your chosen name)
5. Click **Add domain**
6. Wait for verification (~1 minute)

---

## ✅ Verification Checklist

After renaming:

- [ ] New URL loads the homepage
- [ ] Can access sign-in page
- [ ] Can access sign-up page
- [ ] Authentication works
- [ ] No console errors
- [ ] Old URL redirects to new URL (Vercel does this automatically)

---

## 🎯 Recommended Names

| Name | URL | Notes |
|------|-----|-------|
| **skidsa1** | skidsa1.vercel.app | Short, clean |
| **skidsplus** | skidsplus.vercel.app | Branded |
| **skids-app** | skids-app.vercel.app | Descriptive |
| **skidshealth** | skidshealth.vercel.app | Professional |
| **myskids** | myskids.vercel.app | User-friendly |

---

## 🚨 Important Notes

1. **Old URL still works:** Vercel automatically redirects old URLs to new ones
2. **No downtime:** Renaming happens instantly
3. **Update documentation:** Remember to update any saved links
4. **Update Clerk:** Must add new domain to Clerk for auth to work
5. **Environment variables:** Must update `NEXT_PUBLIC_APP_URL`

---

## 🆘 Troubleshooting

### Issue: Name Already Taken

**Error:** "Project name is already in use"

**Solution:**
- Try adding numbers: `skidsa1`, `skidsa2`
- Try variations: `skids-app`, `skids-health`, `my-skids`
- Check if you have another project with that name

### Issue: Authentication Not Working

**Problem:** Can't sign in after renaming

**Solution:**
1. Verify new domain added to Clerk
2. Check Clerk domain is verified (green checkmark)
3. Clear browser cookies
4. Try incognito mode
5. Wait 5 minutes for DNS propagation

### Issue: Old URL Not Redirecting

**Problem:** Old URL shows 404

**Solution:**
1. Wait 5-10 minutes
2. Clear browser cache
3. Vercel should auto-redirect (this is automatic)
4. Contact Vercel support if persists

---

## 📞 Need Help?

**Can't find the project?**
- Go to: https://vercel.com/dashboard
- Look for "skids-advanced-production" or "skids"
- Click on it

**Can't access Settings?**
- Make sure you're logged in
- Verify you have admin access to the project
- Try refreshing the page

---

## 🎉 After Renaming

Once renamed, your new URLs will be:

**Homepage:** `https://skidsa1.vercel.app/`  
**Sign In:** `https://skidsa1.vercel.app/sign-in`  
**Sign Up:** `https://skidsa1.vercel.app/sign-up`  
**Dashboard:** `https://skidsa1.vercel.app/dashboard`

**Much shorter and easier to share!** 🚀

---

**Ready to rename? Follow Step 1 above!**
