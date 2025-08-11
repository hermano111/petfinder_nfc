-- Fix User Profile Creation Issues
-- Ensures user profiles are properly created during registration

-- 1. Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
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
        INSERT INTO public.user_profiles (id, email, full_name)
        VALUES (
            NEW.id, 
            NEW.email, 
            COALESCE(
                NEW.raw_user_meta_data->>'full_name', 
                split_part(NEW.email, '@', 1)
            )
        );
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Profile already exists, that's fine
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error but don't prevent user creation
        RAISE WARNING 'Error creating user profile: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- 2. Recreate the trigger to ensure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 3. Create a function to manually create missing user profiles
CREATE OR REPLACE FUNCTION public.create_missing_user_profiles()
RETURNS TABLE(created_count integer, error_message text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    created_profiles integer := 0;
    user_record auth.users%ROWTYPE;
BEGIN
    -- Find auth users without profiles
    FOR user_record IN 
        SELECT * FROM auth.users au
        WHERE NOT EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = au.id
        )
    LOOP
        BEGIN
            INSERT INTO public.user_profiles (id, email, full_name)
            VALUES (
                user_record.id,
                user_record.email,
                COALESCE(
                    user_record.raw_user_meta_data->>'full_name',
                    split_part(user_record.email, '@', 1)
                )
            );
            created_profiles := created_profiles + 1;
        EXCEPTION
            WHEN OTHERS THEN
                -- Skip this user and continue
                CONTINUE;
        END;
    END LOOP;
    
    RETURN QUERY SELECT created_profiles, NULL::text;
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT 0, SQLERRM::text;
END;
$$;

-- 4. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_missing_user_profiles() TO authenticated;

-- 5. Run the function to create any missing profiles
SELECT * FROM public.create_missing_user_profiles();

-- 6. Add helpful comments
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profile when new auth user is created. Handles edge cases and prevents duplicate errors.';
COMMENT ON FUNCTION public.create_missing_user_profiles() IS 'Utility function to create user profiles for auth users that might be missing profiles. Can be run manually or in scripts.';

-- 7. Verify the setup
DO $$
DECLARE
    trigger_count integer;
    function_exists boolean;
BEGIN
    -- Check if trigger exists
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
    AND event_object_table = 'users'
    AND event_object_schema = 'auth';
    
    -- Check if function exists
    SELECT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
        AND p.proname = 'handle_new_user'
    ) INTO function_exists;
    
    IF trigger_count = 0 THEN
        RAISE WARNING 'Trigger on_auth_user_created not found!';
    ELSE
        RAISE NOTICE 'User profile creation trigger is active';
    END IF;
    
    IF NOT function_exists THEN
        RAISE WARNING 'Function handle_new_user not found!';
    ELSE
        RAISE NOTICE 'User profile creation function exists';
    END IF;
END $$;