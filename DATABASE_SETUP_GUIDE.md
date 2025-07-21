# Database Setup Guide

This guide will help you set up the functional database for the Netch app with all the necessary tables for recommended profiles, notifications, meetings, projects, and more.

## 📋 Prerequisites

- Supabase project set up
- Database access (SQL Editor or pgAdmin)
- Environment variables configured

## 🗄️ Database Schema Setup

### Step 1: Create the Functional Schema

1. Open your Supabase SQL Editor
2. Copy and paste the contents of `functional-schema.sql`
3. Execute the script

This will create:
- **User Profiles**: Extended user information
- **Recommended Profiles**: Profile recommendations system
- **Notifications**: User notification system
- **Meetings**: Meeting and event management
- **Projects & Tasks**: Project management system
- **User Connections**: Social networking features
- **User Activities**: Activity logging system

### Step 2: Insert Sample Data

1. Copy and paste the contents of `sample-data.sql`
2. Execute the script

This will populate your database with:
- Sample user profiles
- Recommended profiles
- Notifications
- Meetings and participants
- Projects and tasks
- User connections
- Activity logs

## 🔧 Frontend Integration

The frontend components have been updated to load data from the database:

### Updated Components

1. **Recommended Profiles** (`src/components/layout/recommended-profiles.tsx`)
   - Loads recommended profiles from database
   - Shows loading states and error handling
   - Displays profile information with match scores

2. **Notifications** (`src/components/layout/notifications-section.tsx`)
   - Loads user notifications from database
   - Shows unread indicators
   - Formats timestamps

3. **Upcoming Meetings** (`src/components/layout/upcoming-meetings.tsx`)
   - Loads upcoming meetings from database
   - Shows meeting details and locations
   - Formats meeting times

### Database Service

The `src/services/database-service.ts` file contains all database operations:

```typescript
// Example usage
const db = databaseService;

// Get user profile
const profile = await db.getUserProfile(userId);

// Get recommended profiles
const recommendations = await db.getRecommendedProfiles(userId);

// Get notifications
const notifications = await db.getNotifications(userId);

// Get upcoming meetings
const meetings = await db.getUpcomingMeetings(userId);
```

## 🧪 Testing the Setup

### API Testing

Use the test endpoint to verify your setup:

```bash
# Test all database operations
GET /api/test-functional-data?userId=YOUR_USER_ID

# Generate recommendations
POST /api/test-functional-data
{
  "action": "generate_recommendations",
  "userId": "YOUR_USER_ID"
}

# Create a notification
POST /api/test-functional-data
{
  "action": "create_notification",
  "userId": "YOUR_USER_ID",
  "data": {
    "typeId": "notification_type_id",
    "title": "Test Notification",
    "message": "This is a test notification"
  }
}
```

### Manual Database Queries

You can also test directly in the SQL Editor:

```sql
-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles', 'recommended_profiles', 'user_notifications',
  'meetings', 'projects', 'tasks', 'user_connections'
);

-- Check sample data
SELECT 'User Profiles' as table_name, COUNT(*) as count FROM public.user_profiles
UNION ALL
SELECT 'Recommended Profiles', COUNT(*) FROM public.recommended_profiles
UNION ALL
SELECT 'Notifications', COUNT(*) FROM public.user_notifications
UNION ALL
SELECT 'Meetings', COUNT(*) FROM public.meetings;
```

## 🔐 Row Level Security (RLS)

The schema includes RLS policies to ensure data security:

- Users can only view their own data
- Users can view public profiles
- Meeting participants can view meeting details
- Project members can view project data

## 📊 Database Structure

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `user_profiles` | Extended user information | Skills, interests, company, job title |
| `recommended_profiles` | Profile recommendations | Match scores, reasons, categories |
| `user_notifications` | User notifications | Read status, types, timestamps |
| `meetings` | Meeting management | Types, participants, scheduling |
| `projects` | Project management | Status, progress, members |
| `tasks` | Task management | Assignees, status, priorities |
| `user_connections` | Social networking | Follow/following relationships |

### Relationships

- `user_profiles` ← `recommended_profiles` (recommended users)
- `user_profiles` ← `user_notifications` (user notifications)
- `user_profiles` ← `meetings` (organizers & participants)
- `user_profiles` ← `projects` (creators & members)
- `user_profiles` ← `tasks` (assignees & creators)

## 🚀 Next Steps

1. **Customize the Data**: Modify the sample data to match your needs
2. **Add More Features**: Extend the schema for additional functionality
3. **Implement Real-time**: Add Supabase real-time subscriptions
4. **Add Analytics**: Create views for dashboard analytics
5. **Optimize Performance**: Add indexes for frequently queried columns

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policies**: Make sure RLS is enabled and policies are correct
2. **Foreign Keys**: Ensure all foreign key relationships are properly set up
3. **Data Types**: Check that data types match between frontend and database
4. **Permissions**: Verify that your Supabase role has necessary permissions

### Debug Queries

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

Your database is now ready to power the Netch app with full functionality for profiles, notifications, meetings, and project management! 🎉 