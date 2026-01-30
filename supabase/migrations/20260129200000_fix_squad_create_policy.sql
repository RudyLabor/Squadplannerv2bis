-- ============================================
-- FIX: Ajouter policy INSERT pour créer des squads
-- ============================================

-- Permettre aux utilisateurs authentifiés de créer des squads
DROP POLICY IF EXISTS "Authenticated users can create squads" ON squads;
CREATE POLICY "Authenticated users can create squads" ON squads
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Permettre aux propriétaires et membres de voir les squads
DROP POLICY IF EXISTS "Members can view their squads" ON squads;
DROP POLICY IF EXISTS "Members and creators can view squads" ON squads;
DROP POLICY IF EXISTS "Owners and members can view squads" ON squads;
CREATE POLICY "Owners and members can view squads" ON squads
  FOR SELECT USING (
    owner_id = auth.uid() OR
    id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
  );

-- Permettre au propriétaire de supprimer sa squad
DROP POLICY IF EXISTS "Creators can delete their squads" ON squads;
DROP POLICY IF EXISTS "Owners can delete their squads" ON squads;
CREATE POLICY "Owners can delete their squads" ON squads
  FOR DELETE USING (owner_id = auth.uid());

-- ============================================
-- FIX: Policy INSERT pour squad_members
-- ============================================

DROP POLICY IF EXISTS "Squad creators and admins can add members" ON squad_members;
DROP POLICY IF EXISTS "Squad owners and admins can add members" ON squad_members;
CREATE POLICY "Squad owners and admins can add members" ON squad_members
  FOR INSERT
  WITH CHECK (
    -- Le propriétaire de la squad peut ajouter des membres
    squad_id IN (SELECT id FROM squads WHERE owner_id = auth.uid())
    OR
    -- Les admins de la squad peuvent ajouter des membres
    squad_id IN (
      SELECT squad_id FROM squad_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
    OR
    -- L'utilisateur peut s'ajouter lui-même (rejoindre)
    user_id = auth.uid()
  );
