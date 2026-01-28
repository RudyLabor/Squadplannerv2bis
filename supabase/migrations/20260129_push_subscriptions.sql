-- ============================================
-- PUSH SUBSCRIPTIONS TABLE
-- Phase 0: Web Push Notifications Support
-- ============================================

-- Table pour stocker les subscriptions Web Push
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

-- Index pour recherche rapide par user_id
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active) WHERE is_active = TRUE;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own push subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own subscriptions
CREATE POLICY "Users can update own push subscriptions"
  ON push_subscriptions FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- TRIGGER: Updated_at automatique
-- ============================================

CREATE OR REPLACE FUNCTION update_push_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_push_subscription_updated_at();

-- ============================================
-- TABLE: Notification Preferences (extend profiles or create separate)
-- ============================================

-- Ajouter colonnes de préférences notifications à profiles (if not exists)
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

-- ============================================
-- TABLE: Notification Log (pour debugging et analytics)
-- ============================================

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

-- RLS pour notification_logs (lecture seule pour les users)
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification logs"
  ON notification_logs FOR SELECT
  USING (user_id = auth.uid());

-- ============================================
-- FUNCTION: Send Push Notification (callable from Edge Function)
-- ============================================

CREATE OR REPLACE FUNCTION get_user_push_subscriptions(p_user_id UUID)
RETURNS TABLE (
  endpoint TEXT,
  p256dh_key TEXT,
  auth_key TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ps.endpoint,
    ps.p256dh_key,
    ps.auth_key
  FROM push_subscriptions ps
  WHERE ps.user_id = p_user_id
    AND ps.is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Get users to notify for a session
-- ============================================

CREATE OR REPLACE FUNCTION get_session_notification_targets(
  p_session_id UUID,
  p_reminder_type TEXT -- 'h24', 'h1', 'h10m'
)
RETURNS TABLE (
  user_id UUID,
  endpoint TEXT,
  p256dh_key TEXT,
  auth_key TEXT,
  display_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ps.user_id,
    ps.endpoint,
    ps.p256dh_key,
    ps.auth_key,
    p.display_name
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

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE push_subscriptions IS 'Stores Web Push subscription data for each user device';
COMMENT ON TABLE notification_logs IS 'Logs all notifications sent for debugging and analytics';
COMMENT ON FUNCTION get_user_push_subscriptions IS 'Returns active push subscriptions for a user';
COMMENT ON FUNCTION get_session_notification_targets IS 'Returns users to notify for a session reminder';
