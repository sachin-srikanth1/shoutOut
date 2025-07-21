-- =====================================================
-- TEST MEETINGS ACCESS
-- Verifies that meetings data is accessible with current RLS policies
-- =====================================================

-- Test 1: Check if meetings exist
SELECT 'TEST 1: MEETINGS COUNT' as test;
SELECT COUNT(*) as total_meetings FROM public.meetings;

-- Test 2: Check upcoming meetings (same query as frontend)
SELECT 'TEST 2: UPCOMING MEETINGS' as test;
SELECT 
    m.id,
    m.title,
    m.start_time,
    m.end_time,
    m.organizer_id,
    mt.name as meeting_type,
    m.is_public
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
WHERE m.start_time >= NOW()
ORDER BY m.start_time
LIMIT 10;

-- Test 3: Check meetings by organizer (for current user)
SELECT 'TEST 3: MEETINGS BY ORGANIZER' as test;
SELECT 
    m.id,
    m.title,
    m.start_time,
    m.organizer_id,
    mt.name as meeting_type
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
WHERE m.organizer_id IS NOT NULL
ORDER BY m.start_time
LIMIT 5;

-- Test 4: Check public meetings
SELECT 'TEST 4: PUBLIC MEETINGS' as test;
SELECT 
    m.id,
    m.title,
    m.start_time,
    m.is_public
FROM public.meetings m
WHERE m.is_public = true
ORDER BY m.start_time
LIMIT 5;

-- Test 5: Check meeting participants
SELECT 'TEST 5: MEETING PARTICIPANTS' as test;
SELECT 
    mp.id,
    mp.meeting_id,
    mp.user_id,
    mp.status,
    m.title as meeting_title
FROM public.meeting_participants mp
LEFT JOIN public.meetings m ON mp.meeting_id = m.id
LIMIT 5;

-- Test 6: Check meeting types
SELECT 'TEST 6: MEETING TYPES' as test;
SELECT 
    id,
    name,
    slug,
    color,
    is_active
FROM public.meeting_types
ORDER BY name;

-- Test 7: Complex query (similar to what frontend might use)
SELECT 'TEST 7: COMPLEX MEETINGS QUERY' as test;
SELECT 
    m.id,
    m.title,
    m.description,
    m.start_time,
    m.end_time,
    m.timezone,
    m.location,
    m.status,
    m.is_public,
    mt.name as meeting_type,
    mt.color as type_color,
    up.email as organizer_email,
    up.first_name as organizer_first_name,
    up.last_name as organizer_last_name
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
LEFT JOIN public.user_profiles up ON m.organizer_id = up.id
WHERE m.start_time >= NOW()
ORDER BY m.start_time
LIMIT 5; 