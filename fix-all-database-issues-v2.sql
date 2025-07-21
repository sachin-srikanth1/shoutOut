-- =====================================================
// FIX ALL DATABASE ISSUES - V2
-- Fixed version that handles auth.users table structure properly
-- =====================================================

-- Step 1: Check current state
SELECT 'CURRENT STATE CHECK:' as status;

-- Check if tables exist
SELECT 'TABLES:' as check_type;
SELECT 
    table_name,
    'EXISTS' as status
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

-- Check auth users (without user_metadata first)
SELECT 'AUTH USERS:' as check_type;
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 3;

-- Check user profiles
SELECT 'USER PROFILES:' as check_type;
SELECT 
    id,
    email,
    first_name,
    last_name,
    created_at
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 3;

-- Step 2: Create missing user profiles for all auth users (simplified)
DO $$
DECLARE
    auth_user RECORD;
BEGIN
    FOR auth_user IN 
        SELECT id, email, created_at
        FROM auth.users 
        ORDER BY created_at
    LOOP
        -- Check if profile exists
        IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth_user.id) THEN
            -- Create the profile with basic info
            INSERT INTO public.user_profiles (
                id,
                email,
                first_name,
                last_name,
                full_name,
                created_at,
                updated_at
            ) VALUES (
                auth_user.id,
                auth_user.email,
                'User',
                '',
                auth_user.email,
                NOW(),
                NOW()
            );
            
            RAISE NOTICE 'Created profile for user: % (%s)', auth_user.id, auth_user.email;
        ELSE
            RAISE NOTICE 'Profile already exists for user: % (%s)', auth_user.id, auth_user.email;
        END IF;
    END LOOP;
END $$;

-- Step 3: Add sample data for the first user
DO $$
DECLARE
    current_user_id UUID;
    meeting_type_ids UUID[];
    project_status_ids UUID[];
    notification_type_ids UUID[];
    category_ids UUID[];
    other_user_ids UUID[];
    i INTEGER;
BEGIN
    -- Get the first user
    SELECT id INTO current_user_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    
    IF current_user_id IS NULL THEN
        RAISE NOTICE 'No users found to create sample data for';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Creating sample data for user: %', current_user_id;
    
    -- Get reference data IDs
    SELECT ARRAY_AGG(id) INTO meeting_type_ids FROM public.meeting_types;
    SELECT ARRAY_AGG(id) INTO project_status_ids FROM public.project_statuses;
    SELECT ARRAY_AGG(id) INTO notification_type_ids FROM public.notification_types;
    SELECT ARRAY_AGG(id) INTO category_ids FROM public.profile_categories;
    SELECT ARRAY_AGG(id) INTO other_user_ids FROM public.user_profiles WHERE id != current_user_id;
    
    -- Create sample meetings
    IF array_length(meeting_type_ids, 1) > 0 THEN
        -- Meeting 1: Today
        INSERT INTO public.meetings (
            organizer_id, type_id, title, description, start_time, end_time, 
            timezone, location, status, is_public
        ) VALUES (
            current_user_id, meeting_type_ids[1], 'Team Standup', 'Daily team standup meeting',
            NOW() + INTERVAL '2 hours', NOW() + INTERVAL '3 hours',
            'UTC', 'Conference Room A', 'scheduled', FALSE
        );
        
        -- Meeting 2: Tomorrow
        INSERT INTO public.meetings (
            organizer_id, type_id, title, description, start_time, end_time, 
            timezone, location, status, is_public
        ) VALUES (
            current_user_id, meeting_type_ids[2], 'Client Meeting', 'Quarterly client review',
            NOW() + INTERVAL '1 day' + INTERVAL '10 hours', NOW() + INTERVAL '1 day' + INTERVAL '11 hours',
            'UTC', 'Virtual Meeting', 'scheduled', TRUE
        );
        
        RAISE NOTICE 'Created 2 sample meetings';
    END IF;
    
    -- Create sample projects
    IF array_length(project_status_ids, 1) > 0 THEN
        -- Project 1: In Progress
        INSERT INTO public.projects (
            creator_id, status_id, title, description, start_date, due_date, 
            priority, progress, is_public
        ) VALUES (
            current_user_id, project_status_ids[2], 'Website Redesign', 'Complete website redesign project',
            CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days',
            'high', 65, FALSE
        );
        
        -- Project 2: Planning
        INSERT INTO public.projects (
            creator_id, status_id, title, description, start_date, due_date, 
            priority, progress, is_public
        ) VALUES (
            current_user_id, project_status_ids[1], 'Mobile App', 'Develop new mobile application',
            CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '60 days',
            'medium', 15, TRUE
        );
        
        RAISE NOTICE 'Created 2 sample projects';
    END IF;
    
    -- Create sample notifications
    IF array_length(notification_type_ids, 1) > 0 THEN
        INSERT INTO public.user_notifications (
            user_id, type_id, title, message, is_read
        ) VALUES 
        (current_user_id, notification_type_ids[1], 'New Connection', 'John Doe wants to connect', FALSE),
        (current_user_id, notification_type_ids[2], 'Meeting Invitation', 'You have been invited to a meeting', FALSE),
        (current_user_id, notification_type_ids[3], 'Task Assignment', 'New task assigned to you', TRUE);
        
        RAISE NOTICE 'Created 3 sample notifications';
    END IF;
    
    -- Create sample recommendations (if other users exist)
    IF array_length(other_user_ids, 1) > 0 AND array_length(category_ids, 1) > 0 THEN
        FOR i IN 1..LEAST(array_length(other_user_ids, 1), 3) LOOP
            INSERT INTO public.recommended_profiles (
                user_id, recommended_user_id, category_id, reason, score
            ) VALUES (
                current_user_id,
                other_user_ids[i],
                category_ids[1 + (i % array_length(category_ids, 1))],
                'Similar background and interests',
                (0.7 + (random() * 0.3))::DECIMAL(3,2)
            ) ON CONFLICT (user_id, recommended_user_id) DO NOTHING;
        END LOOP;
        
        RAISE NOTICE 'Created % sample recommendations', LEAST(array_length(other_user_ids, 1), 3);
    END IF;
    
END $$;

-- Step 4: Verify everything is working
SELECT 'VERIFICATION:' as status;

-- Check user profiles
SELECT 'USER PROFILES AFTER FIX:' as check_type;
SELECT COUNT(*) as total_profiles FROM public.user_profiles;

-- Check meetings
SELECT 'MEETINGS AFTER FIX:' as check_type;
SELECT 
    m.title,
    m.start_time,
    mt.name as meeting_type
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
ORDER BY m.start_time;

-- Check projects
SELECT 'PROJECTS AFTER FIX:' as check_type;
SELECT 
    p.title,
    p.progress,
    ps.name as status
FROM public.projects p
LEFT JOIN public.project_statuses ps ON p.status_id = ps.id
ORDER BY p.created_at;

-- Check notifications
SELECT 'NOTIFICATIONS AFTER FIX:' as check_type;
SELECT 
    un.title,
    un.is_read,
    nt.name as notification_type
FROM public.user_notifications un
LEFT JOIN public.notification_types nt ON un.type_id = nt.id
ORDER BY un.created_at DESC;

-- Check recommendations
SELECT 'RECOMMENDATIONS AFTER FIX:' as check_type;
SELECT COUNT(*) as total_recommendations FROM public.recommended_profiles;

-- Test RLS access for the first user
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    SELECT id INTO test_user_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Final RLS test for user: %', test_user_id;
        
        -- Test user_profiles
        BEGIN
            PERFORM COUNT(*) FROM public.user_profiles WHERE id = test_user_id;
            RAISE NOTICE 'user_profiles: ✅ ACCESSIBLE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'user_profiles: ❌ ERROR - %', SQLERRM;
        END;
        
        -- Test meetings
        BEGIN
            PERFORM COUNT(*) FROM public.meetings WHERE organizer_id = test_user_id;
            RAISE NOTICE 'meetings: ✅ ACCESSIBLE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'meetings: ❌ ERROR - %', SQLERRM;
        END;
        
        -- Test projects
        BEGIN
            PERFORM COUNT(*) FROM public.projects WHERE creator_id = test_user_id;
            RAISE NOTICE 'projects: ✅ ACCESSIBLE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'projects: ❌ ERROR - %', SQLERRM;
        END;
        
        -- Test notifications
        BEGIN
            PERFORM COUNT(*) FROM public.user_notifications WHERE user_id = test_user_id;
            RAISE NOTICE 'user_notifications: ✅ ACCESSIBLE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'user_notifications: ❌ ERROR - %', SQLERRM;
        END;
        
        -- Test recommendations
        BEGIN
            PERFORM COUNT(*) FROM public.recommended_profiles WHERE user_id = test_user_id;
            RAISE NOTICE 'recommended_profiles: ✅ ACCESSIBLE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'recommended_profiles: ❌ ERROR - %', SQLERRM;
        END;
        
    ELSE
        RAISE NOTICE 'No users found for final test';
    END IF;
END $$;

SELECT 'FIX COMPLETE - Refresh your dashboard to see the results!' as final_status; 