@echo off
chcp 65001 >nul
echo.
echo ══════════════════════════════════════════════════════════════
echo    🚀 Configuration automatique Squad Planner v2.0
echo ══════════════════════════════════════════════════════════════
echo.

REM Couleurs
set GREEN=[92m
set YELLOW=[93m
set RED=[91m
set NC=[0m

echo %YELLOW%📝 Récupération des credentials Supabase...%NC%
echo.
echo Ouvrez votre navigateur sur:
echo https://app.supabase.com/project/cwtoprbowdqcemdjrtir/settings/api
echo.

set /p SUPABASE_URL="VITE_SUPABASE_URL (https://xxx.supabase.co): "
set /p SUPABASE_ANON_KEY="VITE_SUPABASE_ANON_KEY: "

echo.
echo %GREEN%✅ Credentials récupérés%NC%

REM Créer le fichier .env
echo.
echo %YELLOW%📝 Création du fichier .env...%NC%
(
echo # Supabase Configuration
echo VITE_SUPABASE_URL=%SUPABASE_URL%
echo VITE_SUPABASE_ANON_KEY=%SUPABASE_ANON_KEY%
echo.
echo # Optional: Add these later for advanced features
echo # VITE_VAPID_PUBLIC_KEY=
echo # VITE_STRIPE_PUBLISHABLE_KEY=
echo # VITE_STRIPE_PREMIUM_PRICE_ID=
echo # VITE_STRIPE_PRO_PRICE_ID=
) > .env

echo %GREEN%✅ Fichier .env créé%NC%

REM Configurer Vercel
echo.
echo %YELLOW%📝 Configuration des variables Vercel...%NC%
echo %SUPABASE_URL%| vercel env add VITE_SUPABASE_URL production
echo %SUPABASE_ANON_KEY%| vercel env add VITE_SUPABASE_ANON_KEY production
echo %GREEN%✅ Variables Vercel configurées%NC%

REM Instructions pour migrations SQL
echo.
echo %YELLOW%📝 Migrations SQL Supabase%NC%
echo.
echo ⚠️  Action manuelle requise:
echo 1. Ouvrez: https://app.supabase.com/project/cwtoprbowdqcemdjrtir/sql/new
echo 2. Copiez tout le contenu du fichier FULL_DB_SETUP.sql
echo 3. Collez-le dans l'éditeur SQL
echo 4. Cliquez sur "Run"
echo.
pause

REM Configuration Auth URLs
echo.
echo %YELLOW%📝 Configuration Auth URLs Supabase%NC%
echo.
echo ⚠️  Action manuelle requise:
echo 1. Ouvrez: https://app.supabase.com/project/cwtoprbowdqcemdjrtir/auth/url-configuration
echo 2. Site URL: https://squad-planner-v2-rudy.vercel.app
echo 3. Redirect URLs (ajoutez chaque ligne):
echo    - https://squad-planner-v2-rudy.vercel.app
echo    - https://squad-planner-v2-rudy.vercel.app/**
echo    - https://*.vercel.app
echo    - https://squad-planner-v2-rudy.vercel.app/oauth/callback
echo.
pause

REM Redéploiement Vercel
echo.
echo %YELLOW%📝 Redéploiement Vercel...%NC%
vercel --prod
echo %GREEN%✅ Déploiement terminé!%NC%

REM Résumé
echo.
echo ══════════════════════════════════════════════════════════════
echo    🎉 Configuration terminée!
echo ══════════════════════════════════════════════════════════════
echo.
echo %GREEN%✅ Variables d'environnement Vercel configurées%NC%
echo %GREEN%✅ Fichier .env local créé%NC%
echo %GREEN%✅ Application redéployée%NC%
echo.
echo 📱 Votre application est disponible sur:
echo    https://squad-planner-v2-rudy.vercel.app
echo.
echo 💡 Fonctionnalités optionnelles à configurer plus tard:
echo    - Web Push Notifications (VITE_VAPID_PUBLIC_KEY)
echo    - Stripe Payments (VITE_STRIPE_*)
echo.
pause
