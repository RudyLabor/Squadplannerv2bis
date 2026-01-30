-- Fix infinite recursion in squad_members RLS policies
-- 30 Janvier 2026 - 20h00
--
-- PROBLÈME: La policy "Users can view squad members" fait une sous-requête
-- sur squad_members, ce qui crée une récursion infinie.
--
-- SOLUTION: Utiliser des policies simples sans sous-requêtes récursives

-- ============================================================================
-- ÉTAPE 1: Supprimer toutes les policies problématiques
-- ============================================================================

DROP POLICY IF EXISTS "Users can view squad members" ON squad_members;
DROP POLICY IF EXISTS "squad_members_select_policy" ON squad_members;
DROP POLICY IF EXISTS "Members can view squad members" ON squad_members;
DROP POLICY IF EXISTS "squad_members_insert_policy" ON squad_members;
DROP POLICY IF EXISTS "squad_members_delete_policy" ON squad_members;
DROP POLICY IF EXISTS "squad_members_update_policy" ON squad_members;

-- ============================================================================
-- ÉTAPE 2: Créer des policies SIMPLES sans récursion
-- ============================================================================

-- SELECT: Un utilisateur peut voir ses propres memberships
-- Pour voir les autres membres d'une squad, on passera par la table squads
CREATE POLICY "squad_members_select_own" ON squad_members
FOR SELECT USING (user_id = auth.uid());

-- SELECT: Voir les membres des squads dont on est owner
CREATE POLICY "squad_members_select_as_owner" ON squad_members
FOR SELECT USING (
  squad_id IN (SELECT id FROM squads WHERE owner_id = auth.uid())
);

-- INSERT: Seul le owner de la squad peut ajouter des membres
-- OU l'utilisateur peut s'ajouter lui-même (pour join via invite)
CREATE POLICY "squad_members_insert" ON squad_members
FOR INSERT WITH CHECK (
  user_id = auth.uid()
  OR squad_id IN (SELECT id FROM squads WHERE owner_id = auth.uid())
);

-- UPDATE: Seul le owner peut modifier les rôles
CREATE POLICY "squad_members_update" ON squad_members
FOR UPDATE USING (
  squad_id IN (SELECT id FROM squads WHERE owner_id = auth.uid())
);

-- DELETE: Un utilisateur peut quitter une squad (se supprimer)
-- OU le owner peut supprimer des membres
CREATE POLICY "squad_members_delete" ON squad_members
FOR DELETE USING (
  user_id = auth.uid()
  OR squad_id IN (SELECT id FROM squads WHERE owner_id = auth.uid())
);

-- ============================================================================
-- ÉTAPE 3: Vérifier que les policies squads sont correctes
-- ============================================================================

-- La policy squads SELECT ne doit PAS faire de sous-requête sur squad_members
-- car squad_members fait déjà référence à squads (pas de problème dans ce sens)
DROP POLICY IF EXISTS "Users can view their squads" ON squads;

CREATE POLICY "squads_select" ON squads
FOR SELECT USING (
  -- Owner peut toujours voir sa squad
  owner_id = auth.uid()
  -- Les squads publiques sont visibles
  OR is_public = true
  -- Les membres peuvent voir leur squad (via squad_members qui est safe maintenant)
  OR id IN (SELECT squad_id FROM squad_members WHERE user_id = auth.uid())
);

-- INSERT: Tout utilisateur authentifié peut créer une squad
DROP POLICY IF EXISTS "Users can create squads" ON squads;
DROP POLICY IF EXISTS "squads_insert" ON squads;

CREATE POLICY "squads_insert" ON squads
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- UPDATE: Seul le owner peut modifier sa squad
DROP POLICY IF EXISTS "Owners can update their squads" ON squads;
DROP POLICY IF EXISTS "squads_update" ON squads;

CREATE POLICY "squads_update" ON squads
FOR UPDATE USING (owner_id = auth.uid());

-- DELETE: Seul le owner peut supprimer sa squad
DROP POLICY IF EXISTS "Owners can delete their squads" ON squads;
DROP POLICY IF EXISTS "squads_delete" ON squads;

CREATE POLICY "squads_delete" ON squads
FOR DELETE USING (owner_id = auth.uid());
