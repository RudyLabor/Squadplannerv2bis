-- ============================================================================
-- SYSTÈME DE FIABILITÉ AUTOMATIQUE - Phase 1
-- Calcul automatique du score de fiabilité des joueurs
-- Version corrigée: utilise 'profiles' au lieu de 'users'
-- ============================================================================

-- Ajouter colonnes tracking si elles n'existent pas déjà
DO $$
BEGIN
  -- Colonnes pour le tracking de fiabilité
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'reliability_score') THEN
    ALTER TABLE profiles ADD COLUMN reliability_score FLOAT DEFAULT 100.0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'total_sessions') THEN
    ALTER TABLE profiles ADD COLUMN total_sessions INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'sessions_attended') THEN
    ALTER TABLE profiles ADD COLUMN sessions_attended INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'sessions_late') THEN
    ALTER TABLE profiles ADD COLUMN sessions_late INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'sessions_no_show') THEN
    ALTER TABLE profiles ADD COLUMN sessions_no_show INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'last_reliability_update') THEN
    ALTER TABLE profiles ADD COLUMN last_reliability_update TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- Ajouter display_name si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
    ALTER TABLE profiles ADD COLUMN display_name VARCHAR(100);
  END IF;

  -- Ajouter username si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE profiles ADD COLUMN username VARCHAR(50);
  END IF;

  -- Ajouter avatar_url si elle n'existe pas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Créer index pour performance (si pas déjà existants)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'reliability_score') THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_reliability ON profiles(reliability_score);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'sessions_attended') THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_sessions_attended ON profiles(sessions_attended);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_sessions') THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_total_sessions ON profiles(total_sessions);
  END IF;
END $$;

-- ============================================================================
-- FONCTION: Calculer le score de fiabilité d'un utilisateur
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_user_reliability(user_uuid UUID)
RETURNS FLOAT AS $$
DECLARE
  total INT;
  attended INT;
  late INT;
  no_show INT;
  calculated_score FLOAT;
BEGIN
  -- Récupérer les stats de l'utilisateur
  SELECT
    COALESCE(total_sessions, 0),
    COALESCE(sessions_attended, 0),
    COALESCE(sessions_late, 0),
    COALESCE(sessions_no_show, 0)
  INTO total, attended, late, no_show
  FROM profiles
  WHERE id = user_uuid;

  -- Si pas de sessions, score = 100%
  IF total = 0 OR total IS NULL THEN
    RETURN 100.0;
  END IF;

  -- Formule: (attended - (no_show * 2) - (late * 0.5)) / total * 100
  -- Les no-shows comptent double négativement
  -- Les retards comptent moitié négativement
  calculated_score := (
    (attended - (no_show * 2.0) - (late * 0.5))
    / NULLIF(total, 0)
  ) * 100.0;

  -- Limiter entre 0 et 100
  calculated_score := GREATEST(0.0, LEAST(100.0, calculated_score));

  RETURN ROUND(calculated_score, 1);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION: Mettre à jour les stats après check-in
-- ============================================================================
CREATE OR REPLACE FUNCTION update_user_stats_after_checkin()
RETURNS TRIGGER AS $$
BEGIN
  -- Si check-in confirmé ou "on_my_way"
  IF NEW.status IN ('confirmed', 'on_my_way') THEN
    UPDATE profiles
    SET
      sessions_attended = COALESCE(sessions_attended, 0) + 1,
      total_sessions = COALESCE(total_sessions, 0) + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;

  -- Si check-in "running_late"
  ELSIF NEW.status = 'running_late' THEN
    UPDATE profiles
    SET
      sessions_attended = COALESCE(sessions_attended, 0) + 1,
      sessions_late = COALESCE(sessions_late, 0) + 1,
      total_sessions = COALESCE(total_sessions, 0) + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;

  -- Si check-in "cancelled"
  ELSIF NEW.status = 'cancelled' THEN
    UPDATE profiles
    SET
      sessions_no_show = COALESCE(sessions_no_show, 0) + 1,
      total_sessions = COALESCE(total_sessions, 0) + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;
  END IF;

  -- Recalculer le score de fiabilité
  UPDATE profiles
  SET reliability_score = calculate_user_reliability(NEW.user_id)
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: Auto-update stats après check-in
-- ============================================================================
DROP TRIGGER IF EXISTS update_reliability_after_checkin ON session_check_ins;
CREATE TRIGGER update_reliability_after_checkin
  AFTER INSERT OR UPDATE OF status ON session_check_ins
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_after_checkin();

-- ============================================================================
-- FONCTION: Calculer fiabilité pour tous les users (maintenance)
-- ============================================================================
CREATE OR REPLACE FUNCTION recalculate_all_reliability()
RETURNS TABLE(user_id UUID, old_score FLOAT, new_score FLOAT) AS $$
BEGIN
  RETURN QUERY
  UPDATE profiles p
  SET reliability_score = calculate_user_reliability(p.id),
      last_reliability_update = NOW()
  RETURNING p.id, p.reliability_score AS old_score, calculate_user_reliability(p.id) AS new_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION: Obtenir statistiques détaillées utilisateur
-- ============================================================================
DROP FUNCTION IF EXISTS get_user_detailed_stats(UUID);
CREATE OR REPLACE FUNCTION get_user_detailed_stats(user_uuid UUID)
RETURNS TABLE(
  user_id UUID,
  display_name TEXT,
  score FLOAT,
  total INT,
  attended INT,
  late INT,
  no_show INT,
  attendance_rate FLOAT,
  late_rate FLOAT,
  no_show_rate FLOAT,
  last_updated TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    COALESCE(p.display_name, p.username, 'Joueur')::TEXT,
    p.reliability_score,
    p.total_sessions,
    p.sessions_attended,
    p.sessions_late,
    p.sessions_no_show,
    CASE
      WHEN p.total_sessions > 0
      THEN ROUND((p.sessions_attended::FLOAT / p.total_sessions) * 100, 1)
      ELSE 100.0
    END AS attendance_rate,
    CASE
      WHEN p.total_sessions > 0
      THEN ROUND((p.sessions_late::FLOAT / p.total_sessions) * 100, 1)
      ELSE 0.0
    END AS late_rate,
    CASE
      WHEN p.total_sessions > 0
      THEN ROUND((p.sessions_no_show::FLOAT / p.total_sessions) * 100, 1)
      ELSE 0.0
    END AS no_show_rate,
    p.last_reliability_update
  FROM profiles p
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEW: Leaderboard de fiabilité
-- ============================================================================
DROP VIEW IF EXISTS reliability_leaderboard;
CREATE VIEW reliability_leaderboard AS
SELECT
  p.id,
  COALESCE(p.display_name, p.username, 'Joueur') AS display_name,
  p.avatar_url,
  p.reliability_score,
  p.total_sessions,
  p.sessions_attended,
  CASE
    WHEN p.reliability_score >= 90 THEN 'gold'
    WHEN p.reliability_score >= 75 THEN 'silver'
    WHEN p.reliability_score >= 60 THEN 'bronze'
    ELSE 'gray'
  END AS tier,
  ROW_NUMBER() OVER (ORDER BY p.reliability_score DESC, p.total_sessions DESC) AS rank
FROM profiles p
WHERE COALESCE(p.total_sessions, 0) >= 3 -- Minimum 3 sessions pour apparaître
ORDER BY p.reliability_score DESC, p.total_sessions DESC;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Système de fiabilité créé avec succès';
  RAISE NOTICE '   - Colonnes: sessions_late, sessions_no_show';
  RAISE NOTICE '   - Fonction: calculate_user_reliability()';
  RAISE NOTICE '   - Trigger: Auto-update après check-in';
  RAISE NOTICE '   - View: reliability_leaderboard';
  RAISE NOTICE '   - Formule: (attended - no_show*2 - late*0.5) / total * 100';
END $$;
