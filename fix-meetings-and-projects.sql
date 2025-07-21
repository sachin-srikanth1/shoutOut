-- =====================================================
-- FIX MEETINGS AND PROJECTS TABLES
-- Targeted fix for the 2 remaining failing tables
-- =====================================================

-- Step 1: Check current state of failing tables
SELECT 'CURRENT STATE OF FAILING TABLES:' as status;

-- Check meetings table
SELECT 'MEETINGS TABLE:' as check_type;
SELECT 
    COUNT(*) as total_meetings,
    COUNT(CASE WHEN organizer_id IS NOT NULL THEN 1 END) as meetings_with_organizer
FROM public.meetings;

-- Check projects table
SELECT 'PROJECTS TABLE:' as check_type;
SELECT 
    COUNT(*) as total_projects,
    COUNT(CASE WHEN creator_id IS NOT NULL THEN 1 END) as projects_with_creator
FROM public.projects;

-- Check if we have any users
SELECT 'USERS CHECK:' as check_type;
SELECT 
    COUNT(*) as total_users
FROM public.user_profiles;

SELECT 'FIRST USER:' as check_type;
SELECT 
    id as first_user_id,
    email as first_user_email
FROM public.user_profiles 
ORDER BY created_at
LIMIT 1;

-- Step 2: Check RLS policies for meetings and projects
SELECT 'RLS POLICIES FOR MEETINGS:' as check_type;
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'meetings'
ORDER BY policyname;

SELECT 'RLS POLICIES FOR PROJECTS:' as check_type;
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'projects'
ORDER BY policyname;

-- Step 3: Drop and recreate RLS policies for meetings (simplified)
SELECT 'FIXING MEETINGS RLS POLICIES:' as status;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can view public meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can update their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can delete their own meetings" ON public.meetings;

-- Create simplified policies
CREATE POLICY "Users can view their own meetings" ON public.meetings
    FOR SELECT USING (auth.uid() = organizer_id);

CREATE POLICY "Users can view public meetings" ON public.meetings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create meetings" ON public.meetings
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own meetings" ON public.meetings
    FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete their own meetings" ON public.meetings
    FOR DELETE USING (auth.uid() = organizer_id);

-- Step 4: Drop and recreate RLS policies for projects (simplified)
SELECT 'FIXING PROJECTS RLS POLICIES:' as status;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view public projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create simplified policies
CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can view public projects" ON public.projects
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = creator_id);

-- Step 5: Ensure we have sample data for the first user
DO $$
DECLARE
    current_user_id UUID;
    meeting_type_ids UUID[];
    project_status_ids UUID[];
    existing_meetings INTEGER;
    existing_projects INTEGER;
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
    
    -- Check existing data
    SELECT COUNT(*) INTO existing_meetings FROM public.meetings WHERE organizer_id = current_user_id;
    SELECT COUNT(*) INTO existing_projects FROM public.projects WHERE creator_id = current_user_id;
    
    RAISE NOTICE 'Existing meetings: %, Existing projects: %', existing_meetings, existing_projects;
    
    -- Create sample meetings if none exist
    IF existing_meetings = 0 AND array_length(meeting_type_ids, 1) > 0 THEN
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
    
    -- Create sample projects if none exist
    IF existing_projects = 0 AND array_length(project_status_ids, 1) > 0 THEN
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
    
END $$;

-- Step 6: Test the fixes
SELECT 'TESTING FIXES:' as status;

-- Test meetings access
DO $$
DECLARE
    test_user_id UUID;
    meeting_count INTEGER;
BEGIN
    SELECT id INTO test_user_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Test meetings access
        BEGIN
            SELECT COUNT(*) INTO meeting_count FROM public.meetings WHERE organizer_id = test_user_id;
            RAISE NOTICE 'meetings: ✅ ACCESSIBLE (found % meetings)', meeting_count;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'meetings: ❌ ERROR - %', SQLERRM;
        END;
        
        -- Test projects access
        BEGIN
            SELECT COUNT(*) INTO meeting_count FROM public.projects WHERE creator_id = test_user_id;
            RAISE NOTICE 'projects: ✅ ACCESSIBLE (found % projects)', meeting_count;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'projects: ❌ ERROR - %', SQLERRM;
        END;
        
    ELSE
        RAISE NOTICE 'No users found for testing';
    END IF;
END $$;

-- Step 7: Final verification
SELECT 'FINAL VERIFICATION:' as status;

SELECT 'MEETINGS AFTER FIX:' as check_type;
SELECT 
    m.title,
    m.start_time,
    mt.name as meeting_type,
    m.organizer_id
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
ORDER BY m.start_time;

SELECT 'PROJECTS AFTER FIX:' as check_type;
SELECT 
    p.title,
    p.progress,
    ps.name as status,
    p.creator_id
FROM public.projects p
LEFT JOIN public.project_statuses ps ON p.status_id = ps.id
ORDER BY p.created_at;

SELECT 'FIX COMPLETE - Refresh your dashboard to see the results!' as final_status; 