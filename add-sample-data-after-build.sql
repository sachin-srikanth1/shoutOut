-- =====================================================
-- ADD SAMPLE DATA AFTER FRESH BUILD
-- Creates sample data for testing all functionality
-- =====================================================

-- First, let's see what users exist
SELECT 'EXISTING USERS:' as status;
SELECT id, email, first_name, last_name 
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Add sample meetings for the first user
DO $$
DECLARE
    current_user_id UUID;
    meeting_type_ids UUID[];
    i INTEGER;
    start_time TIMESTAMP WITH TIME ZONE;
    end_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get the current user (first user in the system)
    SELECT id INTO current_user_id 
    FROM public.user_profiles 
    ORDER BY created_at 
    LIMIT 1;
    
    -- Get meeting type IDs
    SELECT ARRAY_AGG(id) INTO meeting_type_ids 
    FROM public.meeting_types;
    
    -- If we have a user and meeting types, create sample meetings
    IF current_user_id IS NOT NULL AND array_length(meeting_type_ids, 1) > 0 THEN
        
        -- Meeting 1: Today
        start_time = NOW() + INTERVAL '2 hours';
        end_time = start_time + INTERVAL '1 hour';
        
        INSERT INTO public.meetings (
            organizer_id,
            type_id,
            title,
            description,
            start_time,
            end_time,
            timezone,
            location,
            status,
            is_public
        ) VALUES (
            current_user_id,
            meeting_type_ids[1], -- First meeting type
            'Team Standup Meeting',
            'Daily team standup to discuss progress and blockers',
            start_time,
            end_time,
            'UTC',
            'Conference Room A',
            'scheduled',
            FALSE
        );
        
        -- Meeting 2: Tomorrow
        start_time = NOW() + INTERVAL '1 day' + INTERVAL '10 hours';
        end_time = start_time + INTERVAL '1.5 hours';
        
        INSERT INTO public.meetings (
            organizer_id,
            type_id,
            title,
            description,
            start_time,
            end_time,
            timezone,
            location,
            status,
            is_public
        ) VALUES (
            current_user_id,
            meeting_type_ids[2], -- Second meeting type
            'Client Presentation',
            'Present quarterly results to key client',
            start_time,
            end_time,
            'UTC',
            'Virtual Meeting',
            'scheduled',
            TRUE
        );
        
        -- Meeting 3: Day after tomorrow
        start_time = NOW() + INTERVAL '2 days' + INTERVAL '14 hours';
        end_time = start_time + INTERVAL '2 hours';
        
        INSERT INTO public.meetings (
            organizer_id,
            type_id,
            title,
            description,
            start_time,
            end_time,
            timezone,
            location,
            status,
            is_public
        ) VALUES (
            current_user_id,
            meeting_type_ids[3], -- Third meeting type
            'Project Review',
            'Review project milestones and deliverables',
            start_time,
            end_time,
            'UTC',
            'Board Room',
            'scheduled',
            FALSE
        );
        
        RAISE NOTICE 'Created 3 sample meetings for user %', current_user_id;
    ELSE
        RAISE NOTICE 'No users or meeting types found to create meetings';
    END IF;
END $$;

-- Add sample recommended profiles
DO $$
DECLARE
    current_user_id UUID;
    other_user_ids UUID[];
    category_ids UUID[];
    i INTEGER;
BEGIN
    -- Get the current user (first user in the system)
    SELECT id INTO current_user_id 
    FROM public.user_profiles 
    ORDER BY created_at 
    LIMIT 1;
    
    -- Get other users (excluding the current user)
    SELECT ARRAY_AGG(id) INTO other_user_ids 
    FROM public.user_profiles 
    WHERE id != current_user_id;
    
    -- Get category IDs
    SELECT ARRAY_AGG(id) INTO category_ids 
    FROM public.profile_categories;
    
    -- If we have other users and categories, create recommendations
    IF array_length(other_user_ids, 1) > 0 AND array_length(category_ids, 1) > 0 THEN
        FOR i IN 1..LEAST(array_length(other_user_ids, 1), 3) LOOP
            -- Create recommendation with random category and score
            INSERT INTO public.recommended_profiles (
                user_id, 
                recommended_user_id, 
                category_id, 
                reason, 
                score,
                is_viewed,
                is_contacted
            ) VALUES (
                current_user_id,
                other_user_ids[i],
                category_ids[1 + (i % array_length(category_ids, 1))],
                CASE (i % 3)
                    WHEN 0 THEN 'Similar industry background'
                    WHEN 1 THEN 'Shared skills and interests'
                    WHEN 2 THEN 'Complementary expertise'
                END,
                (0.7 + (random() * 0.3))::DECIMAL(3,2),
                FALSE,
                FALSE
            ) ON CONFLICT (user_id, recommended_user_id) DO NOTHING;
        END LOOP;
        
        RAISE NOTICE 'Created % recommendations for user %', 
            LEAST(array_length(other_user_ids, 1), 3), 
            current_user_id;
    ELSE
        RAISE NOTICE 'No other users or categories found to create recommendations';
    END IF;
END $$;

-- Add sample notifications
DO $$
DECLARE
    current_user_id UUID;
    notification_type_ids UUID[];
    i INTEGER;
BEGIN
    -- Get the current user (first user in the system)
    SELECT id INTO current_user_id 
    FROM public.user_profiles 
    ORDER BY created_at 
    LIMIT 1;
    
    -- Get notification type IDs
    SELECT ARRAY_AGG(id) INTO notification_type_ids 
    FROM public.notification_types;
    
    -- If we have a user and notification types, create sample notifications
    IF current_user_id IS NOT NULL AND array_length(notification_type_ids, 1) > 0 THEN
        
        -- Notification 1
        INSERT INTO public.user_notifications (
            user_id,
            type_id,
            title,
            message,
            is_read
        ) VALUES (
            current_user_id,
            notification_type_ids[1],
            'New Connection Request',
            'John Doe wants to connect with you',
            FALSE
        );
        
        -- Notification 2
        INSERT INTO public.user_notifications (
            user_id,
            type_id,
            title,
            message,
            is_read
        ) VALUES (
            current_user_id,
            notification_type_ids[2],
            'Meeting Invitation',
            'You have been invited to "Team Standup Meeting"',
            FALSE
        );
        
        -- Notification 3
        INSERT INTO public.user_notifications (
            user_id,
            type_id,
            title,
            message,
            is_read
        ) VALUES (
            current_user_id,
            notification_type_ids[3],
            'Task Assignment',
            'You have been assigned: "Review project documentation"',
            TRUE
        );
        
        RAISE NOTICE 'Created 3 sample notifications for user %', current_user_id;
    ELSE
        RAISE NOTICE 'No users or notification types found to create notifications';
    END IF;
END $$;

-- Add sample projects
DO $$
DECLARE
    current_user_id UUID;
    project_status_ids UUID[];
    i INTEGER;
BEGIN
    -- Get the current user (first user in the system)
    SELECT id INTO current_user_id 
    FROM public.user_profiles 
    ORDER BY created_at 
    LIMIT 1;
    
    -- Get project status IDs
    SELECT ARRAY_AGG(id) INTO project_status_ids 
    FROM public.project_statuses;
    
    -- If we have a user and project statuses, create sample projects
    IF current_user_id IS NOT NULL AND array_length(project_status_ids, 1) > 0 THEN
        
        -- Project 1: In Progress
        INSERT INTO public.projects (
            creator_id,
            status_id,
            title,
            description,
            start_date,
            due_date,
            priority,
            progress,
            is_public
        ) VALUES (
            current_user_id,
            project_status_ids[2], -- In Progress
            'Website Redesign',
            'Complete redesign of company website with modern UI/UX',
            CURRENT_DATE - INTERVAL '10 days',
            CURRENT_DATE + INTERVAL '20 days',
            'high',
            65,
            FALSE
        );
        
        -- Project 2: Planning
        INSERT INTO public.projects (
            creator_id,
            status_id,
            title,
            description,
            start_date,
            due_date,
            priority,
            progress,
            is_public
        ) VALUES (
            current_user_id,
            project_status_ids[1], -- Planning
            'Mobile App Development',
            'Develop a new mobile application for iOS and Android',
            CURRENT_DATE + INTERVAL '5 days',
            CURRENT_DATE + INTERVAL '60 days',
            'medium',
            15,
            TRUE
        );
        
        RAISE NOTICE 'Created 2 sample projects for user %', current_user_id;
    ELSE
        RAISE NOTICE 'No users or project statuses found to create projects';
    END IF;
END $$;

-- Show the created data
SELECT 'SAMPLE DATA SUMMARY:' as status;

SELECT 'MEETINGS:' as data_type;
SELECT 
    m.title,
    m.start_time,
    mt.name as meeting_type,
    m.is_public
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
ORDER BY m.start_time;

SELECT 'RECOMMENDATIONS:' as data_type;
SELECT 
    COUNT(*) as recommendation_count
FROM public.recommended_profiles;

SELECT 'NOTIFICATIONS:' as data_type;
SELECT 
    un.title,
    un.is_read,
    nt.name as notification_type
FROM public.user_notifications un
LEFT JOIN public.notification_types nt ON un.type_id = nt.id
ORDER BY un.created_at DESC;

SELECT 'PROJECTS:' as data_type;
SELECT 
    p.title,
    p.progress,
    ps.name as status
FROM public.projects p
LEFT JOIN public.project_statuses ps ON p.status_id = ps.id
ORDER BY p.created_at DESC; 