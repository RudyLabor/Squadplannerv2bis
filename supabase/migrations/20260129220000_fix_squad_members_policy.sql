-- ============================================
-- FIX: Policies complètes pour squad_members
-- ============================================

-- SELECT: Les membres peuvent voir les autres membres de leurs squads
DROP POLICY IF EXISTS "Members can view squad members" ON squad_members;
CREATE POLICY "Members can view squad members" ON squad_members
  FOR SELECT USING (
    squad_id IN (
      SELECT squad_id FROM squad_members WHERE user_id = auth.uid()
    )
    OR
    squad_id IN (
      SELECT id FROM squads WHERE owner_id = auth.uid()
    )
  );

-- INSERT: Permettre au propriétaire de la squad ET à l'utilisateur de s'ajouter lui-même
DROP POLICY IF EXISTS "Squad owners and admins can add members" ON squad_members;
DROP POLICY IF EXISTS "Users can add themselves as members" ON squad_members;
CREATE POLICY "Users can add themselves or owners can add members" ON squad_members
  FOR INSERT
  WITH CHECK (
    -- L'utilisateur peut s'ajouter lui-même
    user_id = auth.uid()
    OR
    -- Le propriétaire de la squad peut ajouter n'importe qui
    squad_id IN (SELECT id FROM squads WHERE owner_id = auth.uid())
  );

-- UPDATE: Seuls les admins/owners peuvent modifier les membres
DROP POLICY IF EXISTS "Admins can update members" ON squad_members;
CREATE POLICY "Admins can update members" ON squad_members
  FOR UPDATE USING (
    squad_id IN (
      SELECT squad_id FROM squad_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- DELETE: Les membres peuvent se retirer eux-mêmes, les admins peuvent retirer n'importe qui
DROP POLICY IF EXISTS "Members can leave or admins can remove" ON squad_members;
CREATE POLICY "Members can leave or admins can remove" ON squad_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR
    squad_id IN (
      SELECT squad_id FROM squad_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
