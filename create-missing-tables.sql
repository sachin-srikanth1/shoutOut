-- =====================================================
-- CREATE MISSING TABLES FOR RECOMMENDED PROFILES
-- Creates the tables needed for the recommended profiles functionality
-- =====================================================

-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'profile_categories', 'recommended_profiles', 'notification_types', 
  'user_notifications', 'meeting_types', 'meetings', 'meeting_participants',
  'project_statuses', 'projects', 'project_members', 'tasks', 'user_connections',
  'user_activities'
)
ORDER BY table_name;

-- =====================================================
-- CREATE PROFILE CATEGORIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profile_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE RECOMMENDED PROFILES TABLE
-- =====================================================

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

-- =====================================================
-- CREATE NOTIFICATION TYPES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notification_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    template TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE USER NOTIFICATIONS TABLE
-- =====================================================

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
-- CREATE MEETING TYPES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.meeting_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE MEETINGS TABLE
-- =====================================================

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

-- =====================================================
-- CREATE MEETING PARTICIPANTS TABLE
-- =====================================================

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
-- CREATE PROJECT STATUSES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.project_statuses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#6b7280',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE PROJECTS TABLE
-- =====================================================

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

-- =====================================================
-- CREATE PROJECT MEMBERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- =====================================================
-- CREATE TASKS TABLE
-- =====================================================

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
-- CREATE USER CONNECTIONS TABLE
-- =====================================================

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
-- CREATE USER ACTIVITIES TABLE
-- =====================================================

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
-- CREATE INDEXES
-- =====================================================

-- Recommended profiles indexes
CREATE INDEX IF NOT EXISTS idx_recommended_profiles_user_id ON public.recommended_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recommended_profiles_score ON public.recommended_profiles(score);
CREATE INDEX IF NOT EXISTS idx_recommended_profiles_is_viewed ON public.recommended_profiles(is_viewed);

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

-- User connections indexes
CREATE INDEX IF NOT EXISTS idx_user_connections_follower_id ON public.user_connections(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_following_id ON public.user_connections(following_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_status ON public.user_connections(status);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON public.user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at);

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

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

-- =====================================================
-- CREATE BASIC SAMPLE DATA
-- =====================================================

-- Insert basic profile categories
INSERT INTO public.profile_categories (name, slug, description, display_order) VALUES
('Technology', 'technology', 'Tech professionals and developers', 1),
('Business', 'business', 'Business leaders and entrepreneurs', 2),
('Design', 'design', 'Designers and creatives', 3),
('Marketing', 'marketing', 'Marketing professionals', 4),
('Finance', 'finance', 'Finance and investment professionals', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert basic notification types
INSERT INTO public.notification_types (name, slug, description, template) VALUES
('Connection Request', 'connection_request', 'Someone wants to connect with you', '{{sender}} wants to connect with you'),
('Meeting Invitation', 'meeting_invitation', 'You have been invited to a meeting', '{{sender}} invited you to {{meeting_title}}'),
('Task Assignment', 'task_assignment', 'You have been assigned a new task', 'You have been assigned: {{task_title}}'),
('Project Update', 'project_update', 'A project you are part of has been updated', '{{project_title}} has been updated'),
('Profile View', 'profile_view', 'Someone viewed your profile', '{{viewer}} viewed your profile')
ON CONFLICT (slug) DO NOTHING;

-- Insert basic meeting types
INSERT INTO public.meeting_types (name, slug, description, color) VALUES
('1-on-1', 'one_on_one', 'Individual meetings', '#6366f1'),
('Team Meeting', 'team_meeting', 'Team collaboration sessions', '#10b981'),
('Client Call', 'client_call', 'Client meetings and calls', '#f59e0b'),
('Interview', 'interview', 'Job interviews', '#ef4444'),
('Workshop', 'workshop', 'Training and workshops', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

-- Insert basic project statuses
INSERT INTO public.project_statuses (name, slug, color, display_order) VALUES
('Planning', 'planning', '#6b7280', 1),
('In Progress', 'in_progress', '#3b82f6', 2),
('Review', 'review', '#f59e0b', 3),
('Completed', 'completed', '#10b981', 4),
('On Hold', 'on_hold', '#ef4444', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Show all created tables
SELECT 'Created Tables:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'profile_categories', 'recommended_profiles', 'notification_types', 
  'user_notifications', 'meeting_types', 'meetings', 'meeting_participants',
  'project_statuses', 'projects', 'project_members', 'tasks', 'user_connections',
  'user_activities'
)
ORDER BY table_name; 