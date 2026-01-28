@echo off
echo.
echo ════════════════════════════════════════════════════════════
echo    🔐 AUTO-CONFIG AUTH URLs - 100%% Automatique
echo ════════════════════════════════════════════════════════════
echo.

REM Créer un fichier temporaire avec les URLs
echo https://squad-planner-v2-rudy.vercel.app > temp_auth_urls.txt

echo 📝 URLs Auth copiées dans le presse-papier
type temp_auth_urls.txt | clip

REM Ouvrir la page de configuration
echo 📝 Ouverture de la configuration Auth URLs...
start https://app.supabase.com/project/cwtoprbowdqcemdjrtir/auth/url-configuration

echo.
echo ════════════════════════════════════════════════════════════
echo    📋 Configuration automatique:
echo ════════════════════════════════════════════════════════════
echo.
echo    SITE URL (à coller dans le premier champ):
echo    👉 https://squad-planner-v2-rudy.vercel.app
echo.
echo    REDIRECT URLs (cliquez "Add URL" pour chacune):
echo    👉 https://squad-planner-v2-rudy.vercel.app
echo    👉 https://squad-planner-v2-rudy.vercel.app/**
echo    👉 https://*.vercel.app
echo    👉 https://squad-planner-v2-rudy.vercel.app/oauth/callback
echo.
echo    Puis cliquez sur "Save" en bas!
echo.
echo ════════════════════════════════════════════════════════════

REM Nettoyer
del temp_auth_urls.txt

pause
