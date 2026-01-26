-- ============================================================
-- SQUAD PLANNER - CRÉATION SIMPLE DE LA TABLE (VERSION RAPIDE)
-- ============================================================
-- Copie tout ce fichier et exécute-le dans Supabase SQL Editor
-- ============================================================

-- Créer la table
CREATE TABLE IF NOT EXISTS public.kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_kv_key_prefix ON public.kv_store_e884809f (key text_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_kv_updated_at ON public.kv_store_e884809f (updated_at DESC);

-- Activer RLS
ALTER TABLE public.kv_store_e884809f ENABLE ROW LEVEL SECURITY;

-- Supprimer anciennes policies
DROP POLICY IF EXISTS "Service role full access" ON public.kv_store_e884809f;
DROP POLICY IF EXISTS "Anon users have access" ON public.kv_store_e884809f;

-- Créer les policies
CREATE POLICY "Service role full access" ON public.kv_store_e884809f
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Anon users have access" ON public.kv_store_e884809f
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Message de succès
SELECT '✅ Table kv_store_e884809f créée avec succès !' as status;
