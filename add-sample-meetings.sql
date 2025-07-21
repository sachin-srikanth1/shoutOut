-- =====================================================
-- ADD SAMPLE MEETINGS DATA
-- Creates sample meetings for testing the upcoming meetings functionality
-- =====================================================

-- First, let's see what users exist
SELECT id, email, first_name, last_name 
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Get meeting types
SELECT id, name, slug, color 
FROM public.meeting_types 
ORDER BY name;

-- Add sample meetings
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
        
        -- Meeting 4: This week
        start_time = NOW() + INTERVAL '4 days' + INTERVAL '9 hours';
        end_time = start_time + INTERVAL '45 minutes';
        
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
            meeting_type_ids[4], -- Fourth meeting type
            '1-on-1 with Manager',
            'Weekly check-in and career development discussion',
            start_time,
            end_time,
            'UTC',
            'Private Office',
            'scheduled',
            FALSE
        );
        
        -- Meeting 5: Next week
        start_time = NOW() + INTERVAL '7 days' + INTERVAL '13 hours';
        end_time = start_time + INTERVAL '3 hours';
        
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
            meeting_type_ids[5], -- Fifth meeting type
            'Workshop: Advanced Techniques',
            'Hands-on workshop covering advanced development techniques',
            start_time,
            end_time,
            'UTC',
            'Training Room',
            'scheduled',
            TRUE
        );
        
        RAISE NOTICE 'Created 5 sample meetings for user %', current_user_id;
    ELSE
        RAISE NOTICE 'No users or meeting types found to create meetings';
    END IF;
END $$;

-- Show the created meetings
SELECT 
    m.id,
    m.title,
    m.start_time,
    m.end_time,
    m.location,
    m.status,
    mt.name as meeting_type,
    mt.color as type_color,
    up.email as organizer_email
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
LEFT JOIN public.user_profiles up ON m.organizer_id = up.id
ORDER BY m.start_time;

-- Count meetings by type
SELECT 
    mt.name as meeting_type,
    COUNT(m.id) as meeting_count
FROM public.meeting_types mt
LEFT JOIN public.meetings m ON mt.id = m.type_id
GROUP BY mt.id, mt.name
ORDER BY meeting_count DESC; 