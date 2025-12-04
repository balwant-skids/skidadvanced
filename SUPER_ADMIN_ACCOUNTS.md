# Super Admin Accounts - SKIDS Advanced

## 🔐 Authorized Super Admin Emails

The following email addresses are automatically granted **Super Admin** access upon first login:

### Active Super Admin Accounts:

1. ✅ **satissh@skids.health**
2. ✅ **satish@skids.health**
3. ✅ **drpratichi@skids.health**
4. ✅ **balwant@skids.health**
5. ✅ **fsdev@skids.health**
6. ✅ **pranit@skids.health**
7. ✅ **admin@skids.health**

---

## 🎯 What Super Admins Can Do

### Full Access To:
- ✅ Dashboard with all metrics
- ✅ Clinic Management (create, edit, delete)
- ✅ Parent Management (whitelist, approve, bulk operations)
- ✅ Campaign Management (create, edit, publish)
- ✅ Care Plans Management (CRUD + AI insights)
- ✅ **Staff Management** (add/edit/deactivate admins)
- ✅ Analytics Dashboard
- ✅ All export and bulk operations

### Special Privileges:
- ✅ Can create other admin users
- ✅ Can assign roles (Super Admin, Clinic Manager, Admin)
- ✅ Can deactivate/reactivate admin users
- ✅ Can view activity logs
- ✅ Access to all clinics and data
- ✅ Cannot be deactivated by other admins

---

## 🚀 First Time Login Process

### For New Super Admins:

1. **Go to**: https://skidsadvanced.vercel.app/sign-in
2. **Sign in** with your @skids.health email
3. **System automatically**:
   - Creates your account
   - Assigns Super Admin role
   - Sets account to active
   - Redirects to `/admin/dashboard`
4. **You now have full access** to all admin features

### What Happens Behind the Scenes:

```
1. User signs in with whitelisted email
2. System checks email against super admin list
3. Creates user with:
   - role: 'super_admin'
   - isActive: true
   - Full permissions
4. Redirects to /auth-callback
5. Auth callback detects super admin role
6. Final redirect to /admin/dashboard
```

---

## 📝 Adding More Super Admins

### Option 1: Add to Whitelist (Recommended for New Users)

Edit `src/lib/auth-utils.ts`:

```typescript
const superAdminEmails = [
  'satissh@skids.health',
  'satish@skids.health',
  'drpratichi@skids.health',
  'balwant@skids.health',
  'fsdev@skids.health',
  'pranit@skids.health',
  'admin@skids.health',
  'newemail@skids.health',  // Add here
]
```

**Note**: This only works for NEW users who haven't logged in yet.

### Option 2: Use Staff Management UI (For Existing Users)

1. Log in as an existing super admin
2. Go to `/admin/staff-management`
3. If user exists:
   - Click edit icon
   - Change role to "Super Admin"
   - Save
4. If user doesn't exist:
   - Click "Add Staff"
   - Enter email, name
   - Select "Super Admin" role
   - Save

---

## 🔒 Security Notes

### Protection Measures:
- ✅ Only whitelisted emails can auto-become super admins
- ✅ Super admins cannot deactivate themselves
- ✅ Cannot deactivate the last super admin
- ✅ All admin actions are logged with audit trail
- ✅ IP address and user agent tracked
- ✅ Middleware blocks deactivated users

### Best Practices:
- 🔐 Only use @skids.health emails for super admins
- 🔐 Review super admin list regularly
- 🔐 Remove access immediately when staff leaves
- 🔐 Use Staff Management UI to deactivate (not delete)
- 🔐 Monitor activity logs for suspicious behavior

---

## 📊 Current Super Admin Status

| Email | Status | Access Level |
|-------|--------|--------------|
| satissh@skids.health | ✅ Active | Full Access |
| satish@skids.health | ✅ Active | Full Access |
| drpratichi@skids.health | ✅ Active | Full Access |
| balwant@skids.health | ✅ Active | Full Access |
| fsdev@skids.health | ✅ Active | Full Access |
| pranit@skids.health | ✅ Active | Full Access |
| admin@skids.health | ✅ Active | Full Access |

---

## 🆘 Troubleshooting

### "I'm a super admin but can't access admin dashboard"

**Solutions**:
1. Clear browser cache and cookies
2. Sign out completely
3. Sign in again
4. Should redirect to `/admin/dashboard`

### "I see 'Please sign in' on dashboard"

**Cause**: You're on `/dashboard` (parent view) instead of `/admin/dashboard`

**Solution**: Navigate directly to: https://skidsadvanced.vercel.app/admin/dashboard

### "My email is in the list but I'm still a parent"

**Cause**: You logged in BEFORE your email was added to the whitelist

**Solution**:
1. Ask another super admin to update your role via Staff Management
2. Or: Delete your account and sign in again (will auto-create as super admin)

---

## 📞 Support

For access issues or to add new super admins:
1. Contact existing super admin
2. They can add you via Staff Management UI
3. Or update the whitelist in code

---

## 🎉 Summary

**7 Super Admin Accounts** are now configured:
- ✅ Auto-assigned on first login
- ✅ Full access to all features
- ✅ Can manage other admins
- ✅ Secure and audited

**All super admins can now log in and access the full admin dashboard!** 🚀

---

**File Location**: `src/lib/auth-utils.ts` (line 46-54)

**Last Updated**: December 3, 2025

**Status**: ✅ ALL SUPER ADMINS CONFIGURED
