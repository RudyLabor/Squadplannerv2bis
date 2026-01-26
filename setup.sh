#!/bin/bash

# 🎮 Squad Planner - Setup Script
# Ce script configure automatiquement votre environnement de développement

set -e  # Exit on error

echo "🎮 Squad Planner - Setup Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm n'est pas installé${NC}"
    echo "Installation de pnpm..."
    npm install -g pnpm
    echo -e "${GREEN}✅ pnpm installé avec succès${NC}"
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ requis (actuellement: $(node -v))${NC}"
    echo "Veuillez installer Node.js 18 ou supérieur"
    exit 1
else
    echo -e "${GREEN}✅ Node.js $(node -v) détecté${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
pnpm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}📝 Création du fichier .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Fichier .env créé${NC}"
    echo -e "${YELLOW}⚠️  N'oubliez pas de remplir vos clés Supabase dans .env${NC}"
else
    echo -e "${GREEN}✅ Le fichier .env existe déjà${NC}"
fi

# Check if Supabase CLI is installed
echo ""
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI n'est pas installé${NC}"
    echo "Installation recommandée : npm install -g supabase"
    echo "Ou visitez : https://supabase.com/docs/guides/cli"
else
    echo -e "${GREEN}✅ Supabase CLI détecté${NC}"
fi

# Summary
echo ""
echo "================================"
echo -e "${GREEN}✅ Setup terminé !${NC}"
echo ""
echo "📝 Prochaines étapes :"
echo ""
echo "1. Configurer vos clés Supabase dans .env"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo ""
echo "2. Démarrer le serveur de développement :"
echo "   ${BLUE}pnpm dev${NC}"
echo ""
echo "3. (Optionnel) Démarrer Supabase localement :"
echo "   ${BLUE}supabase start${NC}"
echo ""
echo "📚 Documentation complète : README.md"
echo "🚀 Guide de déploiement : DEPLOYMENT.md"
echo ""
echo "Bon développement ! 🎮✨"
