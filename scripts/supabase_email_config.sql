-- ============================================================================
-- CONFIGURATION AUTH SUPABASE - DÉSACTIVATION COMPLÈTE DES EMAILS
-- Projet: cwtoprbowdqcemdjrtir
-- Date: 2026-01-28
-- ============================================================================
-- Ce script configure Supabase pour NE PAS envoyer d'emails en DEV
-- ============================================================================

-- ============================================================================
-- ÉTAPE 1: VÉRIFIER LA CONFIGURATION ACTUELLE
-- ============================================================================

-- Afficher les settings auth actuels (si accessible via SQL)
-- Note: La plupart des settings auth sont dans config.toml ou Dashboard

SELECT
  'auth.users' as table_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed,
  COUNT(*) FILTER (WHERE confirmation_token IS NOT NULL) as pending_confirmation,
  COUNT(*) FILTER (WHERE recovery_token IS NOT NULL) as pending_recovery
FROM auth.users;

-- ============================================================================
-- ÉTAPE 2: CRÉER UNE FONCTION POUR AUTO-CONFIRMER LES NOUVEAUX USERS
-- ============================================================================

-- Fonction trigger pour auto-confirmer les emails à la création
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirmer l'email immédiatement (pour DEV uniquement!)
  NEW.email_confirmed_at = NOW();
  NEW.confirmation_sent_at = NULL;
  NEW.confirmation_token = NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ÉTAPE 3: CRÉER UN TRIGGER SUR auth.users (si autorisé)
-- ============================================================================

-- Note: Cette approche peut ne pas fonctionner car auth.users est une table système
-- Alternative: Configurer via config.toml ou Dashboard Supabase

-- DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
-- CREATE TRIGGER auto_confirm_user_trigger
--   BEFORE INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.auto_confirm_user();

-- ============================================================================
-- ÉTAPE 4: CRÉER UNE TABLE DE LOGS POUR MONITORING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.email_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'email_change', 'password_recovery', 'email_sent')),
  email_address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'skipped', 'failed')),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour requêtes rapides
CREATE INDEX IF NOT EXISTS idx_email_monitoring_user ON public.email_monitoring(user_id);
CREATE INDEX IF NOT EXISTS idx_email_monitoring_status ON public.email_monitoring(status);
CREATE INDEX IF NOT EXISTS idx_email_monitoring_created ON public.email_monitoring(created_at DESC);

-- ============================================================================
-- ÉTAPE 5: FONCTION POUR LOGGER LES ÉVÉNEMENTS EMAIL
-- ============================================================================

CREATE OR REPLACE FUNCTION public.log_email_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_email TEXT,
  p_status TEXT,
  p_error TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.email_monitoring (user_id, event_type, email_address, status, error_message, metadata)
  VALUES (p_user_id, p_event_type, p_email, p_status, p_error, p_metadata)
  RETURNING id INTO event_id;

  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ÉTAPE 6: VIEW POUR MONITORING
-- ============================================================================

CREATE OR REPLACE VIEW public.email_monitoring_summary AS
SELECT
  DATE_TRUNC('day', created_at) as day,
  event_type,
  status,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.email_monitoring
GROUP BY DATE_TRUNC('day', created_at), event_type, status
ORDER BY day DESC, event_type, status;

-- ============================================================================
-- ÉTAPE 7: RLS POLICIES
-- ============================================================================

ALTER TABLE public.email_monitoring ENABLE ROW LEVEL SECURITY;

-- Policy: Admins peuvent tout voir
CREATE POLICY "Admins view all email logs"
  ON public.email_monitoring
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Policy: Users voient leurs propres logs
CREATE POLICY "Users view own email logs"
  ON public.email_monitoring
  FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- ÉTAPE 8: RAPPORT DE CONFIGURATION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ CONFIGURATION EMAIL COMPLÉTÉE';
  RAISE NOTICE '   ';
  RAISE NOTICE '📋 TABLES CRÉÉES:';
  RAISE NOTICE '   - public.email_monitoring (logs)';
  RAISE NOTICE '   - public.email_monitoring_summary (view)';
  RAISE NOTICE '   ';
  RAISE NOTICE '🔧 FONCTIONS CRÉÉES:';
  RAISE NOTICE '   - public.auto_confirm_user() (trigger helper)';
  RAISE NOTICE '   - public.log_email_event() (logging)';
  RAISE NOTICE '   ';
  RAISE NOTICE '⚠️  CONFIGURATION MANUELLE REQUISE:';
  RAISE NOTICE '   1. Dans supabase/config.toml:';
  RAISE NOTICE '      [auth.email]';
  RAISE NOTICE '      enable_confirmations = false';
  RAISE NOTICE '      enable_signup = true';
  RAISE NOTICE '   ';
  RAISE NOTICE '   2. Dans Dashboard Supabase (Authentication > Settings):';
  RAISE NOTICE '      - Enable email confirmations: OFF';
  RAISE NOTICE '      - Enable email change confirmations: OFF';
  RAISE NOTICE '   ';
  RAISE NOTICE '   3. Pour PRODUCTION, configurer SMTP:';
  RAISE NOTICE '      - Mailtrap (test): https://mailtrap.io';
  RAISE NOTICE '      - SendGrid (prod): https://sendgrid.com';
  RAISE NOTICE '      - Resend (moderne): https://resend.com';
END $$;
