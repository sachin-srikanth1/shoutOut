-- =====================================================
-- CHECK MISSING TABLES (SIMPLE VERSION)
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

-- Check if specific tables exist
SELECT 'TABLE STATUS:' as status;
SELECT 
  'user_profiles' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'profile_categories' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profile_categories') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'recommended_profiles' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'recommended_profiles') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'notification_types' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notification_types') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'user_notifications' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_notifications') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'meeting_types' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meeting_types') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'meetings' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meetings') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'meeting_participants' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meeting_participants') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'project_statuses' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_statuses') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'projects' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'project_members' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_members') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'tasks' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'user_connections' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_connections') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 
  'user_activities' as table_name,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activities') THEN 'EXISTS' ELSE 'MISSING' END as status
ORDER BY table_name;

-- Count summary
SELECT 'SUMMARY:' as status;
SELECT 
  COUNT(*) as total_required_tables,
  SUM(CASE WHEN status = 'EXISTS' THEN 1 ELSE 0 END) as existing_tables,
  SUM(CASE WHEN status = 'MISSING' THEN 1 ELSE 0 END) as missing_tables
FROM (
  SELECT 
    'user_profiles' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'profile_categories' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profile_categories') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'recommended_profiles' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'recommended_profiles') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'notification_types' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notification_types') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'user_notifications' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_notifications') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'meeting_types' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meeting_types') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'meetings' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meetings') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'meeting_participants' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meeting_participants') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'project_statuses' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_statuses') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'projects' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'project_members' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_members') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'tasks' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'user_connections' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_connections') THEN 'EXISTS' ELSE 'MISSING' END as status
  UNION ALL
  SELECT 
    'user_activities' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activities') THEN 'EXISTS' ELSE 'MISSING' END as status
) as table_status; 