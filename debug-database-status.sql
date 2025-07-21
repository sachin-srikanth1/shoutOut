-- =====================================================
-- DEBUG DATABASE STATUS
-- Check what's actually in the database and identify issues
-- =====================================================

-- Check if tables exist
SELECT 'TABLE EXISTENCE CHECK:' as status;
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'user_profiles', 'profile_categories', 'recommended_profiles', 
            'notification_types', 'user_notifications', 'meeting_types', 
            'meetings', 'meeting_participants', 'project_statuses', 
            'projects', 'project_members', 'tasks', 'user_connections', 
            'user_activities'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles', 'profile_categories', 'recommended_profiles', 
    'notification_types', 'user_notifications', 'meeting_types', 
    'meetings', 'meeting_participants', 'project_statuses', 
    'projects', 'project_members', 'tasks', 'user_connections', 
    'user_activities'
)
ORDER BY table_name;

-- Check RLS policies
SELECT 'RLS POLICIES CHECK:' as status;
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if there are any users in user_profiles
SELECT 'USER PROFILES CHECK:' as status;
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
    COUNT(CASE WHEN first_name IS NOT NULL THEN 1 END) as users_with_first_name
FROM public.user_profiles;

-- Check sample data in key tables
SELECT 'SAMPLE DATA CHECK:' as status;

SELECT 'profile_categories' as table_name, COUNT(*) as count FROM public.profile_categories
UNION ALL
SELECT 'notification_types' as table_name, COUNT(*) as count FROM public.notification_types
UNION ALL
SELECT 'meeting_types' as table_name, COUNT(*) as count FROM public.meeting_types
UNION ALL
SELECT 'project_statuses' as table_name, COUNT(*) as count FROM public.project_statuses
UNION ALL
SELECT 'meetings' as table_name, COUNT(*) as count FROM public.meetings
UNION ALL
SELECT 'recommended_profiles' as table_name, COUNT(*) as count FROM public.recommended_profiles
UNION ALL
SELECT 'user_notifications' as table_name, COUNT(*) as count FROM public.user_notifications
UNION ALL
SELECT 'projects' as table_name, COUNT(*) as count FROM public.projects;

-- Check for any recent errors in the logs (if available)
SELECT 'RECENT ACTIVITY:' as status;
SELECT 
    'user_profiles' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as latest_record
FROM public.user_profiles
UNION ALL
SELECT 
    'meetings' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as latest_record
FROM public.meetings
UNION ALL
SELECT 
    'projects' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as latest_record
FROM public.projects;

-- Test RLS access for a specific user (if any exists)
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get the first user if any exists
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
            RAISE NOTICE 'meetings: ACCESSIBLE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'meetings: ERROR - %', SQLERRM;
        END;
        
        -- Test projects access
        BEGIN
            PERFORM COUNT(*) FROM public.projects WHERE creator_id = test_user_id;
            RAISE NOTICE 'projects: ACCESSIBLE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'projects: ERROR - %', SQLERRM;
        END;
        
    ELSE
        RAISE NOTICE 'No users found to test RLS access';
    END IF;
END $$; 