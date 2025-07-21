# 🔍 **OAuth Flow Debugging Guide**

## **Current Status: OAuth Configuration Working ✅**

The OAuth test shows the configuration is correct. Now let's debug the flow step by step.

## **Step-by-Step Test**

### **1. Clear Browser Data**
- Clear cookies and local storage
- Open browser in incognito/private mode

### **2. Start OAuth Flow**
1. Go to `http://localhost:3000`
2. Click "Continue with Google"
3. Complete Google authentication
4. **Watch the browser console** for these logs:
   ```
   Starting Google OAuth...
   Redirect URL: http://localhost:3000/auth/callback
   Google OAuth initiated successfully: {...}
   ```

### **3. Check Callback Processing**
After Google redirects back, you should see these logs in the **server console** (terminal where you run `npm run dev`):
   ```
   OAuth callback received: { code: true, error: null, errorDescription: null }
   Exchanging code for session...
   Exchange successful: { hasSession: true, hasUser: true, userEmail: "user@example.com" }
   Redirecting to: http://localhost:3000/onboarding
   ```

### **4. Check Auth State Change**
In the **browser console**, you should see:
   ```
   Auth state change: SIGNED_IN user@example.com
   Ensuring user profile exists for: user@example.com
   User onboarding completed: false
   ```

### **5. Test Authentication Status**
Visit: `http://localhost:3000/api/test-auth`

**Expected Response:**
```json
{
  "success": true,
  "message": "Authentication and database working",
  "authenticated": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

## **Common Issues & Solutions**

### **Issue: No callback logs in server console**
- **Cause**: Callback route not being hit
- **Solution**: Check if middleware is blocking the callback

### **Issue: "Exchange error" in server console**
- **Cause**: Code exchange failing
- **Solution**: Check Supabase project settings and environment variables

### **Issue: "No session returned" in server console**
- **Cause**: Session creation failing
- **Solution**: Check database connection and RLS policies

### **Issue: No auth state change in browser console**
- **Cause**: Client-side auth not detecting session
- **Solution**: Check cookies and local storage

## **Quick Fixes to Try**

### **Fix 1: Disable Middleware Temporarily**
Comment out the middleware redirects to see if they're interfering:
```typescript
// In middleware.ts, comment out these lines:
// if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname === '/')) {
//   // ... redirect logic
// }
```

### **Fix 2: Check Environment Variables**
Verify these are set correctly in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://pjcmcekceopocnshrftk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### **Fix 3: Test with Different Browser**
Try the OAuth flow in:
- Chrome incognito
- Firefox private mode
- Safari private mode

## **What to Report**

After running the test, tell me:

1. **What logs appear in browser console?**
2. **What logs appear in server console?**
3. **What does `/api/test-auth` return after OAuth?**
4. **Are you redirected to `/onboarding` after Google auth?**

This will help us pinpoint exactly where the OAuth flow is breaking! 🎯 