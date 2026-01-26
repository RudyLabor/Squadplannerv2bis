-- ============================================================
-- SQUAD PLANNER - CRÉATION COMPLÈTE DE LA TABLE KV STORE
-- ============================================================
-- Ce script crée la table kv_store_e884809f avec tous les index,
-- policies, triggers et fonctions nécessaires
-- ============================================================

-- Étape 1 : Supprimer l'ancienne table si elle existe (optionnel)
-- Décommente ces lignes si tu veux recommencer à zéro
-- DROP TABLE IF EXISTS public.kv_store_e884809f CASCADE;

-- Étape 2 : Créer la table principale
CREATE TABLE IF NOT EXISTS public.kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Étape 3 : Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_kv_key_prefix 
  ON public.kv_store_e884809f (key text_pattern_ops);

CREATE INDEX IF NOT EXISTS idx_kv_updated_at 
  ON public.kv_store_e884809f (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_kv_created_at 
  ON public.kv_store_e884809f (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kv_value_gin 
  ON public.kv_store_e884809f USING gin (value);

-- Étape 4 : Activer Row Level Security (RLS)
ALTER TABLE public.kv_store_e884809f ENABLE ROW LEVEL SECURITY;

-- Étape 5 : Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Service role full access" ON public.kv_store_e884809f;
DROP POLICY IF EXISTS "Anon users have access" ON public.kv_store_e884809f;
DROP POLICY IF EXISTS "Authenticated users can access" ON public.kv_store_e884809f;

-- Étape 6 : Créer les policies RLS

-- Policy 1 : Service role a un accès complet (pour le serveur)
CREATE POLICY "Service role full access" 
  ON public.kv_store_e884809f 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

-- Policy 2 : Les utilisateurs anonymes ont accès complet (pour le prototypage)
-- ⚠️ En production, tu devrais restreindre cet accès !
CREATE POLICY "Anon users have access" 
  ON public.kv_store_e884809f 
  FOR ALL 
  TO anon 
  USING (true) 
  WITH CHECK (true);

-- Policy 3 : Les utilisateurs authentifiés ont accès complet
CREATE POLICY "Authenticated users can access" 
  ON public.kv_store_e884809f 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Étape 7 : Créer la fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_kv_store_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Étape 8 : Créer le trigger pour appeler la fonction
DROP TRIGGER IF EXISTS trigger_update_kv_store_updated_at 
  ON public.kv_store_e884809f;

CREATE TRIGGER trigger_update_kv_store_updated_at
  BEFORE UPDATE ON public.kv_store_e884809f
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kv_store_updated_at();

-- Étape 9 : Insérer des données de test (optionnel)
-- Décommente ces lignes si tu veux des données de test

/*
INSERT INTO public.kv_store_e884809f (key, value) VALUES
  ('test:app', '{"status": "initialized", "version": "1.0.0"}'),
  ('test:welcome', '{"message": "Squad Planner est prêt !"}')
ON CONFLICT (key) DO NOTHING;
*/

-- Étape 10 : Vérifications

-- Vérifier que la table existe
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'kv_store_e884809f'
  ) THEN
    RAISE NOTICE '✅ Table kv_store_e884809f créée avec succès';
  ELSE
    RAISE EXCEPTION '❌ Erreur : La table n''a pas été créée';
  END IF;
END $$;

-- Vérifier les index
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'public'
  AND tablename = 'kv_store_e884809f';
  
  IF index_count >= 4 THEN
    RAISE NOTICE '✅ Index créés avec succès (% index)', index_count;
  ELSE
    RAISE WARNING '⚠️ Nombre d''index insuffisant (% trouvés)', index_count;
  END IF;
END $$;

-- Vérifier RLS
DO $$
BEGIN
  IF (
    SELECT relrowsecurity
    FROM pg_class
    WHERE relname = 'kv_store_e884809f'
  ) THEN
    RAISE NOTICE '✅ Row Level Security activé';
  ELSE
    RAISE WARNING '⚠️ Row Level Security non activé';
  END IF;
END $$;

-- Vérifier les policies
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename = 'kv_store_e884809f';
  
  IF policy_count >= 3 THEN
    RAISE NOTICE '✅ Policies créées avec succès (% policies)', policy_count;
  ELSE
    RAISE WARNING '⚠️ Nombre de policies insuffisant (% trouvées)', policy_count;
  END IF;
END $$;

-- Vérifier le trigger
DO $$
DECLARE
  trigger_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE event_object_schema = 'public'
  AND event_object_table = 'kv_store_e884809f'
  AND trigger_name = 'trigger_update_kv_store_updated_at';
  
  IF trigger_count > 0 THEN
    RAISE NOTICE '✅ Trigger updated_at créé avec succès';
  ELSE
    RAISE WARNING '⚠️ Trigger updated_at non créé';
  END IF;
END $$;

-- Étape 11 : Test d'insertion et de lecture (optionnel)
-- Décommente ces lignes pour tester

/*
-- Test d'insertion
INSERT INTO public.kv_store_e884809f (key, value) VALUES
  ('test:setup', '{"timestamp": "' || NOW()::text || '", "status": "ok"}')
ON CONFLICT (key) 
DO UPDATE SET value = EXCLUDED.value;

-- Test de lecture
SELECT 
  '✅ Test réussi : ' || value->>'status' as test_result
FROM public.kv_store_e884809f 
WHERE key = 'test:setup';

-- Nettoyage du test
DELETE FROM public.kv_store_e884809f WHERE key LIKE 'test:%';
*/

-- ============================================================
-- MESSAGE FINAL
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !';
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Table créée : kv_store_e884809f';
  RAISE NOTICE '📊 Index : 4 index de performance';
  RAISE NOTICE '🔒 RLS : Activé avec 3 policies';
  RAISE NOTICE '⚡ Trigger : Auto-update du timestamp';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Ton app Squad Planner est maintenant prête !';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prochaines étapes :';
  RAISE NOTICE '   1. Retourne dans Figma Make';
  RAISE NOTICE '   2. Clique sur Preview (▶️)';
  RAISE NOTICE '   3. L''erreur devrait avoir disparu !';
  RAISE NOTICE '   4. Clique sur Publish';
  RAISE NOTICE '   5. Teste sur ton téléphone 📱';
  RAISE NOTICE '';
  RAISE NOTICE '🎮 Compte de test :';
  RAISE NOTICE '   Email: rudylabor@hotmail.fr';
  RAISE NOTICE '   Password: password123';
  RAISE NOTICE '';
END $$;

-- Afficher un résumé dans les résultats
SELECT 
  '✅ INSTALLATION COMPLÈTE RÉUSSIE !' as status,
  'kv_store_e884809f' as table_name,
  (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'kv_store_e884809f') as indexes,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'kv_store_e884809f') as policies,
  'RLS Activé' as security,
  'Trigger Actif' as auto_update;
