-- ============================================================================
-- FIX CRITICAL: Ajouter les colonnes manquantes à la table profiles
-- ============================================================================

-- Ajouter display_name (MANQUANT ET CRITIQUE)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Ajouter total_sessions et sessions_attended pour le système de fiabilité
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS sessions_attended INTEGER DEFAULT 0;

-- Mettre à jour display_name pour les profils existants qui n'en ont pas
UPDATE public.profiles
SET display_name = COALESCE(username, split_part(email, '@', 1))
WHERE display_name IS NULL;

-- Ajouter RLS policies si elles n'existent pas déjà
DO $$
BEGIN
  -- Policy: Tout le monde peut voir les profils
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Public profiles are viewable by everyone"
      ON public.profiles FOR SELECT
      USING (true);
  END IF;

  -- Policy: Les utilisateurs peuvent insérer leur propre profil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Policy: Les utilisateurs peuvent mettre à jour leur propre profil
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;

-- Activer RLS sur la table profiles si pas déjà fait
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Créer ou remplacer le trigger de création automatique de profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Message de succès
DO $$
BEGIN
  RAISE NOTICE '✅ Table profiles fixée avec succès';
  RAISE NOTICE '   - Colonne display_name ajoutée';
  RAISE NOTICE '   - Colonnes total_sessions et sessions_attended ajoutées';
  RAISE NOTICE '   - RLS policies créées';
  RAISE NOTICE '   - Trigger auto-création profil mis à jour';
END $$;
