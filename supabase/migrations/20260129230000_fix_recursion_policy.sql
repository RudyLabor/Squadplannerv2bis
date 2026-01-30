-- ============================================
-- FIX: Corriger la récursion infinie dans squad_members
-- ============================================

-- Supprimer les policies problématiques
DROP POLICY IF EXISTS "Members can view squad members" ON squad_members;
DROP POLICY IF EXISTS "Users can add themselves or owners can add members" ON squad_members;
DROP POLICY IF EXISTS "Admins can update members" ON squad_members;
DROP POLICY IF EXISTS "Members can leave or admins can remove" ON squad_members;

-- Créer une fonction helper pour éviter la récursion
CREATE OR REPLACE FUNCTION public.get_user_squad_ids(user_uuid UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT squad_id FROM squad_members WHERE user_id = user_uuid;
$$;

-- Créer une fonction pour vérifier si l'utilisateur est admin d'une squad
CREATE OR REPLACE FUNCTION public.is_squad_admin(user_uuid UUID, squad_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM squad_members
    WHERE user_id = user_uuid
    AND squad_id = squad_uuid
    AND role IN ('owner', 'admin')
  );
$$;

-- Créer une fonction pour vérifier si l'utilisateur est le propriétaire de la squad
CREATE OR REPLACE FUNCTION public.is_squad_owner(user_uuid UUID, squad_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM squads WHERE id = squad_uuid AND owner_id = user_uuid
  );
$$;

-- SELECT: Voir les membres de ses propres squads
CREATE POLICY "View squad members" ON squad_members
  FOR SELECT USING (
    squad_id IN (SELECT public.get_user_squad_ids(auth.uid()))
    OR public.is_squad_owner(auth.uid(), squad_id)
  );

-- INSERT: S'ajouter soi-même ou le propriétaire peut ajouter
CREATE POLICY "Add squad members" ON squad_members
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR public.is_squad_owner(auth.uid(), squad_id)
  );

-- UPDATE: Seuls les admins peuvent modifier
CREATE POLICY "Update squad members" ON squad_members
  FOR UPDATE USING (
    public.is_squad_admin(auth.uid(), squad_id)
  );

-- DELETE: Se retirer soi-même ou admin peut retirer
CREATE POLICY "Delete squad members" ON squad_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR public.is_squad_admin(auth.uid(), squad_id)
  );
