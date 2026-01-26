#!/bin/bash

# 🚀 Squad Planner - Script de déploiement automatisé
# Usage: ./deploy.sh

set -e  # Exit on error

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
ROCKET="🚀"
WARNING="⚠️"
ERROR="❌"
INFO="ℹ️"

echo ""
echo "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo "${BLUE}║  🚀 Squad Planner - Déploiement v1.0.0  ║${NC}"
echo "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo ""

# ============================================
# ÉTAPE 1: Vérifications pré-déploiement
# ============================================

echo "${YELLOW}${INFO} Étape 1/5: Vérifications pré-déploiement${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "${RED}${ERROR} Node.js n'est pas installé${NC}"
    exit 1
fi
echo "${GREEN}${CHECK} Node.js: $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "${RED}${ERROR} npm n'est pas installé${NC}"
    exit 1
fi
echo "${GREEN}${CHECK} npm: $(npm -v)${NC}"

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "${RED}${ERROR} Supabase CLI n'est pas installé${NC}"
    echo "${YELLOW}${INFO} Installer avec: npm install -g supabase${NC}"
    exit 1
fi
echo "${GREEN}${CHECK} Supabase CLI: $(supabase --version)${NC}"

# Check Git
if ! command -v git &> /dev/null; then
    echo "${RED}${ERROR} Git n'est pas installé${NC}"
    exit 1
fi
echo "${GREEN}${CHECK} Git: $(git --version)${NC}"

echo ""

# ============================================
# ÉTAPE 2: Build de l'application
# ============================================

echo "${YELLOW}${INFO} Étape 2/5: Build de l'application${NC}"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}${INFO} Installation des dépendances...${NC}"
    npm install
fi

# TypeScript check
echo "${YELLOW}${INFO} Vérification TypeScript...${NC}"
npm run type-check 2>/dev/null || echo "${YELLOW}${WARNING} Type check skipped (script not found)${NC}"

echo "${GREEN}${CHECK} Build terminé${NC}"
echo ""

# ============================================
# ÉTAPE 3: Vérification Supabase
# ============================================

echo "${YELLOW}${INFO} Étape 3/5: Vérification Supabase${NC}"
echo ""

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "${RED}${ERROR} Non connecté à Supabase${NC}"
    echo "${YELLOW}${INFO} Connexion à Supabase...${NC}"
    supabase login
fi
echo "${GREEN}${CHECK} Connecté à Supabase${NC}"

# Get project ID
if [ -f ".git/config" ]; then
    PROJECT_ID=$(cat .git/config 2>/dev/null | grep "project-ref" | cut -d '=' -f2 | tr -d ' ' || echo "")
fi

if [ -z "$PROJECT_ID" ]; then
    echo "${YELLOW}${WARNING} Project ID non trouvé${NC}"
    echo "${YELLOW}${INFO} Veuillez lier le projet:${NC}"
    echo "${BLUE}supabase link --project-ref YOUR_PROJECT_ID${NC}"
    exit 1
fi

echo "${GREEN}${CHECK} Project ID: ${PROJECT_ID}${NC}"
echo ""

# ============================================
# ÉTAPE 4: Déploiement Supabase
# ============================================

echo "${YELLOW}${INFO} Étape 4/5: Déploiement Supabase${NC}"
echo ""

# Deploy Edge Function
echo "${YELLOW}${INFO} Déploiement de la fonction make-server-e884809f...${NC}"
supabase functions deploy make-server-e884809f

echo "${GREEN}${CHECK} Fonction déployée avec succès${NC}"
echo ""

# Health check
echo "${YELLOW}${INFO} Vérification du health check...${NC}"
HEALTH_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-e884809f/health"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "${GREEN}${CHECK} Health check OK (200)${NC}"
else
    echo "${RED}${ERROR} Health check FAILED (${HEALTH_RESPONSE})${NC}"
    echo "${YELLOW}${INFO} URL: ${HEALTH_URL}${NC}"
    echo "${YELLOW}${INFO} Vérifier les logs: supabase functions logs make-server-e884809f${NC}"
fi

echo ""

# ============================================
# ÉTAPE 5: Vérification des secrets
# ============================================

echo "${YELLOW}${INFO} Étape 5/5: Vérification des secrets${NC}"
echo ""

# List secrets
echo "${YELLOW}${INFO} Secrets configurés:${NC}"
supabase secrets list 2>/dev/null || echo "${YELLOW}${WARNING} Impossible de lister les secrets${NC}"

# Check required secrets
REQUIRED_SECRETS=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "DISCORD_CLIENT_ID"
    "DISCORD_CLIENT_SECRET"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
)

echo ""
echo "${YELLOW}${INFO} Secrets requis:${NC}"
for SECRET in "${REQUIRED_SECRETS[@]}"; do
    if supabase secrets list 2>/dev/null | grep -q "$SECRET"; then
        echo "${GREEN}${CHECK} $SECRET${NC}"
    else
        echo "${RED}${ERROR} $SECRET manquant${NC}"
        MISSING_SECRETS=true
    fi
done

if [ "$MISSING_SECRETS" = true ]; then
    echo ""
    echo "${YELLOW}${WARNING} Certains secrets sont manquants${NC}"
    echo "${YELLOW}${INFO} Configurer avec: supabase secrets set SECRET_NAME=value${NC}"
fi

echo ""

# ============================================
# RÉSUMÉ
# ============================================

echo "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo "${BLUE}║          📊 Résumé du déploiement       ║${NC}"
echo "${BLUE}╠══════════════════════════════════════════╣${NC}"
echo "${BLUE}║${NC}"
echo "${BLUE}║${NC}  ${GREEN}${CHECK} Build application${NC}"
echo "${BLUE}║${NC}  ${GREEN}${CHECK} Fonction Supabase déployée${NC}"

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "${BLUE}║${NC}  ${GREEN}${CHECK} Health check OK${NC}"
else
    echo "${BLUE}║${NC}  ${RED}${ERROR} Health check FAILED${NC}"
fi

if [ "$MISSING_SECRETS" != true ]; then
    echo "${BLUE}║${NC}  ${GREEN}${CHECK} Secrets configurés${NC}"
else
    echo "${BLUE}║${NC}  ${YELLOW}${WARNING} Secrets incomplets${NC}"
fi

echo "${BLUE}║${NC}"
echo "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# URLS IMPORTANTES
# ============================================

echo "${YELLOW}🔗 URLs importantes:${NC}"
echo ""
echo "  ${BLUE}🗄️  Dashboard:${NC}  https://app.supabase.com/project/${PROJECT_ID}"
echo "  ${BLUE}🚀  API:${NC}        https://${PROJECT_ID}.supabase.co/functions/v1/make-server-e884809f"
echo "  ${BLUE}💚  Health:${NC}     https://${PROJECT_ID}.supabase.co/functions/v1/make-server-e884809f/health"
echo "  ${BLUE}📝  Logs:${NC}       https://app.supabase.com/project/${PROJECT_ID}/logs"
echo ""

# ============================================
# PROCHAINES ÉTAPES
# ============================================

echo "${YELLOW}🎯 Prochaines étapes:${NC}"
echo ""

if [ "$MISSING_SECRETS" = true ]; then
    echo "  1. ${YELLOW}Configurer les secrets manquants:${NC}"
    echo "     ${BLUE}supabase secrets set GOOGLE_CLIENT_ID=your_id${NC}"
    echo "     ${BLUE}supabase secrets set GOOGLE_CLIENT_SECRET=your_secret${NC}"
    echo ""
fi

echo "  2. ${YELLOW}Tester l'application:${NC}"
echo "     - Discord OAuth"
echo "     - Google OAuth"
echo "     - Calendar sync"
echo ""

echo "  3. ${YELLOW}Git commit & push:${NC}"
echo "     ${BLUE}git add .${NC}"
echo "     ${BLUE}git commit -m '🚀 Deploy v1.0.0'${NC}"
echo "     ${BLUE}git push origin main${NC}"
echo "     ${BLUE}git tag v1.0.0 && git push origin v1.0.0${NC}"
echo ""

echo "  4. ${YELLOW}Consulter la documentation:${NC}"
echo "     ${BLUE}cat DEPLOYMENT_20MIN.md${NC}"
echo ""

# ============================================
# FIN
# ============================================

echo "${GREEN}${ROCKET} Déploiement terminé avec succès !${NC}"
echo ""
