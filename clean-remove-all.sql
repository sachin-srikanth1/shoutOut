-- =====================================================
-- COMPLETE DATABASE CLEANUP SCRIPT
-- Removes all tables, functions, triggers, and policies
-- =====================================================

-- Drop all triggers first
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_user_connections_updated_at ON public.user_connections;
DROP TRIGGER IF EXISTS update_meetings_updated_at ON public.meetings;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop all functions
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop all tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS public.user_activities CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.project_members CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.project_statuses CASCADE;
DROP TABLE IF EXISTS public.meeting_participants CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;
DROP TABLE IF EXISTS public.meeting_types CASCADE;
DROP TABLE IF EXISTS public.user_notifications CASCADE;
DROP TABLE IF EXISTS public.notification_types CASCADE;
DROP TABLE IF EXISTS public.user_connections CASCADE;
DROP TABLE IF EXISTS public.recommended_profiles CASCADE;
DROP TABLE IF EXISTS public.profile_categories CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop any remaining indexes (they should be dropped with tables, but just in case)
-- Note: Indexes are automatically dropped when their tables are dropped

-- Remove any remaining policies (they should be dropped with tables, but just in case)
-- Note: RLS policies are automatically dropped when their tables are dropped

-- Clean up any orphaned sequences or other objects
-- Note: Sequences are automatically dropped when their tables are dropped

-- Verify cleanup
SELECT 'Tables remaining:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles', 'profile_categories', 'recommended_profiles', 
  'user_connections', 'notification_types', 'user_notifications',
  'meeting_types', 'meetings', 'meeting_participants',
  'project_statuses', 'projects', 'project_members', 'tasks',
  'user_activities'
);

SELECT 'Functions remaining:' as status;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'update_updated_at_column', 'handle_new_user'
);

SELECT 'Triggers remaining:' as status;
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name IN (
  'update_user_profiles_updated_at', 'update_user_connections_updated_at',
  'update_meetings_updated_at', 'update_projects_updated_at',
  'update_tasks_updated_at', 'on_auth_user_created'
); 