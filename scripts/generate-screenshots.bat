@echo off
chcp 65001 > nul
echo.
echo ========================================
echo 📸 Squad Planner - Screenshots Generator
echo ========================================
echo.

REM Vérifier si Puppeteer est installé
echo [1/3] Vérification des dépendances...
if not exist "node_modules\puppeteer" (
    echo ❌ Puppeteer n'est pas installé
    echo 📦 Installation de Puppeteer...
    call npm install --save-dev puppeteer
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation
        pause
        exit /b 1
    )
)
echo ✅ Puppeteer installé
echo.

REM Vérifier si l'app est lancée
echo [2/3] Vérification que l'app est lancée...
echo ⚠️  L'app DOIT être lancée sur http://localhost:5173
echo.
echo Si l'app n'est pas lancée, ouvre un autre terminal et lance:
echo   npm run dev
echo.
echo Appuie sur une touche quand l'app est prête...
pause > nul
echo.

REM Lancer le script
echo [3/3] Génération des screenshots...
echo.
node scripts\generate-screenshots.js

if errorlevel 1 (
    echo.
    echo ❌ Une erreur s'est produite
    echo.
    echo Vérifications:
    echo 1. L'app est bien lancée sur http://localhost:5173
    echo 2. Puppeteer est installé
    echo 3. Tu as lancé ce script depuis la racine du projet
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✨ Terminé !
echo ========================================
echo.
echo 📂 Les screenshots sont dans: screenshots\
echo 🌐 Ouvre screenshots\index.html pour les voir
echo.
echo Ouvrir maintenant ? (O/N)
set /p OPEN="> "

if /i "%OPEN%"=="O" (
    start screenshots\index.html
)

echo.
echo Appuie sur une touche pour fermer...
pause > nul
