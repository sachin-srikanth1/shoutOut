# 🔧 Google OAuth Setup Checklist

## 🚨 **Issue: Google OAuth not completing authentication**

The user is showing as `null` after Google OAuth, which means the OAuth flow isn't completing properly.

## 📋 **Step-by-Step Fix**

### **1. Check Supabase OAuth Settings**

Go to your **Supabase Dashboard** → **Authentication** → **Providers** → **Google**

**Required Settings:**
- ✅ **Enabled**: Turn on Google provider
- ✅ **Client ID**: Your Google OAuth client ID
- ✅ **Client Secret**: Your Google OAuth client secret
- ✅ **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

### **2. Check Google Cloud Console**

Go to **Google Cloud Console** → **APIs & Services** → **Credentials**

**Required Settings:**
- ✅ **Authorized JavaScript origins**:
  - `http://localhost:3000` (for development)
  - `https://your-domain.com` (for production)
- ✅ **Authorized redirect URIs**:
  - `https://your-project.supabase.co/auth/v1/callback`

### **3. Test OAuth Configuration**

Visit this URL to test OAuth setup:
```
http://localhost:3000/api/test-oauth
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OAuth configuration is working",
  "data": {
    "url": "https://accounts.google.com/oauth/authorize?...",
    "provider": "google"
  }
}
```

### **4. Check Browser Console**

1. Open browser developer tools (F12)
2. Go to Console tab
3. Try Google OAuth sign-in
4. Look for these log messages:
   ```
   Starting Google OAuth...
   Redirect URL: http://localhost:3000/auth/callback
   Google OAuth initiated successfully: {...}
   Auth state change: SIGNED_IN user@example.com
   ```

### **5. Common Issues & Fixes**

#### **Issue: "OAuth configuration error"**
- Check Google Cloud Console settings
- Verify redirect URIs match exactly
- Ensure Google OAuth API is enabled

#### **Issue: "No session returned from OAuth exchange"**
- Check Supabase callback URL
- Verify environment variables
- Check browser cookies/session storage

#### **Issue: Redirect loop**
- Check middleware redirect logic
- Verify callback route is working
- Check for conflicting redirects

### **6. Environment Variables Check**

Verify these are set correctly:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### **7. Test the Complete Flow**

1. **Clear browser data** (cookies, local storage)
2. **Visit your app** at `http://localhost:3000`
3. **Click "Continue with Google"**
4. **Complete Google OAuth**
5. **Check if redirected to onboarding**

### **8. Debug Steps**

If still not working:

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs → Auth
   - Look for OAuth-related errors

2. **Check Network Tab**:
   - Open browser dev tools → Network
   - Look for failed requests to Supabase

3. **Test with different browser**:
   - Try incognito/private mode
   - Try different browser

## ✅ **Success Indicators**

You'll know it's working when:

- ✅ `/api/test-oauth` returns success
- ✅ Browser console shows OAuth flow logs
- ✅ User is redirected to onboarding after Google sign-in
- ✅ `/api/test-auth` shows `"authenticated": true`
- ✅ User object is not null

## 🆘 **Still Not Working?**

If the issue persists:

1. **Double-check all URLs** in Google Cloud Console
2. **Verify Supabase project settings**
3. **Check for typos** in client ID/secret
4. **Try email/password auth** as fallback
5. **Contact Supabase support** if needed

**Run the OAuth test first and let me know what it returns!** 🎯 