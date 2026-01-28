@echo off
cls
echo.
echo ════════════════════════════════════════════════════════════
echo    ⚡ SETUP ULTRA-RAPIDE - 2 ACTIONS (30 secondes total)
echo ════════════════════════════════════════════════════════════
echo.
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ ACTION 1/2 : SQL (10 secondes)                            │
echo └────────────────────────────────────────────────────────────┘
echo.
echo   1. Je copie le SQL dans votre presse-papier...
type FULL_DB_SETUP.sql | clip
echo   ✅ SQL copié!
echo.
echo   2. J'ouvre l'éditeur SQL Supabase...
start https://app.supabase.com/project/cwtoprbowdqcemdjrtir/sql/new
timeout /t 2 >nul
echo   ✅ Éditeur ouvert!
echo.
echo   👉 VOUS: Cliquez dans l'éditeur, CTRL+V, puis "Run"
echo.
pause
echo.
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ ACTION 2/2 : Auth URLs (20 secondes)                      │
echo └────────────────────────────────────────────────────────────┘
echo.
echo   1. J'ouvre la page Auth URLs...
start https://app.supabase.com/project/cwtoprbowdqcemdjrtir/auth/url-configuration
timeout /t 2 >nul
echo   ✅ Page ouverte!
echo.
echo   👉 VOUS: Copiez-collez ces valeurs:
echo.
echo   Site URL:
echo   https://squad-planner-v2-rudy.vercel.app
echo.
echo   Redirect URLs (4 lignes):
echo   https://squad-planner-v2-rudy.vercel.app
echo   https://squad-planner-v2-rudy.vercel.app/**
echo   https://*.vercel.app
echo   https://squad-planner-v2-rudy.vercel.app/oauth/callback
echo.
echo   Puis cliquez "Save"
echo.
pause
echo.
echo ════════════════════════════════════════════════════════════
echo    🎉 C'EST TOUT !
echo ════════════════════════════════════════════════════════════
echo.
echo   Votre app est maintenant 100%% opérationnelle:
echo   🌐 https://squad-planner-v2-rudy.vercel.app
echo.
echo   Testez-la maintenant! 🚀
echo.
pause
