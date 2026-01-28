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
