# 🗄️ Database Setup Guide

This guide will help you set up the Supabase database for your Netch application.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project in your Supabase dashboard
3. **Environment Variables**: Get your project URL and anon key from the project settings

## 🚀 Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `netch-app` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

### 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. Set Environment Variables

Create or update your `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

### 5. Verify Setup

After running the schema, you should see:

✅ **Tables Created**:
- `user_profiles`
- `onboarding_sessions`
- `position_categories`
- `positions`
- `user_positions`
- `hobby_categories`
- `hobbies`
- `user_hobbies`
- `linkedin_profiles`
- `resume_files`
- `user_activity_logs`
- `onboarding_analytics`

✅ **Storage Bucket Created**:
- `resumes` (for storing resume files)

✅ **Initial Data Seeded**:
- Position categories (Engineering, Data & Analytics, etc.)
- Hobby categories (Sports & Fitness, Creative Arts, etc.)
- Popular positions (Software Engineer, Data Scientist, etc.)
- Popular hobbies (Running, Photography, etc.)

## 🔐 Row Level Security (RLS)

The schema includes comprehensive RLS policies that ensure:

- Users can only access their own data
- All tables have appropriate security policies
- Storage bucket is properly secured

## 📊 Database Structure

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `user_profiles` | Extended user information | Links to Supabase auth.users |
| `onboarding_sessions` | Tracks onboarding progress | Step tracking and completion |
| `positions` | Available job positions | Categorized by industry |
| `hobbies` | Available hobbies | Categorized by type |
| `linkedin_profiles` | LinkedIn profile data | URL validation |
| `resume_files` | Resume file metadata | Storage path tracking |

### Relationship Tables

| Table | Purpose | Relationships |
|-------|---------|---------------|
| `user_positions` | User ↔ Position | Many-to-many |
| `user_hobbies` | User ↔ Hobby | Many-to-many |

### Analytics Tables

| Table | Purpose | Data Tracked |
|-------|---------|--------------|
| `user_activity_logs` | User activity tracking | Page views, actions, etc. |
| `onboarding_analytics` | Onboarding metrics | Step completion, time spent |

## 🛠️ Development Workflow

### 1. Local Development

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. The app will automatically connect to your Supabase project using the environment variables.

### 2. Database Operations

All database operations are handled through the `DatabaseService` class in `src/services/database-service.ts`. This service provides:

- Type-safe database operations
- Error handling
- Activity logging
- File upload management

### 3. Testing Database Operations

You can test database operations by:

1. Creating a user account
2. Going through the onboarding process
3. Checking the database tables in Supabase dashboard

## 🔍 Monitoring & Analytics

### Viewing Data

1. **Supabase Dashboard**: Go to **Table Editor** to view all tables
2. **Activity Logs**: Check `user_activity_logs` for user actions
3. **Onboarding Analytics**: Check `onboarding_analytics` for step completion data

### Common Queries

```sql
-- Get all users who completed onboarding
SELECT * FROM user_profiles WHERE onboarding_completed = true;

-- Get popular positions
SELECT p.name, COUNT(up.user_id) as user_count 
FROM positions p 
LEFT JOIN user_positions up ON p.id = up.position_id 
GROUP BY p.id, p.name 
ORDER BY user_count DESC;

-- Get onboarding completion rate
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN onboarding_completed THEN 1 END) as completed_users,
  ROUND(COUNT(CASE WHEN onboarding_completed THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM user_profiles;
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure `.env.local` exists and has correct values
   - Restart your development server after changing env vars

2. **RLS Policy Errors**
   - Check that user is authenticated
   - Verify RLS policies are enabled on tables

3. **Storage Upload Failures**
   - Ensure storage bucket exists
   - Check storage policies are correct
   - Verify file size limits (5MB for resumes)

4. **Type Errors**
   - Run `npm run build` to check for TypeScript errors
   - Ensure database types match your schema

### Getting Help

1. Check Supabase logs in the dashboard
2. Review browser console for client-side errors
3. Check Next.js server logs for server-side errors
4. Verify all environment variables are set correctly

## 🔄 Database Migrations

When making schema changes:

1. Create a new SQL file with your changes
2. Test in a development environment first
3. Run migrations in production carefully
4. Update TypeScript types if needed

## 📈 Performance Optimization

The schema includes:

- **Indexes** on frequently queried columns
- **Efficient relationships** with proper foreign keys
- **RLS policies** for security without performance impact
- **Storage optimization** for file uploads

## 🔒 Security Considerations

- All tables have RLS enabled
- Users can only access their own data
- File uploads are restricted to authenticated users
- Input validation is handled at the application level
- Sensitive data is not stored in plain text

---

## ✅ Next Steps

After completing the database setup:

1. **Test the application** by creating a user account
2. **Go through onboarding** to verify all steps work
3. **Check data persistence** in the Supabase dashboard
4. **Monitor performance** and adjust as needed

Your database is now ready to support the Netch application! 🎉 