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
