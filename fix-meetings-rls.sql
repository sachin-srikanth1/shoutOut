-- =====================================================
-- FIX MEETINGS RLS POLICIES
-- Creates proper RLS policies for meetings table
-- =====================================================

-- Enable RLS on meetings table if not already enabled
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can view meetings they are participants in" ON public.meetings;
DROP POLICY IF EXISTS "Users can view public meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can update their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can delete their own meetings" ON public.meetings;

-- Create RLS policies for meetings
CREATE POLICY "Users can view their own meetings" ON public.meetings
    FOR SELECT USING (auth.uid() = organizer_id);

CREATE POLICY "Users can view meetings they are participants in" ON public.meetings
    FOR SELECT USING (
        id IN (
            SELECT meeting_id 
            FROM public.meeting_participants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view public meetings" ON public.meetings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create meetings" ON public.meetings
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own meetings" ON public.meetings
    FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete their own meetings" ON public.meetings
    FOR DELETE USING (auth.uid() = organizer_id);

-- Enable RLS on meeting_participants table if not already enabled
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view meeting participants" ON public.meeting_participants;
DROP POLICY IF EXISTS "Users can manage meeting participants" ON public.meeting_participants;

-- Create RLS policies for meeting_participants
CREATE POLICY "Users can view meeting participants" ON public.meeting_participants
    FOR SELECT USING (
        user_id = auth.uid() OR 
        meeting_id IN (
            SELECT id FROM public.meetings WHERE organizer_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage meeting participants" ON public.meeting_participants
    FOR ALL USING (
        meeting_id IN (
            SELECT id FROM public.meetings WHERE organizer_id = auth.uid()
        )
    );

-- Enable RLS on meeting_types table if not already enabled
ALTER TABLE public.meeting_types ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view meeting types" ON public.meeting_types;

-- Create RLS policies for meeting_types
CREATE POLICY "Anyone can view meeting types" ON public.meeting_types
    FOR SELECT USING (true);

-- Test the meetings query
SELECT 'TESTING MEETINGS QUERY:' as status;

-- Test basic meetings query
SELECT 
    m.id,
    m.title,
    m.start_time,
    m.organizer_id,
    mt.name as meeting_type
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
LIMIT 5;

-- Test upcoming meetings query (similar to what the frontend does)
SELECT 
    m.id,
    m.title,
    m.start_time,
    m.end_time,
    m.organizer_id,
    mt.name as meeting_type
FROM public.meetings m
LEFT JOIN public.meeting_types mt ON m.type_id = mt.id
WHERE m.start_time >= NOW()
ORDER BY m.start_time
LIMIT 5;

-- Show existing policies
SELECT 'EXISTING POLICIES:' as status;
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive,
    roles,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('meetings', 'meeting_participants', 'meeting_types')
ORDER BY tablename, policyname; 