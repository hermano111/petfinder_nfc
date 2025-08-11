-- Clean up mock data and fix registration flow
-- Remove sample users that were causing issues with new registrations

DO $$
DECLARE
    mock_user_ids UUID[];
BEGIN
    -- Get all mock/example user IDs
    SELECT ARRAY_AGG(id) INTO mock_user_ids
    FROM public.user_profiles
    WHERE email LIKE '%@example.com' 
    OR full_name IN ('María González', 'Carlos Martínez');
    
    -- Clean up in dependency order (children first)
    DELETE FROM public.pet_scans WHERE pet_id IN (
        SELECT id FROM public.pets WHERE owner_id = ANY(mock_user_ids)
    );
    
    DELETE FROM public.pet_photos WHERE pet_id IN (
        SELECT id FROM public.pets WHERE owner_id = ANY(mock_user_ids)
    );
    
    DELETE FROM public.pet_medical_records WHERE pet_id IN (
        SELECT id FROM public.pets WHERE owner_id = ANY(mock_user_ids)
    );
    
    DELETE FROM public.emergency_contacts WHERE pet_id IN (
        SELECT id FROM public.pets WHERE owner_id = ANY(mock_user_ids)
    );
    
    DELETE FROM public.nfc_tags WHERE pet_id IN (
        SELECT id FROM public.pets WHERE owner_id = ANY(mock_user_ids)
    );
    
    DELETE FROM public.notification_preferences WHERE user_id = ANY(mock_user_ids);
    
    DELETE FROM public.pets WHERE owner_id = ANY(mock_user_ids);
    
    DELETE FROM public.user_profiles WHERE id = ANY(mock_user_ids);
    
    -- Clean up auth.users for mock data (if they exist)
    DELETE FROM auth.users WHERE id = ANY(mock_user_ids);
    
    RAISE NOTICE 'Cleaned up % mock user records', array_length(mock_user_ids, 1);
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during cleanup: %', SQLERRM;
END $$;

-- Improve the user profile creation function to ensure proper empty profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    profile_exists BOOLEAN := FALSE;
BEGIN
    -- Check if profile already exists
    SELECT EXISTS(
        SELECT 1 FROM public.user_profiles WHERE id = NEW.id
    ) INTO profile_exists;
    
    -- Only insert if profile doesn't exist
    IF NOT profile_exists THEN
        INSERT INTO public.user_profiles (
            id, 
            email, 
            full_name,
            address,
            phone_number,
            whatsapp_number,
            is_active
        )
        VALUES (
            NEW.id, 
            NEW.email, 
            COALESCE(
                NEW.raw_user_meta_data->>'full_name', 
                split_part(NEW.email, '@', 1)
            ),
            NULL, -- Empty address for new users
            NULL, -- Empty phone for new users
            NULL, -- Empty WhatsApp for new users
            true  -- Active by default
        );
        
        RAISE NOTICE 'Created empty user profile for new user: %', NEW.email;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Profile already exists, that's fine
        RAISE NOTICE 'User profile already exists for: %', NEW.email;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error but don't prevent user creation
        RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$;

-- Create function to validate new user registration completed
CREATE OR REPLACE FUNCTION public.is_new_user_profile(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = user_uuid 
    AND up.address IS NULL 
    AND up.phone_number IS NULL
    AND up.created_at > (CURRENT_TIMESTAMP - INTERVAL '1 hour')
)
$$;

-- Add index for better performance on new user checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON public.user_profiles(is_active);

-- Ensure RLS is enabled and working correctly
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policy to ensure users can only see their own profiles
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;

CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates empty user profile when new user registers via Supabase Auth';
COMMENT ON FUNCTION public.is_new_user_profile(UUID) IS 'Checks if user profile is newly created and empty';