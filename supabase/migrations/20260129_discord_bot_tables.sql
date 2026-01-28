-- ============================================
-- DISCORD BOT INTEGRATION TABLES
-- Phase 3: Discord Native Integration
-- ============================================

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

-- ============================================
-- INDEXES POUR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_discord_links_discord_id ON discord_links(discord_id);
CREATE INDEX IF NOT EXISTS idx_discord_links_user_id ON discord_links(user_id);
CREATE INDEX IF NOT EXISTS idx_discord_guild_links_guild_id ON discord_guild_links(guild_id);
CREATE INDEX IF NOT EXISTS idx_discord_guild_links_squad_id ON discord_guild_links(squad_id);
CREATE INDEX IF NOT EXISTS idx_discord_link_codes_code ON discord_link_codes(code);
CREATE INDEX IF NOT EXISTS idx_discord_link_codes_expires ON discord_link_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_session_reminders_session ON session_reminders_sent(session_id);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE discord_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_guild_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE discord_link_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_reminders_sent ENABLE ROW LEVEL SECURITY;

-- Discord Links: Users can see and manage their own link
CREATE POLICY "Users can view own discord link"
  ON discord_links FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own discord link"
  ON discord_links FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own discord link"
  ON discord_links FOR DELETE
  USING (user_id = auth.uid());

-- Guild Links: Squad admins can manage, members can view
CREATE POLICY "Squad members can view guild links"
  ON discord_guild_links FOR SELECT
  USING (squad_id IN (
    SELECT squad_id FROM squad_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Squad admins can manage guild links"
  ON discord_guild_links FOR ALL
  USING (squad_id IN (
    SELECT squad_id FROM squad_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'co_leader')
  ));

-- Link Codes: Users can view and create their own
CREATE POLICY "Users can view own link codes"
  ON discord_link_codes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own link codes"
  ON discord_link_codes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own link codes"
  ON discord_link_codes FOR DELETE
  USING (user_id = auth.uid());

-- Reminders: Service role only (bot backend)
-- No user policies needed as this is managed by the bot

-- ============================================
-- FUNCTIONS
-- ============================================

-- Generate a random 6-character link code
CREATE OR REPLACE FUNCTION generate_discord_link_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  -- Delete expired codes first
  DELETE FROM discord_link_codes WHERE expires_at < NOW();

  -- Delete existing codes for this user
  DELETE FROM discord_link_codes WHERE user_id = p_user_id;

  -- Generate unique code
  LOOP
    v_code := UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6));
    SELECT EXISTS(SELECT 1 FROM discord_link_codes WHERE code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;

  -- Insert new code
  INSERT INTO discord_link_codes (code, user_id, expires_at)
  VALUES (v_code, p_user_id, NOW() + INTERVAL '10 minutes');

  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify and consume a link code
CREATE OR REPLACE FUNCTION verify_discord_link_code(p_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find valid code
  SELECT user_id INTO v_user_id
  FROM discord_link_codes
  WHERE code = UPPER(p_code) AND expires_at > NOW();

  IF v_user_id IS NOT NULL THEN
    -- Delete the used code
    DELETE FROM discord_link_codes WHERE code = UPPER(p_code);
  END IF;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at on discord_links
CREATE OR REPLACE FUNCTION update_discord_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discord_links_updated_at
  BEFORE UPDATE ON discord_links
  FOR EACH ROW
  EXECUTE FUNCTION update_discord_links_updated_at();

CREATE TRIGGER discord_guild_links_updated_at
  BEFORE UPDATE ON discord_guild_links
  FOR EACH ROW
  EXECUTE FUNCTION update_discord_links_updated_at();

-- ============================================
-- ADD DISCORD FIELDS TO PROFILES (if not exists)
-- ============================================

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

-- Index for Discord lookup on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_discord_id ON profiles(discord_id);

-- ============================================
-- CLEANUP JOB (Run periodically)
-- ============================================

-- Function to cleanup expired codes (call via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_discord_codes()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM discord_link_codes WHERE expires_at < NOW();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE discord_links IS 'Links Discord accounts to Squad Planner user profiles';
COMMENT ON TABLE discord_guild_links IS 'Links Discord servers to Squads for notifications';
COMMENT ON TABLE discord_link_codes IS 'Temporary codes for linking Discord accounts (10 min expiry)';
COMMENT ON TABLE session_reminders_sent IS 'Tracks sent reminders to prevent duplicates';
