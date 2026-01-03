# Admin Password Reset & Forgot Password Setup

## Overview

This setup allows you to:
1. Update the admin password without deleting the account
2. Provide a forgot password page with secret code verification
3. Allow admins to reset their password securely

## Files Created/Modified

### 1. **scripts/reset-admin.js** (Updated)
Command-line script to reset admin password to `admin123`

**Usage:**
```bash
node scripts/reset-admin.js
```

**What it does:**
- Finds the admin user
- Hashes the new password using bcrypt
- Updates the password in the database
- Displays the new login credentials

### 2. **actions/admin/admin-reset-actions.ts** (Updated)
Server actions for password management

**Functions:**
- `updateAdminPassword(newPassword)` - Updates admin password
- `verifyForgotPasswordCode(secretCode)` - Verifies secret code
- `resetAdminPasswordWithCode(secretCode, newPassword)` - Complete reset flow

### 3. **app/(users)/admin-forgot-password/page.tsx** (New)
Forgot password page with two-step verification:

**Step 1:** Enter secret code
**Step 2:** Create new password

**Features:**
- Same styling as admin login page
- Secret code verification
- Password confirmation
- Validation (password length, matching, etc.)
- Animated UI with same design language

### 4. **app/(users)/admin-login/page.tsx** (Updated)
Added "Forgot your password?" link to login page

## Setup Instructions

### 1. Set Environment Variables

Add to your `.env.local` or Vercel environment:

```env
# Set a secret code for forgot password (make it strong and unique)
ADMIN_FORGOT_PASSWORD_CODE=your-secret-code-here

# Optional: admin email (defaults to admin@thewallstack.com)
ADMIN_EMAIL=admin@thewallstack.com
```

**Example secret codes:**
```
ADMIN_FORGOT_PASSWORD_CODE=TheWall@2024#Stack!Secure$Code
```

### 2. Reset Admin Password

Run the script to set the initial password:

```bash
node scripts/reset-admin.js
```

This will update the password to `admin123`.

### 3. Access Forgot Password Page

Users can access the forgot password page at:
```
http://localhost:3000/admin-forgot-password
```

Or click "Forgot your password?" on the login page.

## How It Works

### Admin Login
1. Go to `/admin-login`
2. Enter email and password
3. (New) Can click "Forgot your password?" if needed

### Forgot Password Flow
1. Go to `/admin-forgot-password`
2. Enter the secret code (Step 1)
3. Click "Verify Code"
4. Enter new password (Step 2)
5. Confirm password
6. Click "Reset Password"
7. Redirected to login page on success

### Security Features

✅ **Secret Code Verification**
- Required before password reset
- Stored in environment variable
- Cannot bypass verification

✅ **Password Validation**
- Minimum 6 characters required
- Must match confirmation
- Case-sensitive
- Hashed with bcrypt (same as better-auth)

✅ **Safe Handling**
- Server-side validation
- Password never logged
- Secure session after reset
- Clean error messages (no info leakage)

## Customization

### Change Secret Code

Edit the `ADMIN_FORGOT_PASSWORD_CODE` environment variable:

**Production (Vercel):**
1. Go to Project Settings → Environment Variables
2. Update `ADMIN_FORGOT_PASSWORD_CODE`
3. Redeploy

**Development (.env.local):**
```env
ADMIN_FORGOT_PASSWORD_CODE=your-new-secret-code
```

### Change Initial Password

In `scripts/reset-admin.js`, modify:
```javascript
const newPassword = "your-new-password";
```

Then run:
```bash
node scripts/reset-admin.js
```

### Customize Forgot Password Page

The forgot password page is in:
```
app/(users)/admin-forgot-password/page.tsx
```

You can customize:
- Colors and styling (already matches login page)
- Instructions/messages
- Validation rules
- Step names

## Testing

### Test 1: Update Password via Script
```bash
node scripts/reset-admin.js
```
✅ Should display success message with new password

### Test 2: Login with New Password
1. Go to `/admin-login`
2. Enter email: `admin@thewallstack.com`
3. Enter password: `admin123` (or your new password)
4. Should log in successfully

### Test 3: Forgot Password Flow
1. Go to `/admin-forgot-password`
2. Try wrong secret code → Should show error
3. Enter correct secret code → Move to step 2
4. Enter mismatched passwords → Should show error
5. Enter matching valid passwords → Should reset successfully
6. Should redirect to login page

### Test 4: Login with Reset Password
1. Go to `/admin-login`
2. Use the new password you just set
3. Should log in successfully

## Database Impact

The solution uses existing database schema:
- **users** table - Updates role (already exists)
- **account** table - Updates password hash (already exists)

No migration needed. Just password updates.

## Troubleshooting

### Issue: "Invalid secret code"
**Solution:** Check that `ADMIN_FORGOT_PASSWORD_CODE` environment variable is set correctly

### Issue: "Failed to update password"
**Solution:** 
1. Check database connection
2. Verify admin user exists
3. Check account record for admin user

### Issue: Script doesn't work
**Solution:**
1. Make sure you're in project root directory
2. Check that `node_modules` is installed: `npm install`
3. Verify `.env` file is loaded

### Issue: Passwords don't match
**Solution:** Make sure confirm password is exactly the same as new password (case-sensitive)

## Best Practices

✅ **DO:**
- Use a strong, unique secret code
- Change secret code periodically
- Keep environment variables secure
- Test forgot password flow regularly
- Use minimum password length of 8+ characters

❌ **DON'T:**
- Share secret code via email or chat
- Use predictable codes (123456, password123, etc.)
- Commit secret code to version control
- Use same password for multiple accounts
- Write down secret code in plain text

## Security Recommendations

1. **Rotate Secret Code Periodically**
   ```bash
   # Every 3-6 months
   # Update ADMIN_FORGOT_PASSWORD_CODE in Vercel/env
   ```

2. **Use Strong Secret Code**
   ```
   Format: RandomString@Year#Code$Symbols
   Example: Th3W@ll2024#Stack$Secure
   ```

3. **Monitor Access Logs**
   - Check admin login attempts
   - Watch for failed password attempts

4. **Enforce Strong Passwords**
   - Minimum 12 characters recommended
   - Mix of uppercase, lowercase, numbers, symbols
   - No dictionary words

## API Reference

### updateAdminPassword(newPassword: string)
Updates the admin user's password directly.

```typescript
const result = await updateAdminPassword("newPassword123");
// Returns: { success: boolean, message: string, error?: string }
```

### verifyForgotPasswordCode(secretCode: string)
Verifies if the provided secret code is correct.

```typescript
const result = await verifyForgotPasswordCode("secret-code");
// Returns: { success: boolean, message?: string, error?: string }
```

### resetAdminPasswordWithCode(secretCode: string, newPassword: string)
Complete forgot password reset with code verification.

```typescript
const result = await resetAdminPasswordWithCode("secret-code", "newPassword");
// Returns: { success: boolean, message: string, error?: string, email?: string }
```

## Summary

✨ **What You Have:**
- ✅ Password reset script (`reset-admin.js`)
- ✅ Forgot password page (`admin-forgot-password`)
- ✅ Secret code verification
- ✅ Password update actions
- ✅ Secure hashing with bcrypt
- ✅ Beautiful UI matching login page

🔒 **Security:**
- ✅ Environment variable protected secret code
- ✅ Server-side validation
- ✅ bcrypt password hashing
- ✅ No password logging
- ✅ Confirmation password matching

🚀 **Ready to Deploy:**
- ✅ No database migrations needed
- ✅ Uses existing schema
- ✅ Works with better-auth
- ✅ Compatible with Next.js 16
- ✅ Vercel-ready

---

**Status**: ✅ Complete and Ready to Use  
**Last Updated**: January 2026
