-- ============================================================================
-- CHECK-IN OBLIGATOIRE - Squad Planner v2.0
-- Feature signature: Confirmation 1h avant session + "Je suis en route"
-- ============================================================================

-- Table session_check_ins
CREATE TABLE IF NOT EXISTS session_check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Statuts check-in
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'on_my_way', 'running_late', 'cancelled')),

  -- Notes optionnelles
  notes TEXT,

  -- Timestamps
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(session_id, user_id),

  -- Index pour performance
  CONSTRAINT session_check_ins_session_id_idx FOREIGN KEY (session_id) REFERENCES sessions(id),
  CONSTRAINT session_check_ins_user_id_idx FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index pour requêtes rapides
CREATE INDEX IF NOT EXISTS idx_check_ins_session ON session_check_ins(session_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user ON session_check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_status ON session_check_ins(status);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE session_check_ins ENABLE ROW LEVEL SECURITY;

-- Policy: View check-ins for sessions you're part of
CREATE POLICY "View check-ins for squad sessions" ON session_check_ins
  FOR SELECT USING (
    session_id IN (
      SELECT s.id FROM sessions s
      INNER JOIN squad_members sm ON sm.squad_id = s.squad_id
      WHERE sm.user_id = auth.uid()
    )
  );

-- Policy: Create own check-in
CREATE POLICY "Create own check-in" ON session_check_ins
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policy: Update own check-in
CREATE POLICY "Update own check-in" ON session_check_ins
  FOR UPDATE USING (user_id = auth.uid());

-- Policy: Delete own check-in
CREATE POLICY "Delete own check-in" ON session_check_ins
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_check_in_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update timestamp
CREATE TRIGGER update_session_check_ins_timestamp
  BEFORE UPDATE ON session_check_ins
  FOR EACH ROW
  EXECUTE FUNCTION update_check_in_timestamp();

-- Function: Send notification when check-in status changes
CREATE OR REPLACE FUNCTION notify_check_in_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for squad members
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT
    sm.user_id,
    'check_in_update',
    'Mise à jour check-in',
    (SELECT u.display_name FROM users u WHERE u.id = NEW.user_id) ||
    CASE NEW.status
      WHEN 'confirmed' THEN ' est confirmé'
      WHEN 'on_my_way' THEN ' est en route'
      WHEN 'running_late' THEN ' est en retard'
      WHEN 'cancelled' THEN ' a annulé'
    END,
    jsonb_build_object(
      'session_id', NEW.session_id,
      'user_id', NEW.user_id,
      'status', NEW.status
    )
  FROM squad_members sm
  INNER JOIN sessions s ON s.squad_id = sm.squad_id
  WHERE s.id = NEW.session_id
    AND sm.user_id != NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Notify on check-in update
CREATE TRIGGER notify_on_check_in_change
  AFTER INSERT OR UPDATE ON session_check_ins
  FOR EACH ROW
  EXECUTE FUNCTION notify_check_in_status_change();

-- ============================================================================
-- INITIAL DATA (Example statuses)
-- ============================================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Check-in system created successfully';
  RAISE NOTICE '   - Table: session_check_ins';
  RAISE NOTICE '   - Statuses: confirmed, on_my_way, running_late, cancelled';
  RAISE NOTICE '   - RLS policies: Enabled';
  RAISE NOTICE '   - Notifications: Auto-send on status change';
END $$;
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
-- ============================================================================
-- SYSTÈME DE BADGES COMPORTEMENTAUX - Phase 1
-- Attribution automatique de badges basés sur le comportement
-- ============================================================================

-- Seed les 5 badges prédéfinis
INSERT INTO badges (id, name, description, icon, rarity, criteria) VALUES
  ('badge_leader_fiable', 'Leader Fiable', 'Présent à plus de 95% des sessions (minimum 20 sessions)', '👑', 'legendary', jsonb_build_object(
    'min_sessions', 20,
    'min_reliability', 95
  )),
  ('badge_pilier_squad', 'Pilier de Squad', 'Membre fondateur actif depuis plus de 3 mois', '⭐', 'epic', jsonb_build_object(
    'min_age_days', 90,
    'founding_member', true
  )),
  ('badge_fantome', 'Fantôme', 'Taux de no-show supérieur à 30%', '👻', 'common', jsonb_build_object(
    'max_reliability', 30,
    'negative', true
  )),
  ('badge_ponctuel', 'Ponctuel', 'Jamais en retard sur les 15 dernières sessions', '⏰', 'rare', jsonb_build_object(
    'min_sessions', 15,
    'max_late_rate', 0
  )),
  ('badge_regulier', 'Régulier', 'Présent chaque semaine pendant 2+ mois consécutifs', '🔥', 'rare', jsonb_build_object(
    'min_weeks', 8,
    'consecutive', true
  ))
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- FONCTION: Vérifier éligibilité badge "Leader Fiable"
-- ============================================================================
CREATE OR REPLACE FUNCTION check_badge_leader_fiable(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_reliability FLOAT;
  user_total_sessions INT;
BEGIN
  SELECT reliability_score, total_sessions
  INTO user_reliability, user_total_sessions
  FROM users
  WHERE id = user_uuid;

  RETURN user_total_sessions >= 20 AND user_reliability >= 95;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION: Vérifier éligibilité badge "Pilier de Squad"
-- ============================================================================
CREATE OR REPLACE FUNCTION check_badge_pilier_squad(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  squad_age_days INT;
  is_founding BOOLEAN;
BEGIN
  -- Récupérer l'ancienneté dans le premier squad rejoint
  SELECT
    EXTRACT(DAY FROM (NOW() - MIN(sm.joined_at)))::INT,
    EXISTS(
      SELECT 1 FROM squad_members sm2
      WHERE sm2.user_id = user_uuid
        AND sm2.joined_at <= (SELECT created_at FROM squads WHERE id = sm2.squad_id)
    )
  INTO squad_age_days, is_founding
  FROM squad_members sm
  WHERE sm.user_id = user_uuid;

  RETURN squad_age_days >= 90 AND (is_founding OR squad_age_days >= 180);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION: Vérifier éligibilité badge "Fantôme"
-- ============================================================================
CREATE OR REPLACE FUNCTION check_badge_fantome(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_total INT;
  user_no_show INT;
  no_show_rate FLOAT;
BEGIN
  SELECT total_sessions, sessions_no_show
  INTO user_total, user_no_show
  FROM users
  WHERE id = user_uuid;

  IF user_total < 5 THEN
    RETURN FALSE;
  END IF;

  no_show_rate := (user_no_show::FLOAT / user_total) * 100;

  RETURN no_show_rate > 30;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION: Vérifier éligibilité badge "Ponctuel"
-- ============================================================================
CREATE OR REPLACE FUNCTION check_badge_ponctuel(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  recent_late_count INT;
  recent_session_count INT;
BEGIN
  -- Compter les 15 dernières sessions
  SELECT COUNT(*)
  INTO recent_session_count
  FROM session_check_ins
  WHERE user_id = user_uuid
  ORDER BY checked_in_at DESC
  LIMIT 15;

  IF recent_session_count < 15 THEN
    RETURN FALSE;
  END IF;

  -- Compter les retards dans les 15 dernières
  SELECT COUNT(*)
  INTO recent_late_count
  FROM (
    SELECT * FROM session_check_ins
    WHERE user_id = user_uuid
    AND status = 'running_late'
    ORDER BY checked_in_at DESC
    LIMIT 15
  ) AS recent;

  RETURN recent_late_count = 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION: Vérifier éligibilité badge "Régulier"
-- ============================================================================
CREATE OR REPLACE FUNCTION check_badge_regulier(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  weekly_attendance INT[];
  consecutive_weeks INT;
  i INT;
BEGIN
  -- Compter les sessions par semaine sur les 10 dernières semaines
  SELECT ARRAY_AGG(session_count)
  INTO weekly_attendance
  FROM (
    SELECT COUNT(*) as session_count
    FROM session_check_ins ci
    WHERE ci.user_id = user_uuid
      AND ci.status IN ('confirmed', 'on_my_way', 'running_late')
      AND ci.checked_in_at >= NOW() - INTERVAL '10 weeks'
    GROUP BY DATE_TRUNC('week', ci.checked_in_at)
    ORDER BY DATE_TRUNC('week', ci.checked_in_at) DESC
  ) AS weekly;

  IF array_length(weekly_attendance, 1) < 8 THEN
    RETURN FALSE;
  END IF;

  -- Vérifier consécutivité (au moins 1 session par semaine)
  consecutive_weeks := 0;
  FOR i IN 1..LEAST(array_length(weekly_attendance, 1), 10) LOOP
    IF weekly_attendance[i] >= 1 THEN
      consecutive_weeks := consecutive_weeks + 1;
      IF consecutive_weeks >= 8 THEN
        RETURN TRUE;
      END IF;
    ELSE
      consecutive_weeks := 0;
    END IF;
  END LOOP;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION MASTER: Attribuer badges à un utilisateur
-- ============================================================================
CREATE OR REPLACE FUNCTION award_badges_to_user(user_uuid UUID)
RETURNS TABLE(badge_id TEXT, awarded BOOLEAN, removed BOOLEAN) AS $$
DECLARE
  badge_checks RECORD;
  is_eligible BOOLEAN;
  already_has BOOLEAN;
BEGIN
  -- Vérifier chaque badge
  FOR badge_checks IN
    SELECT id, name FROM badges
  LOOP
    -- Déterminer éligibilité
    is_eligible := CASE badge_checks.id
      WHEN 'badge_leader_fiable' THEN check_badge_leader_fiable(user_uuid)
      WHEN 'badge_pilier_squad' THEN check_badge_pilier_squad(user_uuid)
      WHEN 'badge_fantome' THEN check_badge_fantome(user_uuid)
      WHEN 'badge_ponctuel' THEN check_badge_ponctuel(user_uuid)
      WHEN 'badge_regulier' THEN check_badge_regulier(user_uuid)
      ELSE FALSE
    END;

    -- Vérifier si déjà possédé
    SELECT EXISTS(
      SELECT 1 FROM user_badges
      WHERE user_id = user_uuid AND badge_id = badge_checks.id
    ) INTO already_has;

    -- Attribution ou retrait
    IF is_eligible AND NOT already_has THEN
      -- Attribuer le badge
      INSERT INTO user_badges (user_id, badge_id, unlocked_at)
      VALUES (user_uuid, badge_checks.id, NOW());

      -- Notification
      INSERT INTO notifications (user_id, type, title, message, data)
      VALUES (
        user_uuid,
        'badge_unlocked',
        'Nouveau badge débloqué ! 🎖️',
        'Félicitations ! Tu as débloqué le badge "' || badge_checks.name || '"',
        jsonb_build_object('badge_id', badge_checks.id)
      );

      RETURN QUERY SELECT badge_checks.id, TRUE, FALSE;

    ELSIF NOT is_eligible AND already_has THEN
      -- Retirer le badge si plus éligible (cas des badges négatifs)
      DELETE FROM user_badges
      WHERE user_id = user_uuid AND badge_id = badge_checks.id;

      RETURN QUERY SELECT badge_checks.id, FALSE, TRUE;
    END IF;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION: Vérifier badges pour tous les utilisateurs (cron daily)
-- ============================================================================
CREATE OR REPLACE FUNCTION check_all_users_badges()
RETURNS TABLE(user_id UUID, badges_awarded INT, badges_removed INT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    (SELECT COUNT(*) FROM award_badges_to_user(u.id) WHERE awarded = TRUE)::INT as awarded,
    (SELECT COUNT(*) FROM award_badges_to_user(u.id) WHERE removed = TRUE)::INT as removed
  FROM users u
  WHERE u.total_sessions >= 3; -- Minimum 3 sessions pour être éligible aux badges
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: Auto-check badges après mise à jour fiabilité
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_check_badges_after_reliability_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier badges si fiabilité ou stats changées
  PERFORM award_badges_to_user(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_badges_after_stats_update ON users;
CREATE TRIGGER check_badges_after_stats_update
  AFTER UPDATE OF reliability_score, total_sessions, sessions_attended, sessions_late, sessions_no_show
  ON users
  FOR EACH ROW
  WHEN (OLD.reliability_score IS DISTINCT FROM NEW.reliability_score
     OR OLD.total_sessions IS DISTINCT FROM NEW.total_sessions)
  EXECUTE FUNCTION auto_check_badges_after_reliability_update();

-- ============================================================================
-- VIEW: Badges par utilisateur avec détails
-- ============================================================================
CREATE OR REPLACE VIEW user_badges_detailed AS
SELECT
  ub.user_id,
  ub.badge_id,
  b.name,
  b.description,
  b.icon,
  b.rarity,
  ub.unlocked_at,
  EXTRACT(DAY FROM (NOW() - ub.unlocked_at))::INT as days_owned
FROM user_badges ub
INNER JOIN badges b ON b.id = ub.badge_id
ORDER BY ub.unlocked_at DESC;

-- ============================================================================
-- RLS POLICIES pour VIEW
-- ============================================================================
CREATE POLICY "View own badges detailed"
  ON user_badges FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Système de badges créé avec succès';
  RAISE NOTICE '   - 5 badges seedés (Leader, Pilier, Fantôme, Ponctuel, Régulier)';
  RAISE NOTICE '   - Fonctions check individuelles';
  RAISE NOTICE '   - Fonction award_badges_to_user()';
  RAISE NOTICE '   - Trigger auto après update stats';
  RAISE NOTICE '   - View user_badges_detailed';
  RAISE NOTICE '   - Notifications auto unlock';
END $$;
-- ============================================================================
-- SYSTÈME DE RÔLES & PERMISSIONS - Phase 1
-- Gestion hiérarchique des squads (Leader, Co-leader, Membre)
-- ============================================================================

-- Créer type enum pour les rôles
CREATE TYPE squad_role AS ENUM ('leader', 'co_leader', 'member');

-- Mettre à jour la table squad_members si la colonne n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'squad_members' AND column_name = 'role'
  ) THEN
    ALTER TABLE squad_members
    ADD COLUMN role squad_role DEFAULT 'member';
  END IF;
END $$;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_squad_members_role ON squad_members(role);

-- ============================================================================
-- FONCTIONS DE VÉRIFICATION DE PERMISSIONS
-- ============================================================================

-- Fonction: Vérifier si user est leader du squad
CREATE OR REPLACE FUNCTION is_squad_leader(user_uuid UUID, squad_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM squad_members
    WHERE user_id = user_uuid
      AND squad_id = squad_uuid
      AND role = 'leader'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Vérifier si user est co-leader du squad
CREATE OR REPLACE FUNCTION is_squad_co_leader(user_uuid UUID, squad_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM squad_members
    WHERE user_id = user_uuid
      AND squad_id = squad_uuid
      AND role = 'co_leader'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Vérifier si user a des droits d'admin (leader OU co-leader)
CREATE OR REPLACE FUNCTION is_squad_admin(user_uuid UUID, squad_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM squad_members
    WHERE user_id = user_uuid
      AND squad_id = squad_uuid
      AND role IN ('leader', 'co_leader')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Obtenir le rôle d'un user dans un squad
CREATE OR REPLACE FUNCTION get_user_squad_role(user_uuid UUID, squad_uuid UUID)
RETURNS squad_role AS $$
DECLARE
  user_role squad_role;
BEGIN
  SELECT role INTO user_role
  FROM squad_members
  WHERE user_id = user_uuid AND squad_id = squad_uuid;

  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PERMISSIONS PAR RÔLE
-- ============================================================================

-- Table des permissions définies
CREATE TABLE IF NOT EXISTS squad_permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  requires_role squad_role NOT NULL,
  category TEXT DEFAULT 'general'
);

-- Seed permissions
INSERT INTO squad_permissions (id, name, description, requires_role, category) VALUES
  ('create_session', 'Créer une session', 'Proposer une nouvelle session de jeu', 'member', 'sessions'),
  ('edit_session', 'Modifier une session', 'Modifier les détails d''une session', 'co_leader', 'sessions'),
  ('delete_session', 'Supprimer une session', 'Annuler une session', 'co_leader', 'sessions'),
  ('invite_member', 'Inviter des membres', 'Envoyer des invitations au squad', 'member', 'members'),
  ('kick_member', 'Exclure un membre', 'Retirer un membre du squad', 'co_leader', 'members'),
  ('promote_member', 'Promouvoir un membre', 'Changer le rôle d''un membre', 'leader', 'members'),
  ('edit_squad', 'Modifier le squad', 'Changer nom, description, paramètres', 'leader', 'squad'),
  ('delete_squad', 'Supprimer le squad', 'Dissoudre définitivement le squad', 'leader', 'squad'),
  ('manage_roles', 'Gérer les rôles', 'Assigner co-leaders et gérer permissions', 'leader', 'squad'),
  ('send_announcement', 'Envoyer une annonce', 'Notifier tous les membres', 'co_leader', 'communication'),
  ('moderate_chat', 'Modérer le chat', 'Supprimer messages, gérer spam', 'co_leader', 'communication')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- FONCTION: Vérifier si user a une permission
-- ============================================================================
CREATE OR REPLACE FUNCTION user_has_permission(
  user_uuid UUID,
  squad_uuid UUID,
  permission_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role squad_role;
  required_role squad_role;
BEGIN
  -- Obtenir rôle user
  user_role := get_user_squad_role(user_uuid, squad_uuid);

  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Obtenir rôle requis pour permission
  SELECT requires_role INTO required_role
  FROM squad_permissions
  WHERE id = permission_id;

  IF required_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Hiérarchie: leader > co_leader > member
  RETURN CASE
    WHEN user_role = 'leader' THEN TRUE
    WHEN user_role = 'co_leader' THEN required_role IN ('co_leader', 'member')
    WHEN user_role = 'member' THEN required_role = 'member'
    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FONCTIONS HELPER POUR ACTIONS
-- ============================================================================

-- Promouvoir un membre (seulement leader)
CREATE OR REPLACE FUNCTION promote_squad_member(
  promoter_uuid UUID,
  target_user_uuid UUID,
  squad_uuid UUID,
  new_role squad_role
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifier que le promoter est leader
  IF NOT is_squad_leader(promoter_uuid, squad_uuid) THEN
    RAISE EXCEPTION 'Only squad leader can promote members';
  END IF;

  -- Empêcher de promouvoir à leader (seul owner peut être leader)
  IF new_role = 'leader' THEN
    RAISE EXCEPTION 'Cannot promote to leader role';
  END IF;

  -- Mettre à jour le rôle
  UPDATE squad_members
  SET role = new_role
  WHERE user_id = target_user_uuid
    AND squad_id = squad_uuid;

  -- Notification
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (
    target_user_uuid,
    'role_changed',
    'Nouveau rôle dans le squad',
    'Tu as été promu ' || CASE new_role
      WHEN 'co_leader' THEN 'Co-leader'
      ELSE 'Membre'
    END,
    jsonb_build_object('squad_id', squad_uuid, 'new_role', new_role)
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exclure un membre (leader ou co-leader)
CREATE OR REPLACE FUNCTION kick_squad_member(
  kicker_uuid UUID,
  target_user_uuid UUID,
  squad_uuid UUID,
  reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  target_role squad_role;
BEGIN
  -- Vérifier permissions (leader ou co-leader)
  IF NOT is_squad_admin(kicker_uuid, squad_uuid) THEN
    RAISE EXCEPTION 'Only squad admins can kick members';
  END IF;

  -- Obtenir rôle de la cible
  SELECT role INTO target_role
  FROM squad_members
  WHERE user_id = target_user_uuid AND squad_id = squad_uuid;

  -- Empêcher kick du leader
  IF target_role = 'leader' THEN
    RAISE EXCEPTION 'Cannot kick squad leader';
  END IF;

  -- Co-leader ne peut kick qu'un membre
  IF is_squad_co_leader(kicker_uuid, squad_uuid) AND target_role = 'co_leader' THEN
    RAISE EXCEPTION 'Co-leader cannot kick another co-leader';
  END IF;

  -- Supprimer de squad_members
  DELETE FROM squad_members
  WHERE user_id = target_user_uuid AND squad_id = squad_uuid;

  -- Notification
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (
    target_user_uuid,
    'kicked_from_squad',
    'Retiré du squad',
    COALESCE('Raison: ' || reason, 'Tu as été retiré du squad'),
    jsonb_build_object('squad_id', squad_uuid)
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES AVANCÉES
-- ============================================================================

-- Policy: Seuls leaders/co-leaders peuvent modifier le squad
DROP POLICY IF EXISTS "Squad admins can update squad" ON squads;
CREATE POLICY "Squad admins can update squad" ON squads
  FOR UPDATE
  USING (
    is_squad_admin(auth.uid(), id)
  );

-- Policy: Seuls leaders/co-leaders peuvent créer sessions
DROP POLICY IF EXISTS "Squad members can create sessions" ON sessions;
CREATE POLICY "Squad members can create sessions" ON sessions
  FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM squad_members
      WHERE squad_id = sessions.squad_id
        AND user_id = auth.uid()
    )
  );

-- Policy: Seuls admins peuvent modifier sessions
DROP POLICY IF EXISTS "Squad admins can edit sessions" ON sessions;
CREATE POLICY "Squad admins can edit sessions" ON sessions
  FOR UPDATE
  USING (
    is_squad_admin(auth.uid(), squad_id)
  );

-- Policy: Seuls admins peuvent supprimer sessions
DROP POLICY IF EXISTS "Squad admins can delete sessions" ON sessions;
CREATE POLICY "Squad admins can delete sessions" ON sessions
  FOR DELETE
  USING (
    is_squad_admin(auth.uid(), squad_id)
  );

-- ============================================================================
-- VIEW: Squad avec rôles des membres
-- ============================================================================
CREATE OR REPLACE VIEW squad_members_with_roles AS
SELECT
  sm.id,
  sm.squad_id,
  sm.user_id,
  sm.role,
  sm.joined_at,
  u.display_name,
  u.username,
  u.avatar_url,
  u.reliability_score,
  CASE sm.role
    WHEN 'leader' THEN 3
    WHEN 'co_leader' THEN 2
    ELSE 1
  END as role_priority
FROM squad_members sm
INNER JOIN users u ON u.id = sm.user_id
ORDER BY role_priority DESC, sm.joined_at ASC;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Système de rôles & permissions créé';
  RAISE NOTICE '   - Type enum: squad_role (leader, co_leader, member)';
  RAISE NOTICE '   - 11 permissions définies';
  RAISE NOTICE '   - Fonctions: is_squad_leader, is_squad_admin, user_has_permission';
  RAISE NOTICE '   - Actions: promote_squad_member, kick_squad_member';
  RAISE NOTICE '   - RLS policies avancées';
  RAISE NOTICE '   - View: squad_members_with_roles';
END $$;
