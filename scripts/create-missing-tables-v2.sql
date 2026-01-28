-- ============================================================================
-- CRÉER LES TABLES MANQUANTES PHASE 1 & 2 (Compatible PostgreSQL 11+)
-- ============================================================================

-- ============================================================================
-- PHASE 1: Table reliability_scores
-- ============================================================================
CREATE TABLE IF NOT EXISTS reliability_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,

  -- Score global
  score DECIMAL(5,2) NOT NULL DEFAULT 100.00 CHECK (score >= 0 AND score <= 100),

  -- Statistiques
  total_sessions INT NOT NULL DEFAULT 0,
  sessions_attended INT NOT NULL DEFAULT 0,
  sessions_late INT NOT NULL DEFAULT 0,
  sessions_no_show INT NOT NULL DEFAULT 0,

  -- Streak
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,

  -- Timestamps
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Contraintes
  UNIQUE(user_id, squad_id)
);

CREATE INDEX IF NOT EXISTS idx_reliability_user ON reliability_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_reliability_squad ON reliability_scores(squad_id);
CREATE INDEX IF NOT EXISTS idx_reliability_score ON reliability_scores(score DESC);

-- RLS
ALTER TABLE reliability_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View own reliability" ON reliability_scores;
CREATE POLICY "View own reliability" ON reliability_scores
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "View squad reliability" ON reliability_scores;
CREATE POLICY "View squad reliability" ON reliability_scores
  FOR SELECT USING (
    squad_id IN (
      SELECT squad_id FROM squad_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- PHASE 2: Table roles
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,

  -- Role info
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,

  -- Permissions
  is_admin BOOLEAN DEFAULT FALSE,
  can_manage_members BOOLEAN DEFAULT FALSE,
  can_create_sessions BOOLEAN DEFAULT FALSE,
  can_manage_sessions BOOLEAN DEFAULT FALSE,
  can_manage_roles BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contraintes
  UNIQUE(squad_id, name)
);

CREATE INDEX IF NOT EXISTS idx_roles_squad ON roles(squad_id);

-- RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View squad roles" ON roles;
CREATE POLICY "View squad roles" ON roles
  FOR SELECT USING (
    squad_id IN (
      SELECT squad_id FROM squad_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins manage roles" ON roles;
CREATE POLICY "Admins manage roles" ON roles
  FOR ALL USING (
    squad_id IN (
      SELECT sm.squad_id FROM squad_members sm
      INNER JOIN roles r ON r.squad_id = sm.squad_id
      WHERE sm.user_id = auth.uid() AND r.is_admin = TRUE
    )
  );

-- ============================================================================
-- PHASE 2: Table user_roles
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,

  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),

  UNIQUE(user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);

-- RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View own roles" ON user_roles;
CREATE POLICY "View own roles" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "View squad member roles" ON user_roles;
CREATE POLICY "View squad member roles" ON user_roles
  FOR SELECT USING (
    role_id IN (
      SELECT r.id FROM roles r
      INNER JOIN squad_members sm ON sm.squad_id = r.squad_id
      WHERE sm.user_id = auth.uid()
    )
  );

-- ============================================================================
-- PHASE 2: Table permissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permissions_category ON permissions(category);

-- RLS
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view permissions" ON permissions;
CREATE POLICY "Anyone can view permissions" ON permissions
  FOR SELECT USING (TRUE);

-- ============================================================================
-- PHASE 2: Table role_permissions
-- ============================================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,

  granted_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

-- RLS
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View role permissions for squad" ON role_permissions;
CREATE POLICY "View role permissions for squad" ON role_permissions
  FOR SELECT USING (
    role_id IN (
      SELECT r.id FROM roles r
      INNER JOIN squad_members sm ON sm.squad_id = r.squad_id
      WHERE sm.user_id = auth.uid()
    )
  );

-- ============================================================================
-- Seed permissions de base
-- ============================================================================
INSERT INTO permissions (name, description, category) VALUES
  ('manage_members', 'Gérer les membres du squad', 'members'),
  ('create_sessions', 'Créer des sessions', 'sessions'),
  ('manage_sessions', 'Modifier/Supprimer des sessions', 'sessions'),
  ('manage_roles', 'Gérer les rôles et permissions', 'administration'),
  ('view_analytics', 'Voir les statistiques du squad', 'analytics'),
  ('manage_squad', 'Gérer les paramètres du squad', 'administration')
ON CONFLICT (name) DO NOTHING;
