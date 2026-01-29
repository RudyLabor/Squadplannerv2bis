-- ============================================================================
-- SCRIPT D'URGENCE: NETTOYAGE EMAIL BOUNCES
-- Projet: cwtoprbowdqcemdjrtir
-- Date: 2026-01-28
-- ============================================================================
-- PROBLÈME: 151 comptes créés ont généré des tentatives d'email de confirmation
--           qui ont bounce (pas de SMTP configuré) → menace de restriction
-- ============================================================================

-- ============================================================================
-- ÉTAPE 1: NETTOYER L'HISTORIQUE DES EMAILS DANS auth.email_messages
-- ============================================================================

-- Vérifier combien d'emails ont bounce
SELECT
  COUNT(*) as total_emails,
  COUNT(*) FILTER (WHERE sent_at IS NULL) as pending_emails,
  COUNT(*) FILTER (WHERE sent_at IS NOT NULL AND error_message IS NOT NULL) as failed_emails
FROM auth.email_messages;

-- Supprimer TOUS les emails pending/failed (seulement en DEV!)
-- ATTENTION: Cette opération supprime l'historique d'emails
DELETE FROM auth.email_messages
WHERE sent_at IS NULL OR error_message IS NOT NULL;

-- Vérification post-nettoyage
SELECT
  COUNT(*) as remaining_emails
FROM auth.email_messages;

-- ============================================================================
-- ÉTAPE 2: METTRE À JOUR LES USERS POUR CONFIRMER LEURS EMAILS
-- ============================================================================

-- Tous les users créés en dev doivent avoir email_confirmed_at
-- Cela évite que Supabase tente d'envoyer des emails de confirmation

UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, created_at),
  confirmation_sent_at = NULL,
  confirmation_token = NULL,
  email_change = NULL,
  email_change_token_new = NULL,
  email_change_sent_at = NULL
WHERE email_confirmed_at IS NULL;

-- Vérification
SELECT
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed_users
FROM auth.users;

-- ============================================================================
-- ÉTAPE 3: NETTOYER LES TOKENS DE RÉCUPÉRATION
-- ============================================================================

-- Supprimer les recovery tokens qui peuvent déclencher des emails
UPDATE auth.users
SET
  recovery_token = NULL,
  recovery_sent_at = NULL
WHERE recovery_token IS NOT NULL;

-- ============================================================================
-- ÉTAPE 4: VÉRIFICATION FINALE
-- ============================================================================

-- Compter les emails restants
SELECT 'Email Messages' as table_name, COUNT(*) as count FROM auth.email_messages
UNION ALL
SELECT 'Unconfirmed Users' as table_name, COUNT(*) FROM auth.users WHERE email_confirmed_at IS NULL
UNION ALL
SELECT 'Pending Confirmations' as table_name, COUNT(*) FROM auth.users WHERE confirmation_token IS NOT NULL
UNION ALL
SELECT 'Pending Recovery' as table_name, COUNT(*) FROM auth.users WHERE recovery_token IS NOT NULL;

-- ============================================================================
-- RAPPORT
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ NETTOYAGE EMAIL BOUNCES TERMINÉ';
  RAISE NOTICE '   - Emails pending/failed supprimés';
  RAISE NOTICE '   - Users auto-confirmés';
  RAISE NOTICE '   - Tokens de récupération nettoyés';
  RAISE NOTICE '   ';
  RAISE NOTICE '⚠️  PROCHAINES ÉTAPES:';
  RAISE NOTICE '   1. Vérifier config.toml: enable_confirmations = false';
  RAISE NOTICE '   2. Redémarrer Supabase local: supabase stop && supabase start';
  RAISE NOTICE '   3. Pour production: configurer SMTP (Mailtrap/SendGrid)';
END $$;
