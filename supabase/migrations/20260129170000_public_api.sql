-- Phase 5: Public API Infrastructure
-- Migration: 20260129170000_public_api.sql
-- Creates API keys, rate limiting, and webhook management

-- ============================================
-- 1. API KEYS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL, -- Store hashed API key
  key_prefix TEXT NOT NULL, -- First 8 chars for display (sk_live_abc...)
  permissions TEXT[] DEFAULT ARRAY['read']::TEXT[], -- read, write, delete, admin
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_day INTEGER DEFAULT 10000,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast key lookup
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- ============================================
-- 2. API USAGE TRACKING (Rate Limiting)
-- ============================================

CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  request_body JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_api_usage_key_time ON api_usage(api_key_id, created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);

-- ============================================
-- 3. WEBHOOKS TABLE (Persistent)
-- ============================================

CREATE TABLE IF NOT EXISTS user_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE, -- Optional: squad-specific webhook
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT, -- For signature verification
  events TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  timeout_seconds INTEGER DEFAULT 30,
  last_triggered_at TIMESTAMPTZ,
  last_status_code INTEGER,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_webhooks_user_id ON user_webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_webhooks_squad_id ON user_webhooks(squad_id);

-- ============================================
-- 4. WEBHOOK DELIVERY LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES user_webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, success, failed, retrying
  status_code INTEGER,
  response_body TEXT,
  attempt_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);

-- ============================================
-- 5. API KEY FUNCTIONS
-- ============================================

-- Generate a new API key (returns the full key only once)
CREATE OR REPLACE FUNCTION generate_api_key(
  p_user_id UUID,
  p_name TEXT,
  p_permissions TEXT[] DEFAULT ARRAY['read']::TEXT[],
  p_rate_limit_per_minute INTEGER DEFAULT 60
)
RETURNS TABLE(api_key TEXT, key_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_raw_key TEXT;
  v_key_hash TEXT;
  v_key_prefix TEXT;
  v_key_id UUID;
BEGIN
  -- Generate random key: sk_live_ + 32 random chars
  v_raw_key := 'sk_live_' || encode(gen_random_bytes(24), 'base64');
  v_raw_key := replace(replace(v_raw_key, '+', 'x'), '/', 'y'); -- Make URL-safe

  -- Hash the key for storage
  v_key_hash := encode(sha256(v_raw_key::bytea), 'hex');

  -- Store prefix for display
  v_key_prefix := substring(v_raw_key from 1 for 12);

  -- Insert the key
  INSERT INTO api_keys (user_id, name, key_hash, key_prefix, permissions, rate_limit_per_minute)
  VALUES (p_user_id, p_name, v_key_hash, v_key_prefix, p_permissions, p_rate_limit_per_minute)
  RETURNING id INTO v_key_id;

  RETURN QUERY SELECT v_raw_key AS api_key, v_key_id AS key_id;
END;
$$;

-- Validate API key and get user info
CREATE OR REPLACE FUNCTION validate_api_key(p_api_key TEXT)
RETURNS TABLE(
  user_id UUID,
  key_id UUID,
  permissions TEXT[],
  rate_limit_per_minute INTEGER,
  rate_limit_per_day INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_key_hash TEXT;
BEGIN
  v_key_hash := encode(sha256(p_api_key::bytea), 'hex');

  RETURN QUERY
  SELECT
    ak.user_id,
    ak.id AS key_id,
    ak.permissions,
    ak.rate_limit_per_minute,
    ak.rate_limit_per_day
  FROM api_keys ak
  WHERE ak.key_hash = v_key_hash
    AND ak.is_active = true
    AND (ak.expires_at IS NULL OR ak.expires_at > NOW());
END;
$$;

-- Check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(p_key_id UUID)
RETURNS TABLE(
  allowed BOOLEAN,
  requests_this_minute INTEGER,
  requests_today INTEGER,
  limit_per_minute INTEGER,
  limit_per_day INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_minute_count INTEGER;
  v_day_count INTEGER;
  v_limit_minute INTEGER;
  v_limit_day INTEGER;
BEGIN
  -- Get limits
  SELECT rate_limit_per_minute, rate_limit_per_day
  INTO v_limit_minute, v_limit_day
  FROM api_keys WHERE id = p_key_id;

  -- Count requests in last minute
  SELECT COUNT(*)
  INTO v_minute_count
  FROM api_usage
  WHERE api_key_id = p_key_id
    AND created_at > NOW() - INTERVAL '1 minute';

  -- Count requests today
  SELECT COUNT(*)
  INTO v_day_count
  FROM api_usage
  WHERE api_key_id = p_key_id
    AND created_at > CURRENT_DATE;

  RETURN QUERY SELECT
    (v_minute_count < v_limit_minute AND v_day_count < v_limit_day) AS allowed,
    v_minute_count AS requests_this_minute,
    v_day_count AS requests_today,
    v_limit_minute AS limit_per_minute,
    v_limit_day AS limit_per_day;
END;
$$;

-- Log API usage
CREATE OR REPLACE FUNCTION log_api_usage(
  p_key_id UUID,
  p_endpoint TEXT,
  p_method TEXT,
  p_status_code INTEGER DEFAULT NULL,
  p_response_time_ms INTEGER DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO api_usage (api_key_id, endpoint, method, status_code, response_time_ms, ip_address)
  VALUES (p_key_id, p_endpoint, p_method, p_status_code, p_response_time_ms, p_ip_address);

  -- Update last_used_at on api_key
  UPDATE api_keys SET last_used_at = NOW() WHERE id = p_key_id;
END;
$$;

-- ============================================
-- 6. WEBHOOK FUNCTIONS
-- ============================================

-- Create webhook
CREATE OR REPLACE FUNCTION create_user_webhook(
  p_user_id UUID,
  p_name TEXT,
  p_url TEXT,
  p_events TEXT[],
  p_squad_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_webhook_id UUID;
  v_secret TEXT;
BEGIN
  -- Generate webhook secret
  v_secret := 'whsec_' || encode(gen_random_bytes(24), 'base64');
  v_secret := replace(replace(v_secret, '+', 'x'), '/', 'y');

  INSERT INTO user_webhooks (user_id, squad_id, name, url, secret, events)
  VALUES (p_user_id, p_squad_id, p_name, p_url, v_secret, p_events)
  RETURNING id INTO v_webhook_id;

  RETURN v_webhook_id;
END;
$$;

-- Queue webhook delivery
CREATE OR REPLACE FUNCTION queue_webhook_delivery(
  p_event_type TEXT,
  p_payload JSONB,
  p_user_id UUID DEFAULT NULL,
  p_squad_id UUID DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_webhook RECORD;
  v_count INTEGER := 0;
BEGIN
  FOR v_webhook IN
    SELECT id FROM user_webhooks
    WHERE is_active = true
      AND p_event_type = ANY(events)
      AND (p_user_id IS NULL OR user_id = p_user_id)
      AND (p_squad_id IS NULL OR squad_id = p_squad_id OR squad_id IS NULL)
  LOOP
    INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status)
    VALUES (v_webhook.id, p_event_type, p_payload, 'pending');

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

-- ============================================
-- 7. RLS POLICIES
-- ============================================

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- API Keys policies
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own API keys" ON api_keys
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (user_id = auth.uid());

-- API Usage policies
CREATE POLICY "Users can view own API usage" ON api_usage
  FOR SELECT USING (
    api_key_id IN (SELECT id FROM api_keys WHERE user_id = auth.uid())
  );

-- Webhooks policies
CREATE POLICY "Users can view own webhooks" ON user_webhooks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own webhooks" ON user_webhooks
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own webhooks" ON user_webhooks
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own webhooks" ON user_webhooks
  FOR DELETE USING (user_id = auth.uid());

-- Webhook deliveries policies
CREATE POLICY "Users can view own webhook deliveries" ON webhook_deliveries
  FOR SELECT USING (
    webhook_id IN (SELECT id FROM user_webhooks WHERE user_id = auth.uid())
  );

-- ============================================
-- 8. CLEANUP JOB (for old usage data)
-- ============================================

-- Function to clean up old API usage data (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_api_usage()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM api_usage
  WHERE created_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  DELETE FROM webhook_deliveries
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND status IN ('success', 'failed');

  RETURN v_deleted;
END;
$$;

-- ============================================
-- 9. API STATS VIEW
-- ============================================

CREATE OR REPLACE VIEW api_key_stats AS
SELECT
  ak.id AS key_id,
  ak.user_id,
  ak.name,
  ak.key_prefix,
  ak.is_active,
  ak.rate_limit_per_minute,
  ak.rate_limit_per_day,
  ak.last_used_at,
  ak.created_at,
  COALESCE(stats.total_requests, 0) AS total_requests,
  COALESCE(stats.requests_today, 0) AS requests_today,
  COALESCE(stats.avg_response_time, 0) AS avg_response_time_ms
FROM api_keys ak
LEFT JOIN (
  SELECT
    api_key_id,
    COUNT(*) AS total_requests,
    COUNT(*) FILTER (WHERE created_at > CURRENT_DATE) AS requests_today,
    AVG(response_time_ms) AS avg_response_time
  FROM api_usage
  GROUP BY api_key_id
) stats ON stats.api_key_id = ak.id;

-- Grant access to view
GRANT SELECT ON api_key_stats TO authenticated;

COMMENT ON TABLE api_keys IS 'Public API keys for external integrations - Phase 5';
COMMENT ON TABLE user_webhooks IS 'User-configured webhooks for event notifications - Phase 5';
