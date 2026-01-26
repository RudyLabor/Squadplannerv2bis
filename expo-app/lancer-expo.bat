@echo off
REM Script de lancement automatique pour Squad Planner Expo
REM Compatible Windows 7/8/10/11

echo.
echo ================================================================
echo         SQUAD PLANNER - LANCEMENT EXPO MOBILE
echo ================================================================
echo.

REM Verifier si package.json existe
if not exist "package.json" (
    echo ERREUR : Fichier package.json introuvable !
    echo Assurez-vous d'etre dans le dossier expo-app/
    echo.
    pause
    exit /b 1
)

echo [OK] Dossier expo-app detecte !
echo.

REM Verifier si node_modules existe
if not exist "node_modules" (
    echo [INFO] Installation des dependances...
    echo Cela peut prendre 1-2 minutes...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ERREUR lors de l'installation des dependances
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependances installees avec succes !
    echo.
) else (
    echo [OK] Dependances deja installees !
    echo.
)

echo ================================================================
echo    LANCEMENT DE SQUAD PLANNER EXPO...
echo ================================================================
echo.
echo Scannez le QR code avec Expo Go pour tester sur mobile !
echo Appuyez sur 'w' dans le terminal pour ouvrir en web
echo.

REM Lancer Expo avec nettoyage du cache
call npx expo start --clear

echo.
echo ================================================================
echo    EXPO ARRETE
echo ================================================================
echo.
pause
