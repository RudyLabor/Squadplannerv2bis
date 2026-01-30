-- ============================================================================
-- SUBSCRIPTIONS & FEATURE GATING
-- Phase 4: Monetization System
-- ============================================================================

-- Subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'paused');

-- User subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Subscription details
  tier subscription_tier DEFAULT 'free' NOT NULL,
  status subscription_status DEFAULT 'active' NOT NULL,

  -- Stripe integration
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,

  -- Billing
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Unique constraint per user
  UNIQUE(user_id)
);

-- Feature limits per tier
CREATE TABLE IF NOT EXISTS feature_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier subscription_tier NOT NULL UNIQUE,

  -- Squad limits
  max_squads INTEGER DEFAULT 1,
  max_members_per_squad INTEGER DEFAULT 10,

  -- Session limits
  max_sessions_per_month INTEGER DEFAULT 20,
  max_recurring_sessions INTEGER DEFAULT 0,

  -- History limits (days)
  history_days INTEGER DEFAULT 30,

  -- Features (boolean)
  has_advanced_stats BOOLEAN DEFAULT FALSE,
  has_ai_suggestions BOOLEAN DEFAULT FALSE,
  has_calendar_export BOOLEAN DEFAULT FALSE,
  has_discord_bot_advanced BOOLEAN DEFAULT FALSE,
  has_custom_roles BOOLEAN DEFAULT FALSE,
  has_webhooks BOOLEAN DEFAULT FALSE,
  has_api_access BOOLEAN DEFAULT FALSE,
  has_priority_support BOOLEAN DEFAULT FALSE,
  has_white_label BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert default feature limits
INSERT INTO feature_limits (tier, max_squads, max_members_per_squad, max_sessions_per_month, max_recurring_sessions, history_days, has_advanced_stats, has_ai_suggestions, has_calendar_export, has_discord_bot_advanced, has_custom_roles, has_webhooks, has_api_access, has_priority_support, has_white_label)
VALUES
  ('free', 1, 10, 20, 0, 30, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
  ('premium', 5, 25, 100, 3, 365, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE),
  ('pro', 20, 50, -1, 10, -1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE),
  ('enterprise', -1, -1, -1, -1, -1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (tier) DO UPDATE SET
  max_squads = EXCLUDED.max_squads,
  max_members_per_squad = EXCLUDED.max_members_per_squad,
  max_sessions_per_month = EXCLUDED.max_sessions_per_month,
  max_recurring_sessions = EXCLUDED.max_recurring_sessions,
  history_days = EXCLUDED.history_days,
  has_advanced_stats = EXCLUDED.has_advanced_stats,
  has_ai_suggestions = EXCLUDED.has_ai_suggestions,
  has_calendar_export = EXCLUDED.has_calendar_export,
  has_discord_bot_advanced = EXCLUDED.has_discord_bot_advanced,
  has_custom_roles = EXCLUDED.has_custom_roles,
  has_webhooks = EXCLUDED.has_webhooks,
  has_api_access = EXCLUDED.has_api_access,
  has_priority_support = EXCLUDED.has_priority_support,
  has_white_label = EXCLUDED.has_white_label;

-- Usage tracking per user (for limits)
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Current month usage
  period_start DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE NOT NULL,
  squads_created INTEGER DEFAULT 0,
  sessions_created INTEGER DEFAULT 0,
  recurring_sessions_created INTEGER DEFAULT 0,

  -- Unique per user per month
  UNIQUE(user_id, period_start)
);

-- Stripe webhook events log (for debugging)
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'processed'
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Get user's subscription tier
CREATE OR REPLACE FUNCTION get_user_tier(p_user_id UUID)
RETURNS subscription_tier AS $$
DECLARE
  v_tier subscription_tier;
BEGIN
  SELECT tier INTO v_tier
  FROM subscriptions
  WHERE user_id = p_user_id
    AND status IN ('active', 'trialing');

  RETURN COALESCE(v_tier, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's feature limits
CREATE OR REPLACE FUNCTION get_user_limits(p_user_id UUID)
RETURNS TABLE (
  tier subscription_tier,
  max_squads INTEGER,
  max_members_per_squad INTEGER,
  max_sessions_per_month INTEGER,
  max_recurring_sessions INTEGER,
  history_days INTEGER,
  has_advanced_stats BOOLEAN,
  has_ai_suggestions BOOLEAN,
  has_calendar_export BOOLEAN,
  has_discord_bot_advanced BOOLEAN,
  has_custom_roles BOOLEAN,
  has_webhooks BOOLEAN,
  has_api_access BOOLEAN,
  has_priority_support BOOLEAN,
  has_white_label BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fl.tier,
    fl.max_squads,
    fl.max_members_per_squad,
    fl.max_sessions_per_month,
    fl.max_recurring_sessions,
    fl.history_days,
    fl.has_advanced_stats,
    fl.has_ai_suggestions,
    fl.has_calendar_export,
    fl.has_discord_bot_advanced,
    fl.has_custom_roles,
    fl.has_webhooks,
    fl.has_api_access,
    fl.has_priority_support,
    fl.has_white_label
  FROM feature_limits fl
  WHERE fl.tier = get_user_tier(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can create a squad
CREATE OR REPLACE FUNCTION can_create_squad(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_max_squads INTEGER;
  v_current_squads INTEGER;
BEGIN
  -- Get max squads for user's tier
  SELECT max_squads INTO v_max_squads
  FROM feature_limits
  WHERE tier = get_user_tier(p_user_id);

  -- -1 means unlimited
  IF v_max_squads = -1 THEN
    RETURN TRUE;
  END IF;

  -- Count current squads where user is leader
  SELECT COUNT(*) INTO v_current_squads
  FROM squad_members
  WHERE user_id = p_user_id AND role = 'leader';

  RETURN v_current_squads < v_max_squads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user can create a session this month
CREATE OR REPLACE FUNCTION can_create_session(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_max_sessions INTEGER;
  v_current_sessions INTEGER;
BEGIN
  -- Get max sessions for user's tier
  SELECT max_sessions_per_month INTO v_max_sessions
  FROM feature_limits
  WHERE tier = get_user_tier(p_user_id);

  -- -1 means unlimited
  IF v_max_sessions = -1 THEN
    RETURN TRUE;
  END IF;

  -- Get current month usage
  SELECT sessions_created INTO v_current_sessions
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND period_start = DATE_TRUNC('month', CURRENT_DATE)::DATE;

  RETURN COALESCE(v_current_sessions, 0) < v_max_sessions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has a specific feature
CREATE OR REPLACE FUNCTION user_has_feature(p_user_id UUID, p_feature TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_feature BOOLEAN;
BEGIN
  EXECUTE format(
    'SELECT %I FROM feature_limits WHERE tier = get_user_tier($1)',
    'has_' || p_feature
  ) INTO v_has_feature USING p_user_id;

  RETURN COALESCE(v_has_feature, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment usage counter
CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID, p_field TEXT, p_amount INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, period_start)
  VALUES (p_user_id, DATE_TRUNC('month', CURRENT_DATE)::DATE)
  ON CONFLICT (user_id, period_start) DO NOTHING;

  EXECUTE format(
    'UPDATE usage_tracking SET %I = %I + $1 WHERE user_id = $2 AND period_start = $3',
    p_field, p_field
  ) USING p_amount, p_user_id, DATE_TRUNC('month', CURRENT_DATE)::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Subscriptions: users can only see their own
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Usage tracking: users can only see their own
CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Feature limits: everyone can read
CREATE POLICY "Anyone can view feature limits" ON feature_limits
  FOR SELECT USING (true);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period ON usage_tracking(user_id, period_start);
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_webhook_events(event_type);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-create free subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on profiles insert (new user)
DROP TRIGGER IF EXISTS on_profile_created_create_subscription ON profiles;
CREATE TRIGGER on_profile_created_create_subscription
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_subscription_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscription_updated ON subscriptions;
CREATE TRIGGER subscription_updated
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_timestamp();
