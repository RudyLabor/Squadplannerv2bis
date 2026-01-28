@echo off
echo.
echo ════════════════════════════════════════════════════════════
echo    🚀 AUTO-PASTE SQL - 100%% Automatique
echo ════════════════════════════════════════════════════════════
echo.

REM Copier le fichier SQL dans le presse-papier
echo 📝 Copie du SQL dans le presse-papier...
type FULL_DB_SETUP.sql | clip
echo ✅ SQL copié!

REM Ouvrir l'éditeur SQL Supabase
echo 📝 Ouverture de l'éditeur SQL Supabase...
start https://app.supabase.com/project/cwtoprbowdqcemdjrtir/sql/new

echo.
echo ════════════════════════════════════════════════════════════
echo    📋 Instructions (2 clics):
echo ════════════════════════════════════════════════════════════
echo.
echo    1. Dans l'éditeur SQL qui vient de s'ouvrir:
echo       Appuyez sur CTRL+V (le SQL est déjà copié!)
echo.
echo    2. Cliquez sur le bouton "Run" (en haut à droite)
echo.
echo    C'EST TOUT! Les migrations seront exécutées.
echo.
echo ════════════════════════════════════════════════════════════
pause
