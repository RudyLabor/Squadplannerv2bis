-- ============================================================================
-- SYSTÈME DE FIABILITÉ AUTOMATIQUE - Phase 1
-- Calcul automatique du score de fiabilité des joueurs
-- ============================================================================

-- Ajouter colonnes tracking si elles n'existent pas déjà
ALTER TABLE users
ADD COLUMN IF NOT EXISTS sessions_late INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sessions_no_show INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reliability_update TIMESTAMPTZ DEFAULT NOW();

-- Créer index pour performance
CREATE INDEX IF NOT EXISTS idx_users_reliability ON users(reliability_score);
CREATE INDEX IF NOT EXISTS idx_users_sessions_attended ON users(sessions_attended);
CREATE INDEX IF NOT EXISTS idx_users_total_sessions ON users(total_sessions);

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
  reliability_score FLOAT;
BEGIN
  -- Récupérer les stats de l'utilisateur
  SELECT
    total_sessions,
    sessions_attended,
    sessions_late,
    sessions_no_show
  INTO total, attended, late, no_show
  FROM users
  WHERE id = user_uuid;

  -- Si pas de sessions, score = 100%
  IF total = 0 OR total IS NULL THEN
    RETURN 100.0;
  END IF;

  -- Formule: (attended - (no_show * 2) - (late * 0.5)) / total * 100
  -- Les no-shows comptent double négativement
  -- Les retards comptent moitié négativement
  reliability_score := (
    (attended - (no_show * 2.0) - (late * 0.5))
    / NULLIF(total, 0)
  ) * 100.0;

  -- Limiter entre 0 et 100
  reliability_score := GREATEST(0.0, LEAST(100.0, reliability_score));

  RETURN ROUND(reliability_score, 1);
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
    UPDATE users
    SET
      sessions_attended = sessions_attended + 1,
      total_sessions = total_sessions + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;

  -- Si check-in "running_late"
  ELSIF NEW.status = 'running_late' THEN
    UPDATE users
    SET
      sessions_attended = sessions_attended + 1,
      sessions_late = sessions_late + 1,
      total_sessions = total_sessions + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;

  -- Si check-in "cancelled"
  ELSIF NEW.status = 'cancelled' THEN
    UPDATE users
    SET
      sessions_no_show = sessions_no_show + 1,
      total_sessions = total_sessions + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;
  END IF;

  -- Recalculer le score de fiabilité
  UPDATE users
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
  UPDATE users u
  SET reliability_score = calculate_user_reliability(u.id),
      last_reliability_update = NOW()
  RETURNING u.id, u.reliability_score AS old_score, calculate_user_reliability(u.id) AS new_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION: Obtenir statistiques détaillées utilisateur
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_detailed_stats(user_uuid UUID)
RETURNS TABLE(
  user_id UUID,
  display_name TEXT,
  reliability_score FLOAT,
  total_sessions INT,
  sessions_attended INT,
  sessions_late INT,
  sessions_no_show INT,
  attendance_rate FLOAT,
  late_rate FLOAT,
  no_show_rate FLOAT,
  last_updated TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.display_name,
    u.reliability_score,
    u.total_sessions,
    u.sessions_attended,
    u.sessions_late,
    u.sessions_no_show,
    CASE
      WHEN u.total_sessions > 0
      THEN ROUND((u.sessions_attended::FLOAT / u.total_sessions) * 100, 1)
      ELSE 100.0
    END AS attendance_rate,
    CASE
      WHEN u.total_sessions > 0
      THEN ROUND((u.sessions_late::FLOAT / u.total_sessions) * 100, 1)
      ELSE 0.0
    END AS late_rate,
    CASE
      WHEN u.total_sessions > 0
      THEN ROUND((u.sessions_no_show::FLOAT / u.total_sessions) * 100, 1)
      ELSE 0.0
    END AS no_show_rate,
    u.last_reliability_update
  FROM users u
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEW: Leaderboard de fiabilité
-- ============================================================================
CREATE OR REPLACE VIEW reliability_leaderboard AS
SELECT
  u.id,
  u.display_name,
  u.avatar_url,
  u.reliability_score,
  u.total_sessions,
  u.sessions_attended,
  CASE
    WHEN u.reliability_score >= 90 THEN 'gold'
    WHEN u.reliability_score >= 75 THEN 'silver'
    WHEN u.reliability_score >= 60 THEN 'bronze'
    ELSE 'gray'
  END AS tier,
  ROW_NUMBER() OVER (ORDER BY u.reliability_score DESC, u.total_sessions DESC) AS rank
FROM users u
WHERE u.total_sessions >= 3 -- Minimum 3 sessions pour apparaître
ORDER BY u.reliability_score DESC, u.total_sessions DESC;

-- ============================================================================
-- RLS POLICY pour VIEW
-- ============================================================================
-- Enable RLS sur view (pour les requêtes)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut voir le leaderboard
CREATE POLICY "Public reliability leaderboard"
  ON users FOR SELECT
  USING (true);

-- ============================================================================
-- TESTS & VALIDATION
-- ============================================================================

-- Test 1: Calculer fiabilité user de test
DO $$
DECLARE
  test_score FLOAT;
BEGIN
  -- Simuler un user avec stats
  UPDATE users
  SET
    total_sessions = 10,
    sessions_attended = 8,
    sessions_late = 1,
    sessions_no_show = 1
  WHERE id IN (SELECT id FROM users LIMIT 1);

  -- Calculer
  SELECT calculate_user_reliability(id) INTO test_score
  FROM users LIMIT 1;

  RAISE NOTICE 'Test reliability score: %', test_score;
  -- Attendu: (8 - (1*2) - (1*0.5)) / 10 * 100 = 55%
END $$;

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
