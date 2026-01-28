-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text default '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text default '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birthday text default '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_game text default '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS play_style text default '';
