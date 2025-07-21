-- =====================================================
-- FRESH NETCH DATABASE SCHEMA
-- Clean schema without any onboarding references
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE USER TABLES
-- =====================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROFILES & CONNECTIONS
-- =====================================================

-- Profile categories for recommendations
CREATE TABLE IF NOT EXISTS public.profile_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommended profiles
CREATE TABLE IF NOT EXISTS public.recommended_profiles (
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

-- User connections/follows
CREATE TABLE IF NOT EXISTS public.user_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Notification types
CREATE TABLE IF NOT EXISTS public.notification_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    template TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notifications
CREATE TABLE IF NOT EXISTS public.user_notifications (
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

-- =====================================================
-- MEETINGS & EVENTS
-- =====================================================

-- Meeting types
CREATE TABLE IF NOT EXISTS public.meeting_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings/Events
CREATE TABLE IF NOT EXISTS public.meetings (
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

-- Meeting participants
CREATE TABLE IF NOT EXISTS public.meeting_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'maybe')),
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meeting_id, user_id)
);

-- =====================================================
-- PROJECTS & TASKS
-- =====================================================

-- Project statuses
CREATE TABLE IF NOT EXISTS public.project_statuses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#6b7280',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
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

-- Project members
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
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

-- =====================================================
-- ACTIVITIES & ANALYTICS
-- =====================================================

-- User activities
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company);
CREATE INDEX IF NOT EXISTS idx_user_profiles_industry ON public.user_profiles(industry);

-- Recommended profiles indexes
CREATE INDEX IF NOT EXISTS idx_recommended_profiles_user_id ON public.recommended_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recommended_profiles_score ON public.recommended_profiles(score);
CREATE INDEX IF NOT EXISTS idx_recommended_profiles_is_viewed ON public.recommended_profiles(is_viewed);

-- User connections indexes
CREATE INDEX IF NOT EXISTS idx_user_connections_follower_id ON public.user_connections(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_following_id ON public.user_connections(following_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_status ON public.user_connections(status);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON public.user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON public.user_notifications(created_at);

-- Meetings indexes
CREATE INDEX IF NOT EXISTS idx_meetings_organizer_id ON public.meetings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON public.meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);

-- Meeting participants indexes
CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting_id ON public.meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_user_id ON public.meeting_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_status ON public.meeting_participants(status);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON public.projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status_id ON public.projects(status_id);
CREATE INDEX IF NOT EXISTS idx_projects_due_date ON public.projects(due_date);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON public.user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommended_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" ON public.user_profiles
    FOR SELECT USING (true);

-- Recommended profiles policies
CREATE POLICY "Users can view own recommendations" ON public.recommended_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations" ON public.recommended_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- User connections policies
CREATE POLICY "Users can view own connections" ON public.user_connections
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can manage own connections" ON public.user_connections
    FOR ALL USING (auth.uid() = follower_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.user_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.user_notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Meetings policies
CREATE POLICY "Users can view meetings they're part of" ON public.meetings
    FOR SELECT USING (
        auth.uid() = organizer_id OR 
        EXISTS (
            SELECT 1 FROM public.meeting_participants 
            WHERE meeting_id = meetings.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own meetings" ON public.meetings
    FOR ALL USING (auth.uid() = organizer_id);

-- Meeting participants policies
CREATE POLICY "Users can view meeting participants" ON public.meeting_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.meetings 
            WHERE id = meeting_participants.meeting_id 
            AND (organizer_id = auth.uid() OR id IN (
                SELECT meeting_id FROM public.meeting_participants WHERE user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Users can manage own meeting participation" ON public.meeting_participants
    FOR ALL USING (user_id = auth.uid());

-- Projects policies
CREATE POLICY "Users can view projects they're part of" ON public.projects
    FOR SELECT USING (
        creator_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = projects.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own projects" ON public.projects
    FOR ALL USING (creator_id = auth.uid());

-- Tasks policies
CREATE POLICY "Users can view tasks in their projects" ON public.tasks
    FOR SELECT USING (
        creator_id = auth.uid() OR assignee_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = tasks.project_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own tasks" ON public.tasks
    FOR ALL USING (creator_id = auth.uid() OR assignee_id = auth.uid());

-- Activities policies
CREATE POLICY "Users can view own activities" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_connections_updated_at 
    BEFORE UPDATE ON public.user_connections 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at 
    BEFORE UPDATE ON public.meetings 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON public.projects 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON public.tasks 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, first_name, last_name, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample profile categories
INSERT INTO public.profile_categories (name, slug, description, display_order) VALUES
('Technology', 'technology', 'Tech professionals and developers', 1),
('Business', 'business', 'Business leaders and entrepreneurs', 2),
('Design', 'design', 'Designers and creatives', 3),
('Marketing', 'marketing', 'Marketing professionals', 4),
('Finance', 'finance', 'Finance and investment professionals', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample notification types
INSERT INTO public.notification_types (name, slug, description, template) VALUES
('Connection Request', 'connection_request', 'Someone wants to connect with you', '{{sender}} wants to connect with you'),
('Meeting Invitation', 'meeting_invitation', 'You have been invited to a meeting', '{{sender}} invited you to {{meeting_title}}'),
('Task Assignment', 'task_assignment', 'You have been assigned a new task', 'You have been assigned: {{task_title}}'),
('Project Update', 'project_update', 'A project you are part of has been updated', '{{project_title}} has been updated'),
('Profile View', 'profile_view', 'Someone viewed your profile', '{{viewer}} viewed your profile')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample meeting types
INSERT INTO public.meeting_types (name, slug, description, color) VALUES
('1-on-1', 'one_on_one', 'Individual meetings', '#6366f1'),
('Team Meeting', 'team_meeting', 'Team collaboration sessions', '#10b981'),
('Client Call', 'client_call', 'Client meetings and calls', '#f59e0b'),
('Interview', 'interview', 'Job interviews', '#ef4444'),
('Workshop', 'workshop', 'Training and workshops', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample project statuses
INSERT INTO public.project_statuses (name, slug, color, display_order) VALUES
('Planning', 'planning', '#6b7280', 1),
('In Progress', 'in_progress', '#3b82f6', 2),
('Review', 'review', '#f59e0b', 3),
('Completed', 'completed', '#10b981', 4),
('On Hold', 'on_hold', '#ef4444', 5)
ON CONFLICT (slug) DO NOTHING; 