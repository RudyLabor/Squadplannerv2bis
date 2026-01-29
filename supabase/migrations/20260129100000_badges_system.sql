-- ============================================================================
-- SYSTÈME DE BADGES COMPORTEMENTAUX - Phase 1
-- Version corrigée: inclut code, color et utilise profiles
-- ============================================================================

-- D'abord, ajouter les colonnes manquantes à la table badges si elles n'existent pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'badges' AND column_name = 'rarity') THEN
    ALTER TABLE badges ADD COLUMN rarity VARCHAR(20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'badges' AND column_name = 'criteria') THEN
    ALTER TABLE badges ADD COLUMN criteria JSONB DEFAULT '{}';
  END IF;
END $$;

-- Seed les 5 badges prédéfinis (avec code unique requis)
INSERT INTO badges (code, name, description, icon, color, rarity, criteria)
SELECT 'leader_fiable', 'Leader Fiable', 'Présent à plus de 95% des sessions (minimum 20 sessions)', '👑', '#FFD700', 'legendary',
  '{"min_sessions": 20, "min_reliability": 95}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE code = 'leader_fiable');

INSERT INTO badges (code, name, description, icon, color, rarity, criteria)
SELECT 'pilier_squad', 'Pilier de Squad', 'Membre fondateur actif depuis plus de 3 mois', '⭐', '#9B59B6', 'epic',
  '{"min_age_days": 90, "founding_member": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE code = 'pilier_squad');

INSERT INTO badges (code, name, description, icon, color, rarity, criteria)
SELECT 'fantome', 'Fantôme', 'Taux de no-show supérieur à 30%', '👻', '#95A5A6', 'common',
  '{"max_reliability": 30, "negative": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE code = 'fantome');

INSERT INTO badges (code, name, description, icon, color, rarity, criteria)
SELECT 'ponctuel', 'Ponctuel', 'Jamais en retard sur les 15 dernières sessions', '⏰', '#3498DB', 'rare',
  '{"min_sessions": 15, "max_late_rate": 0}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE code = 'ponctuel');

INSERT INTO badges (code, name, description, icon, color, rarity, criteria)
SELECT 'regulier', 'Régulier', 'Présent chaque semaine pendant 2+ mois consécutifs', '🔥', '#E74C3C', 'rare',
  '{"min_weeks": 8, "consecutive": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE code = 'regulier');

-- Ajouter colonne unlocked_at à user_badges si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'user_badges' AND column_name = 'unlocked_at') THEN
    ALTER TABLE user_badges ADD COLUMN unlocked_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- ============================================================================
-- FONCTIONS DE VÉRIFICATION
-- ============================================================================

CREATE OR REPLACE FUNCTION check_badge_leader_fiable(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_reliability FLOAT;
  user_total_sessions INT;
BEGIN
  SELECT reliability_score, total_sessions
  INTO user_reliability, user_total_sessions
  FROM profiles WHERE id = user_uuid;

  RETURN COALESCE(user_total_sessions, 0) >= 20 AND COALESCE(user_reliability, 0) >= 95;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_badge_pilier_squad(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  squad_age_days INT;
BEGIN
  SELECT EXTRACT(DAY FROM (NOW() - MIN(sm.joined_at)))::INT
  INTO squad_age_days
  FROM squad_members sm WHERE sm.user_id = user_uuid;

  RETURN COALESCE(squad_age_days, 0) >= 90;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_badge_fantome(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_total INT;
  user_no_show INT;
  no_show_rate FLOAT;
BEGIN
  SELECT total_sessions, sessions_no_show
  INTO user_total, user_no_show
  FROM profiles WHERE id = user_uuid;

  IF COALESCE(user_total, 0) < 5 THEN RETURN FALSE; END IF;

  no_show_rate := (COALESCE(user_no_show, 0)::FLOAT / user_total) * 100;
  RETURN no_show_rate > 30;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_badge_ponctuel(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  recent_late_count INT;
  recent_session_count INT;
BEGIN
  SELECT COUNT(*) INTO recent_session_count
  FROM session_check_ins WHERE user_id = user_uuid;

  IF recent_session_count < 15 THEN RETURN FALSE; END IF;

  SELECT COUNT(*) INTO recent_late_count
  FROM (
    SELECT 1 FROM session_check_ins
    WHERE user_id = user_uuid AND status = 'running_late'
    ORDER BY checked_in_at DESC LIMIT 15
  ) subq;

  RETURN COALESCE(recent_late_count, 0) = 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FONCTION MASTER: Attribuer badges à un utilisateur
-- ============================================================================
CREATE OR REPLACE FUNCTION award_badges_to_user(user_uuid UUID)
RETURNS TABLE(badge_id UUID, awarded BOOLEAN, removed BOOLEAN) AS $$
DECLARE
  badge_rec RECORD;
  is_eligible BOOLEAN;
  already_has BOOLEAN;
BEGIN
  FOR badge_rec IN SELECT id, code FROM badges WHERE code IN ('leader_fiable', 'pilier_squad', 'fantome', 'ponctuel', 'regulier') LOOP
    is_eligible := CASE badge_rec.code
      WHEN 'leader_fiable' THEN check_badge_leader_fiable(user_uuid)
      WHEN 'pilier_squad' THEN check_badge_pilier_squad(user_uuid)
      WHEN 'fantome' THEN check_badge_fantome(user_uuid)
      WHEN 'ponctuel' THEN check_badge_ponctuel(user_uuid)
      ELSE FALSE
    END;

    SELECT EXISTS(SELECT 1 FROM user_badges ub WHERE ub.user_id = user_uuid AND ub.badge_id = badge_rec.id) INTO already_has;

    IF is_eligible AND NOT already_has THEN
      INSERT INTO user_badges (user_id, badge_id, awarded_at) VALUES (user_uuid, badge_rec.id, NOW());
      RETURN QUERY SELECT badge_rec.id, TRUE, FALSE;
    ELSIF NOT is_eligible AND already_has THEN
      DELETE FROM user_badges ub WHERE ub.user_id = user_uuid AND ub.badge_id = badge_rec.id;
      RETURN QUERY SELECT badge_rec.id, FALSE, TRUE;
    END IF;
  END LOOP;
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Success
DO $$ BEGIN RAISE NOTICE '✅ Badges system created successfully'; END $$;
