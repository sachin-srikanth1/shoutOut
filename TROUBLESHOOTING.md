# 🔧 Troubleshooting: "Database error saving new user"

## 🚨 **Immediate Fix**

1. **Run the fix script** in your Supabase SQL Editor:
   ```sql
   -- Copy and paste the contents of fix-database-issue.sql
   ```

2. **Test the fix** by trying to sign up a new user

## 🔍 **Root Cause Analysis**

The error occurs because:

1. **Trigger Function Issue**: The `handle_new_user()` function tries to insert into `user_profiles` when a new user is created
2. **Missing Metadata**: The function expects `first_name`, `last_name`, and `full_name` in user metadata, but these might be null
3. **RLS Policy Conflict**: The trigger doesn't have permission to insert due to Row Level Security policies
4. **Constraint Violations**: The insert might violate table constraints

## 🛠️ **What the Fix Does**

1. **Makes the function robust** with `COALESCE()` to handle null values
2. **Adds exception handling** so user creation doesn't fail if profile creation fails
3. **Adds RLS policy** to allow trigger inserts
4. **Recreates the trigger** with the improved function

## 📋 **Verification Steps**

1. **Check Supabase Logs**:
   - Go to your Supabase Dashboard
   - Navigate to Logs > Database
   - Look for any errors related to `handle_new_user`

2. **Test User Creation**:
   - Try signing up a new user
   - Check if the user profile is created in the `user_profiles` table

3. **Check Environment Variables**:
   ```bash
   # Verify these are set correctly
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🔄 **Alternative Solutions**

If the fix doesn't work, try these alternatives:

### Option 1: Disable the Trigger Temporarily
```sql
-- Drop the trigger to allow user creation without profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

### Option 2: Create Profile Manually
```sql
-- Create a profile manually for existing users
INSERT INTO public.user_profiles (id, email, first_name, last_name, full_name)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'first_name', ''),
    COALESCE(raw_user_meta_data->>'last_name', ''),
    COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.user_profiles);
```

### Option 3: Use Service Role Key
If RLS is causing issues, you can temporarily use the service role key for authentication:

```typescript
// In your auth context, use service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

## 🚀 **Prevention**

To prevent this issue in the future:

1. **Test thoroughly** before deploying database changes
2. **Use staging environment** for testing database migrations
3. **Monitor Supabase logs** for errors
4. **Add proper error handling** in all database functions

## 📞 **Need Help?**

If the issue persists:

1. Check the Supabase logs for specific error messages
2. Verify your environment variables are correct
3. Test with a fresh database setup
4. Contact Supabase support if needed

## ✅ **Success Indicators**

You'll know the fix worked when:

- ✅ New user signup works without errors
- ✅ User profiles are created automatically
- ✅ No "Database error saving new user" messages
- ✅ Onboarding flow works correctly 