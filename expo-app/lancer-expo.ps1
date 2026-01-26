# 🚀 SCRIPT POWERSHELL - LANCER SQUAD PLANNER EXPO
# Ce script lance automatiquement l'application Expo

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "    🎮 SQUAD PLANNER - VERSION EXPO MOBILE 🎮" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Vérifier si on est dans le bon dossier
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ ERREUR : Fichier package.json introuvable !" -ForegroundColor Red
    Write-Host "   Assurez-vous d'être dans le dossier expo-app/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Tapez : cd expo-app" -ForegroundColor Yellow
    Write-Host "   Puis relancez ce script." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Dossier expo-app détecté !" -ForegroundColor Green
Write-Host ""

# Vérifier si node_modules existe
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    Write-Host "   (Cela peut prendre 1-2 minutes la première fois)" -ForegroundColor Yellow
    Write-Host ""
    npm install
    Write-Host ""
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "✅ Dépendances installées avec succès !" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ Dépendances déjà installées !" -ForegroundColor Green
    Write-Host ""
}

# Demander si on veut nettoyer le cache
Write-Host "🧹 Voulez-vous nettoyer le cache Expo ? (recommandé si première fois)" -ForegroundColor Cyan
Write-Host "   [O] Oui (recommandé)" -ForegroundColor White
Write-Host "   [N] Non (lancement rapide)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Votre choix (O/N)"

Write-Host ""
Write-Host "🚀 LANCEMENT DE SQUAD PLANNER..." -ForegroundColor Green
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($choice -eq "O" -or $choice -eq "o") {
    Write-Host "📱 Scannez le QR code avec Expo Go pour tester sur mobile !" -ForegroundColor Yellow
    Write-Host "🌐 Appuyez sur 'w' dans le terminal pour ouvrir en web" -ForegroundColor Yellow
    Write-Host ""
    npx expo start --clear
} else {
    Write-Host "📱 Scannez le QR code avec Expo Go pour tester sur mobile !" -ForegroundColor Yellow
    Write-Host "🌐 Appuyez sur 'w' dans le terminal pour ouvrir en web" -ForegroundColor Yellow
    Write-Host ""
    npx expo start
}
