-- =====================================================
-- CHECK MISSING TABLES
-- Shows what tables exist and what's missing
-- =====================================================

-- Check what tables currently exist
SELECT 'EXISTING TABLES:' as status;
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

-- Check what tables are missing
SELECT 'MISSING TABLES:' as status;
SELECT unnest(ARRAY[
  'profile_categories', 'recommended_profiles', 'notification_types', 
  'user_notifications', 'meeting_types', 'meetings', 'meeting_participants',
  'project_statuses', 'projects', 'project_members', 'tasks', 'user_connections',
  'user_activities'
]) as missing_table
WHERE unnest(ARRAY[
  'profile_categories', 'recommended_profiles', 'notification_types', 
  'user_notifications', 'meeting_types', 'meetings', 'meeting_participants',
  'project_statuses', 'projects', 'project_members', 'tasks', 'user_connections',
  'user_activities'
]) NOT IN (
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public'
)
ORDER BY missing_table;

-- Check if meetings table specifically exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'meetings'
    ) 
    THEN 'meetings table EXISTS' 
    ELSE 'meetings table MISSING' 
  END as meetings_status;

-- Check if recommended_profiles table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'recommended_profiles'
    ) 
    THEN 'recommended_profiles table EXISTS' 
    ELSE 'recommended_profiles table MISSING' 
  END as recommended_profiles_status;

-- Show total count of required tables vs existing
SELECT 
  'TABLE COUNT SUMMARY:' as status,
  COUNT(*) as total_required_tables,
  (
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'profile_categories', 'recommended_profiles', 'notification_types', 
      'user_notifications', 'meeting_types', 'meetings', 'meeting_participants',
      'project_statuses', 'projects', 'project_members', 'tasks', 'user_connections',
      'user_activities'
    )
  ) as existing_tables,
  COUNT(*) - (
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'profile_categories', 'recommended_profiles', 'notification_types', 
      'user_notifications', 'meeting_types', 'meetings', 'meeting_participants',
      'project_statuses', 'projects', 'project_members', 'tasks', 'user_connections',
      'user_activities'
    )
  ) as missing_tables
FROM (SELECT unnest(ARRAY[
  'profile_categories', 'recommended_profiles', 'notification_types', 
  'user_notifications', 'meeting_types', 'meetings', 'meeting_participants',
  'project_statuses', 'projects', 'project_members', 'tasks', 'user_connections',
  'user_activities'
]) as table_name) as required_tables; 