-- ============================================================================
-- 🚀 SQUAD PLANNER - TOUTES LES MIGRATIONS À EXÉCUTER
-- ============================================================================
--
-- INSTRUCTIONS:
-- 1. Va dans ton Supabase Dashboard > SQL Editor
-- 2. Copie-colle ce fichier en entier
-- 3. Clique sur "Run" (ou Ctrl/Cmd + Enter)
--
-- Note: Ce script est idempotent (peut être exécuté plusieurs fois)
-- ============================================================================

-- ============================================================================
-- PARTIE 1: DISCORD BOT INTEGRATION
-- ============================================================================

-- Table pour lier les comptes Discord aux comptes Squad Planner
CREATE TABLE IF NOT EXISTS discord_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id TEXT UNIQUE NOT NULL,
  discord_username TEXT,
  discord_avatar TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour lier les serveurs Discord aux squads
CREATE TABLE IF NOT EXISTS discord_guild_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT UNIQUE NOT NULL,
  guild_name TEXT,
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
  notification_channel_id TEXT,
  voice_channel_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les codes de liaison temporaires (expire après 10 minutes)
CREATE TABLE IF NOT EXISTS discord_link_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour tracker les rappels envoyés (éviter les doublons)
CREATE TABLE IF NOT EXISTS session_reminders_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('h24', 'h1', 'h0')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  channel_id TEXT,
  message_id TEXT,
  UNIQUE(session_id, reminder_type)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_discord_links_discord_id ON discord_links(discord_id);
CREATE INDEX IF NOT EXISTS idx_discord_links_user_id ON discord_links(user_id);
CREATE INDEX IF NOT EXISTS idx_discord_guild_links_guild_id ON discord_guild_links(guild_id);
CREATE INDEX IF NOT EXISTS idx_discord_guild_links_squad_id ON discord_guild_links(squad_id);
CREATE INDEX IF NOT EXISTS idx_discord_link_codes_code ON discord_link_codes(code);
CREATE INDEX IF NOT EXISTS idx_discord_link_codes_expires ON discord_link_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_session_reminders_session ON session_reminders_sent(session_id);

-- RLS pour Discord
ALTER TABLE discord_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_guild_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_link_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_reminders_sent ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own discord link" ON discord_links;
CREATE POLICY "Users can view own discord link" ON discord_links
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own discord link" ON discord_links;
CREATE POLICY "Users can insert own discord link" ON discord_links
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own discord link" ON discord_links;
CREATE POLICY "Users can delete own discord link" ON discord_links
  FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Squad members can view guild links" ON discord_guild_links;
CREATE POLICY "Squad members can view guild links" ON discord_guild_links
  FOR SELECT USING (squad_id IN (
    SELECT squad_id FROM squad_members WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can view own link codes" ON discord_link_codes;
CREATE POLICY "Users can view own link codes" ON discord_link_codes
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own link codes" ON discord_link_codes;
CREATE POLICY "Users can create own link codes" ON discord_link_codes
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own link codes" ON discord_link_codes;
CREATE POLICY "Users can delete own link codes" ON discord_link_codes
  FOR DELETE USING (user_id = auth.uid());

-- Fonctions Discord
CREATE OR REPLACE FUNCTION generate_discord_link_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  DELETE FROM discord_link_codes WHERE expires_at < NOW();
  DELETE FROM discord_link_codes WHERE user_id = p_user_id;
  LOOP
    v_code := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6));
    SELECT EXISTS(SELECT 1 FROM discord_link_codes WHERE code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  INSERT INTO discord_link_codes (code, user_id, expires_at)
  VALUES (v_code, p_user_id, NOW() + INTERVAL '10 minutes');
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verify_discord_link_code(p_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id FROM discord_link_codes
  WHERE code = UPPER(p_code) AND expires_at > NOW();
  IF v_user_id IS NOT NULL THEN
    DELETE FROM discord_link_codes WHERE code = UPPER(p_code);
  END IF;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_discord_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS discord_links_updated_at ON discord_links;
CREATE TRIGGER discord_links_updated_at
  BEFORE UPDATE ON discord_links
  FOR EACH ROW EXECUTE FUNCTION update_discord_links_updated_at();

DROP TRIGGER IF EXISTS discord_guild_links_updated_at ON discord_guild_links;
CREATE TRIGGER discord_guild_links_updated_at
  BEFORE UPDATE ON discord_guild_links
  FOR EACH ROW EXECUTE FUNCTION update_discord_links_updated_at();

-- Ajouter colonnes Discord à profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'discord_id') THEN
    ALTER TABLE profiles ADD COLUMN discord_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'discord_username') THEN
    ALTER TABLE profiles ADD COLUMN discord_username TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_discord_id ON profiles(discord_id);

CREATE OR REPLACE FUNCTION cleanup_expired_discord_codes()
RETURNS INTEGER AS $$
DECLARE v_count INTEGER;
BEGIN
  DELETE FROM discord_link_codes WHERE expires_at < NOW();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTIE 2: PUSH NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  device_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active) WHERE is_active = TRUE;

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can view own push subscriptions" ON push_subscriptions
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can insert own push subscriptions" ON push_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can update own push subscriptions" ON push_subscriptions
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can delete own push subscriptions" ON push_subscriptions
  FOR DELETE USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION update_push_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS push_subscriptions_updated_at ON push_subscriptions;
CREATE TRIGGER push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_push_subscription_updated_at();

-- Notification settings dans profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'notification_settings') THEN
    ALTER TABLE profiles ADD COLUMN notification_settings JSONB DEFAULT '{
      "pushReminder24h": true,
      "pushReminder1h": true,
      "pushReminder10m": true,
      "emailReminder24h": false,
      "smartNudges": true,
      "rsvpUpdates": true,
      "chatMessages": true
    }';
  END IF;
END $$;

-- Notification logs
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'clicked')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_type ON notification_logs(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON notification_logs(created_at DESC);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notification logs" ON notification_logs;
CREATE POLICY "Users can view own notification logs" ON notification_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION get_user_push_subscriptions(p_user_id UUID)
RETURNS TABLE (endpoint TEXT, p256dh_key TEXT, auth_key TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT ps.endpoint, ps.p256dh_key, ps.auth_key
  FROM push_subscriptions ps
  WHERE ps.user_id = p_user_id AND ps.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_session_notification_targets(
  p_session_id UUID, p_reminder_type TEXT
)
RETURNS TABLE (
  user_id UUID, endpoint TEXT, p256dh_key TEXT, auth_key TEXT, display_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT ps.user_id, ps.endpoint, ps.p256dh_key, ps.auth_key, p.display_name
  FROM push_subscriptions ps
  JOIN profiles p ON p.id = ps.user_id
  JOIN session_rsvps sr ON sr.user_id = ps.user_id
  WHERE sr.session_id = p_session_id
    AND sr.response = 'yes'
    AND ps.is_active = TRUE
    AND (
      p.notification_settings IS NULL
      OR (p.notification_settings->>'pushReminder24h')::boolean = TRUE AND p_reminder_type = 'h24'
      OR (p.notification_settings->>'pushReminder1h')::boolean = TRUE AND p_reminder_type = 'h1'
      OR (p.notification_settings->>'pushReminder10m')::boolean = TRUE AND p_reminder_type = 'h10m'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PARTIE 3: RECURRING SESSIONS AUTOMATION
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_recurring_sessions()
RETURNS void AS $$
DECLARE
  rec RECORD;
  next_date DATE;
  days_ahead INTEGER;
BEGIN
  FOR rec IN
    SELECT * FROM recurring_sessions
    WHERE is_active = true
    AND (last_generated_at IS NULL OR last_generated_at < CURRENT_DATE - INTERVAL '7 days')
  LOOP
    days_ahead := (rec.day_of_week - EXTRACT(DOW FROM CURRENT_DATE)::INTEGER + 7) % 7;
    IF days_ahead = 0 THEN days_ahead := 7; END IF;
    next_date := CURRENT_DATE + days_ahead;

    INSERT INTO sessions (
      squad_id, title, description, scheduled_date, scheduled_time,
      duration, timezone, is_recurring, recurring_session_id, status, proposed_by, required_players
    )
    SELECT
      rec.squad_id, rec.title, rec.description, next_date, rec.scheduled_time,
      rec.duration, rec.timezone, true, rec.id, 'pending', rec.created_by, 5
    WHERE NOT EXISTS (
      SELECT 1 FROM sessions WHERE recurring_session_id = rec.id AND scheduled_date = next_date
    );

    UPDATE recurring_sessions SET last_generated_at = CURRENT_DATE WHERE id = rec.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PARTIE 4: CHECK-IN SYSTEM (Utilise auth.users donc adapté)
-- ============================================================================

CREATE TABLE IF NOT EXISTS session_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'on_my_way', 'running_late', 'cancelled')),
  notes TEXT,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_check_ins_session ON session_check_ins(session_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user ON session_check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_status ON session_check_ins(status);

ALTER TABLE session_check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View check-ins for squad sessions" ON session_check_ins;
CREATE POLICY "View check-ins for squad sessions" ON session_check_ins
  FOR SELECT USING (
    session_id IN (
      SELECT s.id FROM sessions s
      INNER JOIN squad_members sm ON sm.squad_id = s.squad_id
      WHERE sm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Create own check-in" ON session_check_ins;
CREATE POLICY "Create own check-in" ON session_check_ins
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Update own check-in" ON session_check_ins;
CREATE POLICY "Update own check-in" ON session_check_ins
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Delete own check-in" ON session_check_ins;
CREATE POLICY "Delete own check-in" ON session_check_ins
  FOR DELETE USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION update_check_in_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_session_check_ins_timestamp ON session_check_ins;
CREATE TRIGGER update_session_check_ins_timestamp
  BEFORE UPDATE ON session_check_ins
  FOR EACH ROW EXECUTE FUNCTION update_check_in_timestamp();

-- ============================================================================
-- PARTIE 5: RELIABILITY SYSTEM
-- ============================================================================

-- Ajouter colonnes si elles n'existent pas
DO $$
BEGIN
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
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_reliability ON profiles(reliability_score);
CREATE INDEX IF NOT EXISTS idx_profiles_sessions_attended ON profiles(sessions_attended);
CREATE INDEX IF NOT EXISTS idx_profiles_total_sessions ON profiles(total_sessions);

CREATE OR REPLACE FUNCTION calculate_user_reliability(user_uuid UUID)
RETURNS FLOAT AS $$
DECLARE
  total INT; attended INT; late INT; no_show INT; rel_score FLOAT;
BEGIN
  SELECT total_sessions, sessions_attended, sessions_late, sessions_no_show
  INTO total, attended, late, no_show FROM profiles WHERE id = user_uuid;
  IF total = 0 OR total IS NULL THEN RETURN 100.0; END IF;
  rel_score := ((attended - (no_show * 2.0) - (late * 0.5)) / NULLIF(total, 0)) * 100.0;
  rel_score := GREATEST(0.0, LEAST(100.0, rel_score));
  RETURN ROUND(rel_score, 1);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_stats_after_checkin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('confirmed', 'on_my_way') THEN
    UPDATE profiles SET
      sessions_attended = sessions_attended + 1,
      total_sessions = total_sessions + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;
  ELSIF NEW.status = 'running_late' THEN
    UPDATE profiles SET
      sessions_attended = sessions_attended + 1,
      sessions_late = sessions_late + 1,
      total_sessions = total_sessions + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;
  ELSIF NEW.status = 'cancelled' THEN
    UPDATE profiles SET
      sessions_no_show = sessions_no_show + 1,
      total_sessions = total_sessions + 1,
      last_reliability_update = NOW()
    WHERE id = NEW.user_id;
  END IF;
  UPDATE profiles SET reliability_score = calculate_user_reliability(NEW.user_id)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reliability_after_checkin ON session_check_ins;
CREATE TRIGGER update_reliability_after_checkin
  AFTER INSERT OR UPDATE OF status ON session_check_ins
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_after_checkin();

CREATE OR REPLACE FUNCTION recalculate_all_reliability()
RETURNS TABLE(user_id UUID, old_score FLOAT, new_score FLOAT) AS $$
BEGIN
  RETURN QUERY
  UPDATE profiles u SET reliability_score = calculate_user_reliability(u.id),
      last_reliability_update = NOW()
  RETURNING u.id, u.reliability_score AS old_score, calculate_user_reliability(u.id) AS new_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PARTIE 6: BADGES SYSTEM
-- ============================================================================

-- Créer table badges si n'existe pas (avec UUID comme id)
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  rarity TEXT DEFAULT 'common',
  criteria JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Seed badges (by name to avoid UUID conflicts)
INSERT INTO badges (name, description, icon, rarity, criteria)
SELECT 'Leader Fiable', 'Présent à plus de 95% des sessions (minimum 20 sessions)', '👑', 'legendary', '{"min_sessions": 20, "min_reliability": 95}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE name = 'Leader Fiable');

INSERT INTO badges (name, description, icon, rarity, criteria)
SELECT 'Pilier de Squad', 'Membre fondateur actif depuis plus de 3 mois', '⭐', 'epic', '{"min_age_days": 90, "founding_member": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE name = 'Pilier de Squad');

INSERT INTO badges (name, description, icon, rarity, criteria)
SELECT 'Fantôme', 'Taux de no-show supérieur à 30%', '👻', 'common', '{"max_reliability": 30, "negative": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE name = 'Fantôme');

INSERT INTO badges (name, description, icon, rarity, criteria)
SELECT 'Ponctuel', 'Jamais en retard sur les 15 dernières sessions', '⏰', 'rare', '{"min_sessions": 15, "max_late_rate": 0}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE name = 'Ponctuel');

INSERT INTO badges (name, description, icon, rarity, criteria)
SELECT 'Régulier', 'Présent chaque semaine pendant 2+ mois consécutifs', '🔥', 'rare', '{"min_weeks": 8, "consecutive": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE name = 'Régulier');

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view badges" ON badges;
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "View own badges" ON user_badges;
CREATE POLICY "View own badges" ON user_badges FOR SELECT USING (user_id = auth.uid());

-- Badge check functions
CREATE OR REPLACE FUNCTION check_badge_leader_fiable(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE user_reliability FLOAT; user_total_sessions INT;
BEGIN
  SELECT reliability_score, total_sessions INTO user_reliability, user_total_sessions
  FROM profiles WHERE id = user_uuid;
  RETURN user_total_sessions >= 20 AND user_reliability >= 95;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_badge_fantome(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE user_total INT; user_no_show INT; no_show_rate FLOAT;
BEGIN
  SELECT total_sessions, sessions_no_show INTO user_total, user_no_show
  FROM profiles WHERE id = user_uuid;
  IF user_total < 5 THEN RETURN FALSE; END IF;
  no_show_rate := (user_no_show::FLOAT / user_total) * 100;
  RETURN no_show_rate > 30;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION award_badges_to_user(user_uuid UUID)
RETURNS TABLE(badge_id UUID, awarded BOOLEAN, removed BOOLEAN) AS $$
DECLARE badge_rec RECORD; is_eligible BOOLEAN; already_has BOOLEAN;
BEGIN
  FOR badge_rec IN SELECT id, name FROM badges LOOP
    is_eligible := CASE badge_rec.name
      WHEN 'Leader Fiable' THEN check_badge_leader_fiable(user_uuid)
      WHEN 'Fantôme' THEN check_badge_fantome(user_uuid)
      ELSE FALSE
    END;
    SELECT EXISTS(SELECT 1 FROM user_badges WHERE user_id = user_uuid AND user_badges.badge_id = badge_rec.id) INTO already_has;
    IF is_eligible AND NOT already_has THEN
      INSERT INTO user_badges (user_id, badge_id, unlocked_at) VALUES (user_uuid, badge_rec.id, NOW());
      INSERT INTO notifications (user_id, type, title, message, data) VALUES (
        user_uuid, 'badge_unlocked', 'Nouveau badge !',
        'Tu as débloqué "' || badge_rec.name || '"', jsonb_build_object('badge_id', badge_rec.id::text)
      );
      RETURN QUERY SELECT badge_rec.id, TRUE, FALSE;
    ELSIF NOT is_eligible AND already_has THEN
      DELETE FROM user_badges WHERE user_id = user_uuid AND user_badges.badge_id = badge_rec.id;
      RETURN QUERY SELECT badge_rec.id, FALSE, TRUE;
    END IF;
  END LOOP;
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PARTIE 7: ROLES & PERMISSIONS
-- ============================================================================

-- Créer type enum pour les rôles (ignore si existe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'squad_role') THEN
    CREATE TYPE squad_role AS ENUM ('leader', 'co_leader', 'member');
  END IF;
END $$;

-- Ajouter colonne role à squad_members
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'squad_members' AND column_name = 'role'
  ) THEN
    ALTER TABLE squad_members ADD COLUMN role TEXT DEFAULT 'member';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_squad_members_role ON squad_members(role);

CREATE OR REPLACE FUNCTION is_squad_leader(user_uuid UUID, squad_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM squad_members
    WHERE user_id = user_uuid AND squad_id = squad_uuid AND role = 'leader'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_squad_co_leader(user_uuid UUID, squad_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM squad_members
    WHERE user_id = user_uuid AND squad_id = squad_uuid AND role = 'co_leader'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_squad_admin(user_uuid UUID, squad_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM squad_members
    WHERE user_id = user_uuid AND squad_id = squad_uuid AND role IN ('leader', 'co_leader')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Squad permissions table
CREATE TABLE IF NOT EXISTS squad_permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  requires_role TEXT NOT NULL,
  category TEXT DEFAULT 'general'
);

INSERT INTO squad_permissions (id, name, description, requires_role, category) VALUES
  ('create_session', 'Créer une session', 'Proposer une nouvelle session', 'member', 'sessions'),
  ('edit_session', 'Modifier une session', 'Modifier les détails', 'co_leader', 'sessions'),
  ('delete_session', 'Supprimer une session', 'Annuler une session', 'co_leader', 'sessions'),
  ('invite_member', 'Inviter des membres', 'Envoyer des invitations', 'member', 'members'),
  ('kick_member', 'Exclure un membre', 'Retirer un membre', 'co_leader', 'members'),
  ('promote_member', 'Promouvoir un membre', 'Changer le rôle', 'leader', 'members'),
  ('edit_squad', 'Modifier le squad', 'Changer nom, description', 'leader', 'squad'),
  ('delete_squad', 'Supprimer le squad', 'Dissoudre le squad', 'leader', 'squad'),
  ('manage_roles', 'Gérer les rôles', 'Assigner co-leaders', 'leader', 'squad'),
  ('send_announcement', 'Envoyer une annonce', 'Notifier tous les membres', 'co_leader', 'communication'),
  ('moderate_chat', 'Modérer le chat', 'Supprimer messages', 'co_leader', 'communication')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PARTIE 8: MISSING RLS POLICIES (condensé)
-- ============================================================================

-- Ces policies seront appliquées si les tables existent
DO $$
BEGIN
  -- Organizations
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') THEN
    ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Friendships
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'friendships') THEN
    ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Achievements
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'achievements') THEN
    ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Integrations
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'integrations') THEN
    ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Webhooks
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'webhooks') THEN
    ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Availability
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'availability_slots') THEN
    ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================================================
-- ✅ MIGRATION COMPLÈTE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Toutes les migrations ont été appliquées avec succès!';
  RAISE NOTICE '   - Discord Bot Integration';
  RAISE NOTICE '   - Push Notifications';
  RAISE NOTICE '   - Recurring Sessions';
  RAISE NOTICE '   - Check-in System';
  RAISE NOTICE '   - Reliability System';
  RAISE NOTICE '   - Badges System';
  RAISE NOTICE '   - Roles & Permissions';
  RAISE NOTICE '   - RLS Policies';
END $$;
