-- =====================================================
-- FIX USER PROFILES TABLE STRUCTURE
-- Checks and adds missing columns to user_profiles table
-- =====================================================

-- First, let's check what columns currently exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Check if company column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'company'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN company TEXT;
        RAISE NOTICE 'Added company column to user_profiles';
    END IF;

    -- Check if job_title column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'job_title'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN job_title TEXT;
        RAISE NOTICE 'Added job_title column to user_profiles';
    END IF;

    -- Check if industry column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'industry'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN industry TEXT;
        RAISE NOTICE 'Added industry column to user_profiles';
    END IF;

    -- Check if skills column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'skills'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN skills TEXT[];
        RAISE NOTICE 'Added skills column to user_profiles';
    END IF;

    -- Check if interests column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'interests'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN interests TEXT[];
        RAISE NOTICE 'Added interests column to user_profiles';
    END IF;

    -- Check if bio column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'bio'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio column to user_profiles';
    END IF;

    -- Check if location column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'location'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column to user_profiles';
    END IF;

    -- Check if timezone column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'timezone'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN timezone TEXT DEFAULT 'UTC';
        RAISE NOTICE 'Added timezone column to user_profiles';
    END IF;

    -- Check if avatar_url column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Added avatar_url column to user_profiles';
    END IF;

    -- Check if updated_at column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to user_profiles';
    END IF;

END $$;

-- Show the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position; 

-- Check if recommendations exist
SELECT COUNT(*) FROM public.recommended_profiles;

-- See the actual recommendations
SELECT * FROM public.recommended_profiles LIMIT 5; 