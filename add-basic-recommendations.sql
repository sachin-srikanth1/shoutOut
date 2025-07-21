-- =====================================================
-- ADD BASIC RECOMMENDED PROFILES DATA
-- Creates some basic recommended profiles for testing
-- =====================================================

-- First, let's see what user profiles exist
SELECT id, email, first_name, last_name 
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Get the profile categories
SELECT id, name, slug 
FROM public.profile_categories 
ORDER BY display_order;

-- Add some basic recommended profiles
-- This will create recommendations for the first user to other users
DO $$
DECLARE
    current_user_id UUID;
    other_user_ids UUID[];
    category_ids UUID[];
    i INTEGER;
    j INTEGER;
BEGIN
    -- Get the current user (first user in the system)
    SELECT id INTO current_user_id 
    FROM public.user_profiles 
    ORDER BY created_at 
    LIMIT 1;
    
    -- Get other users (excluding the current user)
    SELECT ARRAY_AGG(id) INTO other_user_ids 
    FROM public.user_profiles 
    WHERE id != current_user_id;
    
    -- Get category IDs
    SELECT ARRAY_AGG(id) INTO category_ids 
    FROM public.profile_categories;
    
    -- If we have other users and categories, create recommendations
    IF array_length(other_user_ids, 1) > 0 AND array_length(category_ids, 1) > 0 THEN
        FOR i IN 1..LEAST(array_length(other_user_ids, 1), 5) LOOP
            -- Create recommendation with random category and score
            INSERT INTO public.recommended_profiles (
                user_id, 
                recommended_user_id, 
                category_id, 
                reason, 
                score,
                is_viewed,
                is_contacted
            ) VALUES (
                current_user_id,
                other_user_ids[i],
                category_ids[1 + (i % array_length(category_ids, 1))],
                CASE (i % 4)
                    WHEN 0 THEN 'Similar industry background'
                    WHEN 1 THEN 'Shared skills and interests'
                    WHEN 2 THEN 'Mutual connections'
                    WHEN 3 THEN 'Complementary expertise'
                END,
                (0.7 + (random() * 0.3))::DECIMAL(3,2),
                FALSE,
                FALSE
            ) ON CONFLICT (user_id, recommended_user_id) DO NOTHING;
        END LOOP;
        
        RAISE NOTICE 'Created % recommendations for user %', 
            LEAST(array_length(other_user_ids, 1), 5), 
            current_user_id;
    ELSE
        RAISE NOTICE 'No other users or categories found to create recommendations';
    END IF;
END $$;

-- Show the created recommendations
SELECT 
    rp.id,
    rp.user_id,
    rp.recommended_user_id,
    pc.name as category_name,
    rp.reason,
    rp.score,
    rp.is_viewed,
    rp.is_contacted,
    up.email as recommended_user_email,
    up.first_name,
    up.last_name
FROM public.recommended_profiles rp
LEFT JOIN public.profile_categories pc ON rp.category_id = pc.id
LEFT JOIN public.user_profiles up ON rp.recommended_user_id = up.id
ORDER BY rp.score DESC;

-- Count recommendations per user
SELECT 
    up.email,
    COUNT(rp.id) as recommendation_count
FROM public.user_profiles up
LEFT JOIN public.recommended_profiles rp ON up.id = rp.user_id
GROUP BY up.id, up.email
ORDER BY recommendation_count DESC; 