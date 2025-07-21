-- =====================================================
-- SIMPLE FIX FOR MEETINGS AND PROJECTS
-- Clean, simple fix without any GROUP BY issues
-- =====================================================

-- Step 1: Check current state
SELECT 'CURRENT STATE:' as status;

-- Check meetings
SELECT 'MEETINGS COUNT:' as check_type;
SELECT COUNT(*) as total_meetings FROM public.meetings;

-- Check projects  
SELECT 'PROJECTS COUNT:' as check_type;
SELECT COUNT(*) as total_projects FROM public.projects;

-- Check users
SELECT 'USERS COUNT:' as check_type;
SELECT COUNT(*) as total_users FROM public.user_profiles;

-- Get first user
SELECT 'FIRST USER:' as check_type;
SELECT id, email FROM public.user_profiles ORDER BY created_at LIMIT 1;

-- Step 2: Fix RLS policies for meetings
SELECT 'FIXING MEETINGS RLS:' as status;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can view public meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can update their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can delete their own meetings" ON public.meetings;

-- Create new policies
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

-- Step 3: Fix RLS policies for projects
SELECT 'FIXING PROJECTS RLS:' as status;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view public projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create new policies
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

-- Step 4: Add sample data
DO $$
DECLARE
    user_id UUID;
    meeting_type_id UUID;
    project_status_id UUID;
BEGIN
    -- Get first user
    SELECT id INTO user_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    
    -- Get first meeting type
    SELECT id INTO meeting_type_id FROM public.meeting_types LIMIT 1;
    
    -- Get first project status
    SELECT id INTO project_status_id FROM public.project_statuses LIMIT 1;
    
    IF user_id IS NOT NULL THEN
        -- Add sample meeting if none exist
        IF NOT EXISTS (SELECT 1 FROM public.meetings WHERE organizer_id = user_id) THEN
            INSERT INTO public.meetings (
                organizer_id, type_id, title, description, start_time, end_time, 
                timezone, location, status, is_public
            ) VALUES (
                user_id, meeting_type_id, 'Team Standup', 'Daily team meeting',
                NOW() + INTERVAL '2 hours', NOW() + INTERVAL '3 hours',
                'UTC', 'Conference Room A', 'scheduled', FALSE
            );
            RAISE NOTICE 'Created sample meeting';
        END IF;
        
        -- Add sample project if none exist
        IF NOT EXISTS (SELECT 1 FROM public.projects WHERE creator_id = user_id) THEN
            INSERT INTO public.projects (
                creator_id, status_id, title, description, start_date, due_date, 
                priority, progress, is_public
            ) VALUES (
                user_id, project_status_id, 'Website Redesign', 'Complete website redesign',
                CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days',
                'high', 65, FALSE
            );
            RAISE NOTICE 'Created sample project';
        END IF;
    END IF;
END $$;

-- Step 5: Verify the fix
SELECT 'VERIFICATION:' as status;

-- Check meetings after fix
SELECT 'MEETINGS AFTER FIX:' as check_type;
SELECT title, start_time FROM public.meetings ORDER BY start_time;

-- Check projects after fix
SELECT 'PROJECTS AFTER FIX:' as check_type;
SELECT title, progress FROM public.projects ORDER BY created_at;

-- Test access
DO $$
DECLARE
    user_id UUID;
    meeting_count INTEGER;
    project_count INTEGER;
BEGIN
    SELECT id INTO user_id FROM public.user_profiles ORDER BY created_at LIMIT 1;
    
    IF user_id IS NOT NULL THEN
        -- Test meetings
        SELECT COUNT(*) INTO meeting_count FROM public.meetings WHERE organizer_id = user_id;
        RAISE NOTICE 'meetings: ✅ ACCESSIBLE (found % meetings)', meeting_count;
        
        -- Test projects
        SELECT COUNT(*) INTO project_count FROM public.projects WHERE creator_id = user_id;
        RAISE NOTICE 'projects: ✅ ACCESSIBLE (found % projects)', project_count;
    END IF;
END $$;

SELECT 'FIX COMPLETE - Refresh your dashboard!' as final_status; 