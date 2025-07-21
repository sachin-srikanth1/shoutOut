-- =====================================================
-- CREATE TEST USER PROFILE
-- Manually create a user profile for testing
-- =====================================================

-- First, let's see what users exist in auth.users
SELECT 'AUTH USERS:' as status;
SELECT 
    id,
    email,
    created_at,
    user_metadata
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Create a test user profile for the first auth user
DO $$
DECLARE
    auth_user_id UUID;
    auth_user_email TEXT;
    auth_user_metadata JSONB;
BEGIN
    -- Get the first auth user
    SELECT id, email, user_metadata INTO auth_user_id, auth_user_email, auth_user_metadata
    FROM auth.users 
    ORDER BY created_at 
    LIMIT 1;
    
    IF auth_user_id IS NOT NULL THEN
        RAISE NOTICE 'Creating profile for auth user: % (%s)', auth_user_id, auth_user_email;
        
        -- Check if profile already exists
        IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth_user_id) THEN
            -- Create the profile
            INSERT INTO public.user_profiles (
                id,
                email,
                first_name,
                last_name,
                full_name,
                created_at,
                updated_at
            ) VALUES (
                auth_user_id,
                auth_user_email,
                COALESCE(auth_user_metadata->>'first_name', auth_user_metadata->>'name', 'Test'),
                COALESCE(auth_user_metadata->>'last_name', 'User'),
                COALESCE(auth_user_metadata->>'full_name', auth_user_metadata->>'name', auth_user_email),
                NOW(),
                NOW()
            );
            
            RAISE NOTICE 'Successfully created user profile for %', auth_user_email;
        ELSE
            RAISE NOTICE 'User profile already exists for %', auth_user_email;
        END IF;
    ELSE
        RAISE NOTICE 'No auth users found';
    END IF;
END $$;

-- Verify the user profile was created
SELECT 'USER PROFILE VERIFICATION:' as status;
SELECT 
    id,
    email,
    first_name,
    last_name,
    full_name,
    created_at
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Test RLS access for this user
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    SELECT id INTO test_user_id FROM public.user_profiles LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Testing RLS access for user: %', test_user_id;
        
        -- Test user_profiles access
        BEGIN
            PERFORM COUNT(*) FROM public.user_profiles WHERE id = test_user_id;
            RAISE NOTICE 'user_profiles: ACCESSIBLE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'user_profiles: ERROR - %', SQLERRM;
        END;
        
        -- Test meetings access
        BEGIN
            PERFORM COUNT(*) FROM public.meetings WHERE organizer_id = test_user_id;
            RAISE NOTICE 'meetings: ACCESSIBLE (found % records)', (SELECT COUNT(*) FROM public.meetings WHERE organizer_id = test_user_id);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'meetings: ERROR - %', SQLERRM;
        END;
        
        -- Test projects access
        BEGIN
            PERFORM COUNT(*) FROM public.projects WHERE creator_id = test_user_id;
            RAISE NOTICE 'projects: ACCESSIBLE (found % records)', (SELECT COUNT(*) FROM public.projects WHERE creator_id = test_user_id);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'projects: ERROR - %', SQLERRM;
        END;
        
    ELSE
        RAISE NOTICE 'No user profiles found to test';
    END IF;
END $$; 