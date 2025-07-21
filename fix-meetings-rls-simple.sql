-- =====================================================
-- FIX MEETINGS RLS POLICIES (SIMPLE VERSION)
-- Creates simple RLS policies without circular references
-- =====================================================

-- Disable RLS temporarily to clear any problematic policies
ALTER TABLE public.meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_types DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can view meetings they are participants in" ON public.meetings;
DROP POLICY IF EXISTS "Users can view public meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can update their own meetings" ON public.meetings;
DROP POLICY IF EXISTS "Users can delete their own meetings" ON public.meetings;

DROP POLICY IF EXISTS "Users can view meeting participants" ON public.meeting_participants;
DROP POLICY IF EXISTS "Users can manage meeting participants" ON public.meeting_participants;

DROP POLICY IF EXISTS "Anyone can view meeting types" ON public.meeting_types;

-- Re-enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_types ENABLE ROW LEVEL SECURITY;

-- Create simple, non-circular policies for meetings
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

-- Create simple policies for meeting_participants (no circular references)
CREATE POLICY "Users can view their own participant records" ON public.meeting_participants
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Meeting organizers can view participants" ON public.meeting_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.meetings 
            WHERE id = meeting_participants.meeting_id 
            AND organizer_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own participant records" ON public.meeting_participants
    FOR ALL USING (user_id = auth.uid());

-- Create simple policy for meeting_types
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