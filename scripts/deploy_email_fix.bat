@echo off
REM ============================================================================
REM SCRIPT DE DÉPLOIEMENT - FIX EMAIL BOUNCES (Windows)
REM Projet: cwtoprbowdqcemdjrtir
REM Date: 2026-01-28
REM ============================================================================

echo.
echo ================================================
echo URGENCE: Fix Email Bounces - Supabase
echo ================================================
echo.

set PROJECT_REF=cwtoprbowdqcemdjrtir
set SUPABASE_URL=https://cwtoprbowdqcemdjrtir.supabase.co

echo AVERTISSEMENT:
echo Ce script va:
echo   1. Nettoyer l'historique des emails bounce
echo   2. Auto-confirmer tous les users non confirmés
echo   3. Configurer le monitoring des emails
echo.

set /p confirm="Continuer? (y/n) "
if /i not "%confirm%"=="y" (
    echo Annulé
    exit /b 1
)

echo.
echo ================================================
echo ÉTAPE 1/4: Nettoyage email bounces
echo ================================================

REM Vérifier si supabase CLI est installé
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Supabase CLI non installé
    echo Installation: npm install -g supabase
    exit /b 1
)

echo Exécution de cleanup_email_bounces.sql...
supabase db execute --file scripts\cleanup_email_bounces.sql --project-ref %PROJECT_REF%
if %errorlevel% neq 0 (
    echo ATTENTION: Erreur lors du nettoyage ^(peut-être déjà nettoyé^)
)

echo.
echo ================================================
echo ÉTAPE 2/4: Configuration email monitoring
echo ================================================

echo Exécution de supabase_email_config.sql...
supabase db execute --file scripts\supabase_email_config.sql --project-ref %PROJECT_REF%
if %errorlevel% neq 0 (
    echo ERREUR: Échec de la configuration
    exit /b 1
)

echo.
echo ================================================
echo ÉTAPE 3/4: Vérification config.toml
echo ================================================

findstr /C:"enable_confirmations = false" supabase\config.toml >nul
if %errorlevel% equ 0 (
    echo OK: enable_confirmations = false
) else (
    echo ATTENTION: enable_confirmations n'est pas à false
    echo Veuillez modifier manuellement supabase\config.toml
    echo.
    echo [auth.email]
    echo enable_confirmations = false
)

echo.
echo ================================================
echo ÉTAPE 4/4: Vérifications finales
echo ================================================

echo Requête de vérification...
supabase db execute --project-ref %PROJECT_REF% --sql "SELECT COUNT(*) as total_users, COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed, COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed FROM auth.users;"

echo.
echo ================================================
echo DÉPLOIEMENT TERMINÉ
echo ================================================
echo.
echo ================================================
echo ACTIONS MANUELLES REQUISES:
echo ================================================
echo.
echo 1. Dashboard Supabase (https://supabase.com/dashboard/project/%PROJECT_REF%/auth/settings):
echo    - Authentication ^> Email Auth Settings
echo    - Désactiver 'Enable email confirmations'
echo    - Désactiver 'Enable email change confirmations'
echo.
echo 2. Si local, redémarrer Supabase:
echo    supabase stop
echo    supabase start
echo.
echo 3. Vérifier que les bounces ont disparu:
echo    - Dashboard ^> Project Settings ^> Email
echo    - Vérifier 'Bounce Rate' = 0%%
echo.
echo 4. Pour PRODUCTION (plus tard):
echo    - Configurer SMTP custom (Mailtrap/SendGrid/Resend)
echo    - Réactiver les confirmations email
echo.
echo ================================================
echo.
echo Rapport détaillé disponible dans:
echo    docs\EMAIL_BOUNCE_FIX.md
echo.

pause
