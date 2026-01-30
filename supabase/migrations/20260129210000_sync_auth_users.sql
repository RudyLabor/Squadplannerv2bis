-- ============================================
-- SYNC: Créer automatiquement un user dans public.users
-- quand quelqu'un s'inscrit via Supabase Auth
-- ============================================

-- Fonction qui crée un user dans public.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, auth_id, email, username, display_name, avatar_url)
  VALUES (
    NEW.id,  -- Utilise le même ID que auth.users
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================
-- FIX: Synchroniser les utilisateurs existants
-- D'abord mettre à jour les users existants par email
-- ============================================
UPDATE public.users pu
SET
  id = au.id,
  auth_id = au.id,
  updated_at = NOW()
FROM auth.users au
WHERE pu.email = au.email AND pu.id != au.id;

-- Ensuite insérer les nouveaux users de auth.users (avec username unique)
INSERT INTO public.users (id, auth_id, email, username, display_name)
SELECT
  au.id,
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)) || '_' || substr(au.id::text, 1, 4),
  COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1))
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id)
  AND NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.email = au.email);

-- ============================================
-- FIX: Modifier squads pour utiliser auth.uid() directement
-- comme owner_id (même UUID que auth.users.id)
-- ============================================

-- La foreign key doit pointer vers public.users.id qui est maintenant
-- synchronisé avec auth.users.id
