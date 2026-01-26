#!/bin/bash

echo ""
echo "========================================"
echo "📸 Squad Planner - Screenshots Generator"
echo "========================================"
echo ""

# Vérifier si Puppeteer est installé
echo "[1/3] Vérification des dépendances..."
if [ ! -d "node_modules/puppeteer" ]; then
    echo "❌ Puppeteer n'est pas installé"
    echo "📦 Installation de Puppeteer..."
    npm install --save-dev puppeteer
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation"
        exit 1
    fi
fi
echo "✅ Puppeteer installé"
echo ""

# Vérifier si l'app est lancée
echo "[2/3] Vérification que l'app est lancée..."
echo "⚠️  L'app DOIT être lancée sur http://localhost:5173"
echo ""
echo "Si l'app n'est pas lancée, ouvre un autre terminal et lance:"
echo "  npm run dev"
echo ""
read -p "Appuie sur Entrée quand l'app est prête..." 
echo ""

# Lancer le script
echo "[3/3] Génération des screenshots..."
echo ""
node scripts/generate-screenshots.js

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Une erreur s'est produite"
    echo ""
    echo "Vérifications:"
    echo "1. L'app est bien lancée sur http://localhost:5173"
    echo "2. Puppeteer est installé"
    echo "3. Tu as lancé ce script depuis la racine du projet"
    exit 1
fi

echo ""
echo "========================================"
echo "✨ Terminé !"
echo "========================================"
echo ""
echo "📂 Les screenshots sont dans: screenshots/"
echo "🌐 Ouvre screenshots/index.html pour les voir"
echo ""

# Demander si on veut ouvrir
read -p "Ouvrir maintenant ? (o/n) " OPEN
if [[ $OPEN == "o" || $OPEN == "O" ]]; then
    # Détecter l'OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open screenshots/index.html
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open screenshots/index.html
    fi
fi

echo ""
echo "✅ Fini !"
