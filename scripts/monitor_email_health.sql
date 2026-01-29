-- ============================================================================
-- SCRIPT DE MONITORING - SANTÉ DES EMAILS
-- Projet: cwtoprbowdqcemdjrtir
-- Date: 2026-01-28
-- ============================================================================
-- Exécuter ce script régulièrement pour surveiller l'état des emails
-- ============================================================================

-- ============================================================================
-- FONCTION: Vérifier la santé des emails
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_email_health()
RETURNS TABLE(
  metric TEXT,
  value BIGINT,
  status TEXT,
  message TEXT
) AS $$
DECLARE
  total_users BIGINT;
  unconfirmed_users BIGINT;
  pending_confirmations BIGINT;
  pending_recovery BIGINT;
  total_emails BIGINT;
  failed_emails BIGINT;
  recent_failed BIGINT;
BEGIN
  -- Compter les métriques
  SELECT COUNT(*) INTO total_users FROM auth.users;
  SELECT COUNT(*) INTO unconfirmed_users FROM auth.users WHERE email_confirmed_at IS NULL;
  SELECT COUNT(*) INTO pending_confirmations FROM auth.users WHERE confirmation_token IS NOT NULL;
  SELECT COUNT(*) INTO pending_recovery FROM auth.users WHERE recovery_token IS NOT NULL;

  -- Emails (peut échouer si pas d'accès à auth.email_messages)
  BEGIN
    SELECT COUNT(*) INTO total_emails FROM auth.email_messages;
    SELECT COUNT(*) INTO failed_emails FROM auth.email_messages WHERE error_message IS NOT NULL;
    SELECT COUNT(*) INTO recent_failed FROM auth.email_messages
    WHERE error_message IS NOT NULL AND created_at >= NOW() - INTERVAL '24 hours';
  EXCEPTION WHEN OTHERS THEN
    total_emails := 0;
    failed_emails := 0;
    recent_failed := 0;
  END;

  -- Retourner les métriques avec statut
  RETURN QUERY
  SELECT
    'Total Users'::TEXT,
    total_users,
    CASE WHEN total_users > 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
    total_users::TEXT || ' users registered'::TEXT;

  RETURN QUERY
  SELECT
    'Unconfirmed Users'::TEXT,
    unconfirmed_users,
    CASE WHEN unconfirmed_users = 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
    CASE
      WHEN unconfirmed_users = 0 THEN 'All users confirmed'
      ELSE unconfirmed_users::TEXT || ' users need confirmation'
    END::TEXT;

  RETURN QUERY
  SELECT
    'Pending Confirmations'::TEXT,
    pending_confirmations,
    CASE WHEN pending_confirmations = 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
    CASE
      WHEN pending_confirmations = 0 THEN 'No pending confirmations'
      ELSE pending_confirmations::TEXT || ' confirmation tokens active'
    END::TEXT;

  RETURN QUERY
  SELECT
    'Pending Recovery'::TEXT,
    pending_recovery,
    CASE WHEN pending_recovery = 0 THEN 'OK' ELSE 'INFO' END::TEXT,
    CASE
      WHEN pending_recovery = 0 THEN 'No pending password recovery'
      ELSE pending_recovery::TEXT || ' recovery tokens active'
    END::TEXT;

  RETURN QUERY
  SELECT
    'Total Emails Sent'::TEXT,
    total_emails,
    'INFO'::TEXT,
    total_emails::TEXT || ' emails in history'::TEXT;

  RETURN QUERY
  SELECT
    'Failed Emails (All Time)'::TEXT,
    failed_emails,
    CASE WHEN failed_emails = 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
    CASE
      WHEN failed_emails = 0 THEN 'No failed emails'
      ELSE failed_emails::TEXT || ' failed emails detected'
    END::TEXT;

  RETURN QUERY
  SELECT
    'Failed Emails (24h)'::TEXT,
    recent_failed,
    CASE WHEN recent_failed = 0 THEN 'OK' ELSE 'CRITICAL' END::TEXT,
    CASE
      WHEN recent_failed = 0 THEN 'No recent failures'
      ELSE recent_failed::TEXT || ' emails failed in last 24h - ACTION REQUIRED'
    END::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FONCTION: Obtenir les détails des emails failed
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_failed_emails(limit_rows INT DEFAULT 10)
RETURNS TABLE(
  email TEXT,
  error TEXT,
  created_at TIMESTAMPTZ,
  user_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    em.to_email::TEXT,
    em.error_message::TEXT,
    em.created_at,
    em.user_id
  FROM auth.email_messages em
  WHERE em.error_message IS NOT NULL
  ORDER BY em.created_at DESC
  LIMIT limit_rows;
EXCEPTION WHEN OTHERS THEN
  -- Si pas d'accès à auth.email_messages
  RAISE NOTICE 'Cannot access auth.email_messages table';
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FONCTION: Alert si bounce rate élevé
-- ============================================================================

CREATE OR REPLACE FUNCTION public.alert_high_bounce_rate(threshold_percent FLOAT DEFAULT 5.0)
RETURNS TABLE(
  alert_level TEXT,
  bounce_rate FLOAT,
  total_emails BIGINT,
  failed_emails BIGINT,
  message TEXT
) AS $$
DECLARE
  v_total BIGINT;
  v_failed BIGINT;
  v_rate FLOAT;
BEGIN
  -- Compter emails des dernières 24h
  BEGIN
    SELECT COUNT(*) INTO v_total FROM auth.email_messages WHERE created_at >= NOW() - INTERVAL '24 hours';
    SELECT COUNT(*) INTO v_failed FROM auth.email_messages WHERE error_message IS NOT NULL AND created_at >= NOW() - INTERVAL '24 hours';
  EXCEPTION WHEN OTHERS THEN
    v_total := 0;
    v_failed := 0;
  END;

  -- Calculer bounce rate
  IF v_total > 0 THEN
    v_rate := (v_failed::FLOAT / v_total::FLOAT) * 100.0;
  ELSE
    v_rate := 0.0;
  END IF;

  -- Déterminer niveau d'alerte
  RETURN QUERY
  SELECT
    CASE
      WHEN v_rate >= threshold_percent THEN 'CRITICAL'
      WHEN v_rate >= (threshold_percent / 2) THEN 'WARNING'
      ELSE 'OK'
    END::TEXT,
    ROUND(v_rate, 2),
    v_total,
    v_failed,
    CASE
      WHEN v_rate >= threshold_percent THEN
        '🚨 CRITICAL: Bounce rate ' || ROUND(v_rate, 2)::TEXT || '% exceeds threshold ' || threshold_percent::TEXT || '%'
      WHEN v_rate >= (threshold_percent / 2) THEN
        '⚠️  WARNING: Bounce rate ' || ROUND(v_rate, 2)::TEXT || '% approaching threshold'
      ELSE
        '✅ OK: Bounce rate ' || ROUND(v_rate, 2)::TEXT || '% is healthy'
    END::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- EXÉCUTION DES VÉRIFICATIONS
-- ============================================================================

-- Vérifier santé générale
SELECT * FROM public.check_email_health();

-- Vérifier bounce rate (seuil: 5%)
SELECT * FROM public.alert_high_bounce_rate(5.0);

-- Afficher les derniers emails failed (si existants)
SELECT * FROM public.get_failed_emails(5);

-- ============================================================================
-- RAPPORT
-- ============================================================================

DO $$
DECLARE
  health_check RECORD;
  alert_check RECORD;
BEGIN
  -- Obtenir le statut de santé
  SELECT * INTO health_check FROM public.check_email_health() WHERE metric = 'Failed Emails (24h)';

  -- Obtenir alerte bounce rate
  SELECT * INTO alert_check FROM public.alert_high_bounce_rate(5.0);

  RAISE NOTICE '============================================';
  RAISE NOTICE 'EMAIL HEALTH REPORT - %', NOW()::DATE;
  RAISE NOTICE '============================================';
  RAISE NOTICE '';

  IF health_check.status = 'CRITICAL' OR alert_check.alert_level = 'CRITICAL' THEN
    RAISE NOTICE '🚨 STATUS: CRITICAL - Action Required';
  ELSIF health_check.status = 'WARNING' OR alert_check.alert_level = 'WARNING' THEN
    RAISE NOTICE '⚠️  STATUS: WARNING - Monitor Closely';
  ELSE
    RAISE NOTICE '✅ STATUS: HEALTHY';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE 'Bounce Rate: % %%', alert_check.bounce_rate;
  RAISE NOTICE 'Total Emails (24h): %', alert_check.total_emails;
  RAISE NOTICE 'Failed Emails (24h): %', alert_check.failed_emails;
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE '💡 RECOMMENDED ACTIONS:';

  IF alert_check.alert_level = 'CRITICAL' THEN
    RAISE NOTICE '   1. Run cleanup_email_bounces.sql immediately';
    RAISE NOTICE '   2. Disable email confirmations in Dashboard';
    RAISE NOTICE '   3. Configure SMTP provider (Mailtrap/SendGrid)';
  ELSIF alert_check.alert_level = 'WARNING' THEN
    RAISE NOTICE '   1. Monitor bounce rate closely';
    RAISE NOTICE '   2. Review failed emails for patterns';
    RAISE NOTICE '   3. Consider disabling confirmations temporarily';
  ELSE
    RAISE NOTICE '   - Continue regular monitoring';
    RAISE NOTICE '   - Consider SMTP setup for production';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '============================================';
END $$;
