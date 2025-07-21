-- =====================================================
-- SAFE FIX USER PROFILES TABLE STRUCTURE
-- Checks and adds missing columns, handles existing policies
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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company);
CREATE INDEX IF NOT EXISTS idx_user_profiles_industry ON public.user_profiles(industry);

-- Enable RLS if not already enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies only if they don't exist
DO $$
BEGIN
    -- Check if "Users can view own profile" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_profiles' 
        AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" ON public.user_profiles
            FOR SELECT USING (auth.uid() = id);
        RAISE NOTICE 'Created "Users can view own profile" policy';
    END IF;

    -- Check if "Users can update own profile" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_profiles' 
        AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile" ON public.user_profiles
            FOR UPDATE USING (auth.uid() = id);
        RAISE NOTICE 'Created "Users can update own profile" policy';
    END IF;

    -- Check if "Users can view public profiles" policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_profiles' 
        AND policyname = 'Users can view public profiles'
    ) THEN
        CREATE POLICY "Users can view public profiles" ON public.user_profiles
            FOR SELECT USING (true);
        RAISE NOTICE 'Created "Users can view public profiles" policy';
    END IF;

END $$;

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_schema = 'public' 
        AND trigger_name = 'update_user_profiles_updated_at'
    ) THEN
        CREATE TRIGGER update_user_profiles_updated_at 
            BEFORE UPDATE ON public.user_profiles 
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        RAISE NOTICE 'Created update_user_profiles_updated_at trigger';
    END IF;
END $$;

-- Show the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Show existing policies
SELECT policyname, cmd, permissive, roles, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles'; 