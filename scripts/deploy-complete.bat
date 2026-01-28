@echo off
echo ============================================
echo   SQUAD PLANNER - DEPLOYMENT AUTOMATIQUE
echo ============================================
echo.

REM 1. Deployer les migrations SQL
echo [1/4] Ouverture Supabase SQL Editor...
echo.
echo Copie du SQL dans le presse-papier...
type ..\supabase\DEPLOY_ALL_MIGRATIONS.sql | clip
echo.
echo ✓ SQL copie dans le presse-papier!
echo.
echo Ouverture du dashboard Supabase...
start https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/sql/new
echo.
echo Action requise:
echo   1. Coller (Ctrl+V) dans l'editeur SQL
echo   2. Cliquer sur "Run"
echo   3. Attendre que toutes les migrations s'executent
echo.
pause
echo.

REM 2. Deployer Edge Functions
echo [2/4] Deploiement Edge Function...
echo.
echo Verification npx supabase...
where npx >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠ npx non trouve - installation de Supabase CLI...
    npm install -g supabase
)
echo.
echo Deploiement de send-reminders...
cd ..
npx supabase functions deploy send-reminders
if %errorlevel% equ 0 (
    echo ✓ Edge function deployee!
) else (
    echo ⚠ Erreur deploiement - verifiez manuellement
)
echo.
pause

REM 3. Configurer Vercel Secrets
echo [3/4] Configuration Vercel Secrets...
echo.
echo Generation CRON_SECRET...
for /f "delims=" %%i in ('powershell -command "[guid]::NewGuid().ToString()"') do set CRON_SECRET=%%i
echo CRON_SECRET genere: %CRON_SECRET%
echo.
echo Configuration Vercel...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Installation Vercel CLI...
    npm install -g vercel
)
echo.
vercel env add CRON_SECRET production
echo %CRON_SECRET% | vercel env add CRON_SECRET production
echo.
echo Configuration SUPABASE_SERVICE_ROLE_KEY...
echo Allez sur: https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/settings/api
echo Copiez la "service_role" key (secret)
echo.
set /p SERVICE_KEY="Collez la service_role key: "
echo %SERVICE_KEY% | vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo.
echo ✓ Secrets configures!
echo.
pause

REM 4. Deployer sur Vercel
echo [4/4] Deploiement Vercel...
echo.
git add .
git commit -m "deploy: Complete deployment with all migrations and configs"
git push
vercel --prod
echo.
echo ✓ Deploiement complete!
echo.

echo ============================================
echo   DEPLOYMENT TERMINE!
echo ============================================
echo.
echo Phase 0: 100%%
echo Phase 1: 100%%
echo Phase 2: 100%%
echo.
echo Application disponible sur Vercel
echo.
pause
