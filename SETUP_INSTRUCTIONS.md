# Database Setup Instructions

## 🧹 Clean Database Setup

Follow these steps to set up a clean database for your Netch app:

### Step 1: Remove All Existing Tables
1. Open your Supabase SQL Editor
2. Copy and paste the contents of `clean-remove-all.sql`
3. Execute the script to remove all existing tables and data

### Step 2: Create Fresh Schema
1. Copy and paste the contents of `fresh-schema.sql`
2. Execute the script to create all new tables with proper structure

### Step 3: Add Sample Data
1. Copy and paste the contents of `fresh-sample-data.sql`
2. Execute the script to populate with sample data

## 📁 Files Overview

- **`clean-remove-all.sql`** - Removes all tables, functions, triggers, and policies
- **`fresh-schema.sql`** - Creates clean schema with all functional tables
- **`fresh-sample-data.sql`** - Populates database with sample data
- **`DATABASE_SETUP_GUIDE.md`** - Detailed documentation

## 🧪 Testing

After setup, test your database:

```bash
# Test environment variables
GET /api/test-env

# Test all database operations (replace YOUR_USER_ID with actual user ID)
GET /api/test-functional-data?userId=YOUR_USER_ID
```

## 🔧 Frontend Integration

The frontend components are already updated to work with the new database:

- ✅ Recommended Profiles component
- ✅ Notifications component  
- ✅ Upcoming Meetings component
- ✅ Database service with all operations

## 🚀 Ready to Go!

Your database is now clean and ready to power the Netch app with:
- User profiles and recommendations
- Notifications system
- Meeting management
- Project and task management
- User connections
- Activity logging

No more onboarding references - just clean, functional data! 🎉 