-- FIX: Add missing columns to profiles table manually (Dynamic SQL Version)
-- This script uses EXECUTE to avoid "column does not exist" errors during parsing.

BEGIN;

-- 1. Ensure 'profiles' table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY
);

-- 2. Add columns individually (Idempotent)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birthday DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_game TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS play_style TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reliability_score INTEGER DEFAULT 100;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sessions_attended INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Migrate data from 'users' table using DYNAMIC SQL to avoid parse errors
DO $$
DECLARE
    column_exists boolean;
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        
        -- Check if display_name exists in source table 'users'
        SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='display_name') INTO column_exists;
        
        IF column_exists THEN
            EXECUTE '
                INSERT INTO public.profiles (id, username, display_name, email, avatar_url, reliability_score)
                SELECT id, username, display_name, email, avatar_url, reliability_score
                FROM public.users
                ON CONFLICT (id) DO UPDATE SET
                    username = EXCLUDED.username,
                    display_name = EXCLUDED.display_name,
                    email = EXCLUDED.email;
            ';
        ELSE
            EXECUTE '
                INSERT INTO public.profiles (id, username, display_name, email, avatar_url, reliability_score)
                SELECT id, username, username, email, avatar_url, reliability_score
                FROM public.users
                ON CONFLICT (id) DO UPDATE SET
                    username = EXCLUDED.username,
                    display_name = EXCLUDED.username,
                    email = EXCLUDED.email;
            ';
        END IF;
    END IF;
END $$;

-- 4. Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Re-apply Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 6. Update Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, display_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

COMMIT;
