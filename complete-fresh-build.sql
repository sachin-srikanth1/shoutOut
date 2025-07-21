-- =====================================================
-- COMPLETE FRESH BUILD SCRIPT
-- Drops everything and recreates the entire database from scratch
-- =====================================================

-- =====================================================
-- STEP 1: DROP ALL EXISTING TABLES AND OBJECTS
-- =====================================================

-- Drop all tables in the correct order (respecting foreign keys)
DROP TABLE IF EXISTS public.user_activities CASCADE;
DROP TABLE IF EXISTS public.user_connections CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.project_members CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.project_statuses CASCADE;
DROP TABLE IF EXISTS public.meeting_participants CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;
DROP TABLE IF EXISTS public.meeting_types CASCADE;
DROP TABLE IF EXISTS public.user_notifications CASCADE;
DROP TABLE IF EXISTS public.notification_types CASCADE;
DROP TABLE IF EXISTS public.recommended_profiles CASCADE;
DROP TABLE IF EXISTS public.profile_categories CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- =====================================================
-- STEP 2: CREATE UTILITY FUNCTIONS
-- =====================================================

-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- STEP 3: CREATE ALL TABLES FROM SCRATCH
-- =====================================================

-- Create user_profiles table
CREATE TABLE public.user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    company TEXT,
    job_title TEXT,
    industry TEXT,
    skills TEXT[],
    interests TEXT[],
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profile_categories table
CREATE TABLE public.profile_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recommended_profiles table
CREATE TABLE public.recommended_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    recommended_user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.profile_categories(id) ON DELETE SET NULL,
    reason TEXT,
    score DECIMAL(3,2) DEFAULT 0.00,
    is_viewed BOOLEAN DEFAULT FALSE,
    is_contacted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, recommended_user_id)
);

-- Create notification_types table
CREATE TABLE public.notification_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    template TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_notifications table
CREATE TABLE public.user_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    type_id UUID REFERENCES public.notification_types(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_types table
CREATE TABLE public.meeting_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meetings table
CREATE TABLE public.meetings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organizer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    type_id UUID REFERENCES public.meeting_types(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    location TEXT,
    meeting_url TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    max_participants INTEGER,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_participants table
CREATE TABLE public.meeting_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'maybe')),
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meeting_id, user_id)
);

-- Create project_statuses table
CREATE TABLE public.project_statuses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#6b7280',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    status_id UUID REFERENCES public.project_statuses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    due_date DATE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_members table
CREATE TABLE public.project_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Create tasks table
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    assignee_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_connections table
CREATE TABLE public.user_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Create user_activities table
CREATE TABLE public.user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 4: CREATE INDEXES
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX idx_user_profiles_company ON public.user_profiles(company);
CREATE INDEX idx_user_profiles_industry ON public.user_profiles(industry);

-- Recommended profiles indexes
CREATE INDEX idx_recommended_profiles_user_id ON public.recommended_profiles(user_id);
CREATE INDEX idx_recommended_profiles_score ON public.recommended_profiles(score);
CREATE INDEX idx_recommended_profiles_is_viewed ON public.recommended_profiles(is_viewed);

-- Notifications indexes
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON public.user_notifications(is_read);
CREATE INDEX idx_user_notifications_created_at ON public.user_notifications(created_at);

-- Meetings indexes
CREATE INDEX idx_meetings_organizer_id ON public.meetings(organizer_id);
CREATE INDEX idx_meetings_start_time ON public.meetings(start_time);
CREATE INDEX idx_meetings_status ON public.meetings(status);

-- Meeting participants indexes
CREATE INDEX idx_meeting_participants_meeting_id ON public.meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_user_id ON public.meeting_participants(user_id);
CREATE INDEX idx_meeting_participants_status ON public.meeting_participants(status);

-- Projects indexes
CREATE INDEX idx_projects_creator_id ON public.projects(creator_id);
CREATE INDEX idx_projects_status_id ON public.projects(status_id);
CREATE INDEX idx_projects_due_date ON public.projects(due_date);

-- Tasks indexes
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

-- User connections indexes
CREATE INDEX idx_user_connections_follower_id ON public.user_connections(follower_id);
CREATE INDEX idx_user_connections_following_id ON public.user_connections(following_id);
CREATE INDEX idx_user_connections_status ON public.user_connections(status);

-- Activities indexes
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_activity_type ON public.user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);

-- =====================================================
-- STEP 5: CREATE TRIGGERS
-- =====================================================

-- Create trigger for user_profiles updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for meetings updated_at
CREATE TRIGGER update_meetings_updated_at 
    BEFORE UPDATE ON public.meetings 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON public.projects 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for tasks updated_at
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON public.tasks 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for user_connections updated_at
CREATE TRIGGER update_user_connections_updated_at 
    BEFORE UPDATE ON public.user_connections 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- STEP 6: ENABLE RLS AND CREATE POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommended_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view public profiles" ON public.user_profiles
    FOR SELECT USING (true);

-- Create RLS policies for profile_categories
CREATE POLICY "Anyone can view profile categories" ON public.profile_categories
    FOR SELECT USING (true);

-- Create RLS policies for recommended_profiles
CREATE POLICY "Users can view their recommendations" ON public.recommended_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for notification_types
CREATE POLICY "Anyone can view notification types" ON public.notification_types
    FOR SELECT USING (true);

-- Create RLS policies for user_notifications
CREATE POLICY "Users can view their notifications" ON public.user_notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.user_notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for meeting_types
CREATE POLICY "Anyone can view meeting types" ON public.meeting_types
    FOR SELECT USING (true);

-- Create RLS policies for meetings
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

-- Create RLS policies for meeting_participants
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

-- Create RLS policies for project_statuses
CREATE POLICY "Anyone can view project statuses" ON public.project_statuses
    FOR SELECT USING (true);

-- Create RLS policies for projects
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

-- Create RLS policies for project_members
CREATE POLICY "Users can view project members" ON public.project_members
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE creator_id = auth.uid()
        )
    );
CREATE POLICY "Project creators can manage members" ON public.project_members
    FOR ALL USING (
        project_id IN (
            SELECT id FROM public.projects WHERE creator_id = auth.uid()
        )
    );

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks they are assigned to" ON public.tasks
    FOR SELECT USING (assignee_id = auth.uid());
CREATE POLICY "Users can view tasks in their projects" ON public.tasks
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM public.projects WHERE creator_id = auth.uid()
        )
    );
CREATE POLICY "Users can create tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update tasks they created" ON public.tasks
    FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete tasks they created" ON public.tasks
    FOR DELETE USING (auth.uid() = creator_id);

-- Create RLS policies for user_connections
CREATE POLICY "Users can view their connections" ON public.user_connections
    FOR SELECT USING (follower_id = auth.uid() OR following_id = auth.uid());
CREATE POLICY "Users can create connections" ON public.user_connections
    FOR INSERT WITH CHECK (follower_id = auth.uid());
CREATE POLICY "Users can update their connections" ON public.user_connections
    FOR UPDATE USING (follower_id = auth.uid() OR following_id = auth.uid());

-- Create RLS policies for user_activities
CREATE POLICY "Users can view their own activities" ON public.user_activities
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own activities" ON public.user_activities
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- =====================================================
-- STEP 7: INSERT SAMPLE DATA
-- =====================================================

-- Insert basic profile categories
INSERT INTO public.profile_categories (name, slug, description, display_order) VALUES
('Technology', 'technology', 'Tech professionals and developers', 1),
('Business', 'business', 'Business leaders and entrepreneurs', 2),
('Design', 'design', 'Designers and creatives', 3),
('Marketing', 'marketing', 'Marketing professionals', 4),
('Finance', 'finance', 'Finance and investment professionals', 5);

-- Insert basic notification types
INSERT INTO public.notification_types (name, slug, description, template) VALUES
('Connection Request', 'connection_request', 'Someone wants to connect with you', '{{sender}} wants to connect with you'),
('Meeting Invitation', 'meeting_invitation', 'You have been invited to a meeting', '{{sender}} invited you to {{meeting_title}}'),
('Task Assignment', 'task_assignment', 'You have been assigned a new task', 'You have been assigned: {{task_title}}'),
('Project Update', 'project_update', 'A project you are part of has been updated', '{{project_title}} has been updated'),
('Profile View', 'profile_view', 'Someone viewed your profile', '{{viewer}} viewed your profile');

-- Insert basic meeting types
INSERT INTO public.meeting_types (name, slug, description, color) VALUES
('1-on-1', 'one_on_one', 'Individual meetings', '#6366f1'),
('Team Meeting', 'team_meeting', 'Team collaboration sessions', '#10b981'),
('Client Call', 'client_call', 'Client meetings and calls', '#f59e0b'),
('Interview', 'interview', 'Job interviews', '#ef4444'),
('Workshop', 'workshop', 'Training and workshops', '#8b5cf6');

-- Insert basic project statuses
INSERT INTO public.project_statuses (name, slug, color, display_order) VALUES
('Planning', 'planning', '#6b7280', 1),
('In Progress', 'in_progress', '#3b82f6', 2),
('Review', 'review', '#f59e0b', 3),
('Completed', 'completed', '#10b981', 4),
('On Hold', 'on_hold', '#ef4444', 5);

-- =====================================================
-- STEP 8: VERIFICATION
-- =====================================================

-- Show all created tables
SELECT 'CREATED TABLES:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles', 'profile_categories', 'recommended_profiles', 'notification_types', 
  'user_notifications', 'meeting_types', 'meetings', 'meeting_participants',
  'project_statuses', 'projects', 'project_members', 'tasks', 'user_connections',
  'user_activities'
)
ORDER BY table_name;

-- Show sample data counts
SELECT 'SAMPLE DATA COUNTS:' as status;
SELECT 'profile_categories' as table_name, COUNT(*) as count FROM public.profile_categories
UNION ALL
SELECT 'notification_types' as table_name, COUNT(*) as count FROM public.notification_types
UNION ALL
SELECT 'meeting_types' as table_name, COUNT(*) as count FROM public.meeting_types
UNION ALL
SELECT 'project_statuses' as table_name, COUNT(*) as count FROM public.project_statuses;

-- Show RLS policies
SELECT 'RLS POLICIES:' as status;
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename; 