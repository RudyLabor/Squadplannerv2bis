-- Fix RLS policies pour squads et squad_members
-- 30 Janvier 2026

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Members can view their squads" ON squads;
DROP POLICY IF EXISTS "Users can view their squads" ON squads;

-- Nouvelle policy pour squads
CREATE POLICY "Users can view their squads" ON squads
FOR SELECT USING (
  owner_id = auth.uid()
  OR is_public = true
  OR id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
);

-- Supprimer anciennes policies squad_members
DROP POLICY IF EXISTS "squad_members_select_policy" ON squad_members;
DROP POLICY IF EXISTS "Users can view squad members" ON squad_members;
DROP POLICY IF EXISTS "Members can view squad members" ON squad_members;
DROP POLICY IF EXISTS "Users can see their own memberships" ON squad_members;

-- Nouvelle policy pour squad_members
CREATE POLICY "Users can view squad members" ON squad_members
FOR SELECT USING (
  user_id = auth.uid()
  OR squad_id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
);
