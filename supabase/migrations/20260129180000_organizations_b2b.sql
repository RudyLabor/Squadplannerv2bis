-- Phase 4 B2B: Organizations & Multi-Squad Management
-- Migration: 20260129180000_organizations_b2b.sql
-- Complete B2B infrastructure for esport organizations

-- ============================================
-- 1. ORGANIZATIONS TABLE
-- ============================================

-- Drop existing if needed (development only)
DROP TABLE IF EXISTS organization_invites CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organization_squads CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  website TEXT,
  discord_server_id TEXT,
  -- Organization type
  type TEXT NOT NULL DEFAULT 'esport' CHECK (type IN ('esport', 'community', 'academy', 'content_creator', 'enterprise')),
  -- Plan & Limits
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
  max_squads INTEGER DEFAULT 3,
  max_members INTEGER DEFAULT 50,
  -- Branding (white-label for enterprise)
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#8b5cf6',
  custom_domain TEXT,
  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_created_by ON organizations(created_by);

-- ============================================
-- 2. ORGANIZATION MEMBERS (Multi-role)
-- ============================================

CREATE TYPE org_role AS ENUM ('owner', 'admin', 'manager', 'coach', 'player', 'staff');

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role org_role NOT NULL DEFAULT 'player',
  title TEXT, -- Custom title: "Head Coach", "Analyst", etc.
  department TEXT, -- "Valorant Division", "Content", etc.
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(role);

-- ============================================
-- 3. ORGANIZATION SQUADS (Hierarchy)
-- ============================================

CREATE TYPE squad_tier AS ENUM ('main', 'academy', 'content', 'casual');

CREATE TABLE organization_squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  tier squad_tier NOT NULL DEFAULT 'main',
  display_order INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, squad_id)
);

CREATE INDEX idx_org_squads_org ON organization_squads(organization_id);
CREATE INDEX idx_org_squads_squad ON organization_squads(squad_id);

-- ============================================
-- 4. ORGANIZATION INVITES
-- ============================================

CREATE TABLE organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role org_role NOT NULL DEFAULT 'player',
  invite_code TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_invites_code ON organization_invites(invite_code);
CREATE INDEX idx_org_invites_org ON organization_invites(organization_id);

-- ============================================
-- 5. ORGANIZATION ANALYTICS
-- ============================================

CREATE TABLE organization_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  -- Metrics
  total_members INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  total_squads INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_attendance INTEGER DEFAULT 0,
  avg_attendance_rate DECIMAL(5,2) DEFAULT 0,
  avg_reliability_score DECIMAL(5,2) DEFAULT 0,
  -- Growth
  new_members INTEGER DEFAULT 0,
  churned_members INTEGER DEFAULT 0,
  -- Engagement
  messages_count INTEGER DEFAULT 0,
  sessions_created INTEGER DEFAULT 0,
  check_ins_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, period_start, period_type)
);

CREATE INDEX idx_org_analytics_org ON organization_analytics(organization_id);
CREATE INDEX idx_org_analytics_period ON organization_analytics(period_start);

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Create organization
CREATE OR REPLACE FUNCTION create_organization(
  p_name TEXT,
  p_type TEXT DEFAULT 'esport',
  p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_slug TEXT;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Generate slug
  v_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := v_slug || '-' || substr(gen_random_uuid()::text, 1, 8);

  -- Create organization
  INSERT INTO organizations (name, slug, type, description, created_by)
  VALUES (p_name, v_slug, p_type, p_description, v_user_id)
  RETURNING id INTO v_org_id;

  -- Add creator as owner
  INSERT INTO organization_members (organization_id, user_id, role, title)
  VALUES (v_org_id, v_user_id, 'owner', 'Fondateur');

  RETURN v_org_id;
END;
$$;

-- Add squad to organization
CREATE OR REPLACE FUNCTION add_squad_to_organization(
  p_org_id UUID,
  p_squad_id UUID,
  p_tier squad_tier DEFAULT 'main'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_is_admin BOOLEAN;
  v_squad_count INTEGER;
  v_max_squads INTEGER;
BEGIN
  v_user_id := auth.uid();

  -- Check if user is org admin
  SELECT EXISTS(
    SELECT 1 FROM organization_members
    WHERE organization_id = p_org_id
      AND user_id = v_user_id
      AND role IN ('owner', 'admin', 'manager')
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Check squad limit
  SELECT COUNT(*), o.max_squads
  INTO v_squad_count, v_max_squads
  FROM organization_squads os
  JOIN organizations o ON o.id = os.organization_id
  WHERE os.organization_id = p_org_id
  GROUP BY o.max_squads;

  IF v_squad_count >= COALESCE(v_max_squads, 3) THEN
    RAISE EXCEPTION 'Squad limit reached for this organization plan';
  END IF;

  -- Add squad
  INSERT INTO organization_squads (organization_id, squad_id, tier, added_by)
  VALUES (p_org_id, p_squad_id, p_tier, v_user_id)
  ON CONFLICT (organization_id, squad_id) DO NOTHING;

  RETURN TRUE;
END;
$$;

-- Get organization stats
CREATE OR REPLACE FUNCTION get_organization_stats(p_org_id UUID)
RETURNS TABLE(
  total_squads INTEGER,
  total_members INTEGER,
  active_members INTEGER,
  total_sessions_this_month INTEGER,
  avg_attendance_rate DECIMAL,
  avg_reliability_score DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH org_squads AS (
    SELECT squad_id FROM organization_squads WHERE organization_id = p_org_id
  ),
  org_members AS (
    SELECT DISTINCT sm.user_id
    FROM squad_members sm
    JOIN org_squads os ON os.squad_id = sm.squad_id
  ),
  month_sessions AS (
    SELECT s.id, s.squad_id
    FROM sessions s
    JOIN org_squads os ON os.squad_id = s.squad_id
    WHERE s.scheduled_date >= date_trunc('month', CURRENT_DATE)
  )
  SELECT
    (SELECT COUNT(*)::INTEGER FROM org_squads),
    (SELECT COUNT(*)::INTEGER FROM org_members),
    (SELECT COUNT(*)::INTEGER FROM org_members om
     JOIN profiles p ON p.id = om.user_id
     WHERE p.last_active_at > NOW() - INTERVAL '7 days'),
    (SELECT COUNT(*)::INTEGER FROM month_sessions),
    COALESCE((SELECT AVG(p.reliability_score) FROM profiles p
              JOIN org_members om ON om.user_id = p.id), 0)::DECIMAL,
    COALESCE((SELECT AVG(p.reliability_score) FROM profiles p
              JOIN org_members om ON om.user_id = p.id), 0)::DECIMAL;
END;
$$;

-- Generate invite code
CREATE OR REPLACE FUNCTION generate_org_invite(
  p_org_id UUID,
  p_role org_role DEFAULT 'player',
  p_email TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code TEXT;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  -- Check permission
  IF NOT EXISTS(
    SELECT 1 FROM organization_members
    WHERE organization_id = p_org_id
      AND user_id = v_user_id
      AND role IN ('owner', 'admin', 'manager')
  ) THEN
    RAISE EXCEPTION 'Not authorized to create invites';
  END IF;

  -- Generate unique code
  v_code := 'org_' || encode(gen_random_bytes(12), 'base64');
  v_code := replace(replace(v_code, '+', 'x'), '/', 'y');

  INSERT INTO organization_invites (organization_id, email, role, invite_code, invited_by)
  VALUES (p_org_id, p_email, p_role, v_code, v_user_id);

  RETURN v_code;
END;
$$;

-- Accept invite
CREATE OR REPLACE FUNCTION accept_org_invite(p_code TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invite RECORD;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get invite
  SELECT * INTO v_invite
  FROM organization_invites
  WHERE invite_code = p_code
    AND accepted_at IS NULL
    AND expires_at > NOW();

  IF v_invite IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invite';
  END IF;

  -- Add member
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (v_invite.organization_id, v_user_id, v_invite.role)
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  -- Mark invite as used
  UPDATE organization_invites
  SET accepted_at = NOW()
  WHERE id = v_invite.id;

  RETURN v_invite.organization_id;
END;
$$;

-- ============================================
-- 7. RLS POLICIES
-- ============================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_analytics ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "View public organizations" ON organizations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Members can view their orgs" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can update their orgs" ON organizations
  FOR UPDATE USING (
    id IN (SELECT organization_id FROM organization_members
           WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

CREATE POLICY "Users can create orgs" ON organizations
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Organization members policies
CREATE POLICY "View org members" ON organization_members
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage members" ON organization_members
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM organization_members
                        WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Organization squads policies
CREATE POLICY "View org squads" ON organization_squads
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
    OR is_public = true
  );

CREATE POLICY "Managers can manage squads" ON organization_squads
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM organization_members
                        WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'manager'))
  );

-- Invites policies
CREATE POLICY "View own invites" ON organization_invites
  FOR SELECT USING (
    invited_by = auth.uid() OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can create invites" ON organization_invites
  FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM organization_members
                        WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'manager'))
  );

-- Analytics policies
CREATE POLICY "Members can view analytics" ON organization_analytics
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
  );

-- ============================================
-- 8. VIEWS
-- ============================================

CREATE OR REPLACE VIEW organization_dashboard AS
SELECT
  o.id,
  o.name,
  o.slug,
  o.logo_url,
  o.type,
  o.plan,
  o.is_verified,
  (SELECT COUNT(*) FROM organization_members om WHERE om.organization_id = o.id) AS member_count,
  (SELECT COUNT(*) FROM organization_squads os WHERE os.organization_id = o.id) AS squad_count,
  o.max_squads,
  o.max_members,
  o.created_at
FROM organizations o
WHERE o.is_active = true;

GRANT SELECT ON organization_dashboard TO authenticated;

-- ============================================
-- 9. TRIGGERS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_organization_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_organization_timestamp();

CREATE TRIGGER org_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION update_organization_timestamp();

COMMENT ON TABLE organizations IS 'B2B Organizations for esport teams and communities - Phase 4';
COMMENT ON TABLE organization_members IS 'Organization membership with roles';
COMMENT ON TABLE organization_squads IS 'Squads belonging to organizations with hierarchy';
