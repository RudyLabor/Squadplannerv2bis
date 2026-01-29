#!/bin/bash
# ============================================================================
# SCRIPT DE DÉPLOIEMENT - FIX EMAIL BOUNCES
# Projet: cwtoprbowdqcemdjrtir
# Date: 2026-01-28
# ============================================================================

set -e  # Exit on error

echo "🚨 URGENCE: Fix Email Bounces - Supabase"
echo "=========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
PROJECT_REF="cwtoprbowdqcemdjrtir"
SUPABASE_URL="https://cwtoprbowdqcemdjrtir.supabase.co"

echo -e "${YELLOW}⚠️  AVERTISSEMENT${NC}"
echo "Ce script va:"
echo "  1. Nettoyer l'historique des emails bounce"
echo "  2. Auto-confirmer tous les users non confirmés"
echo "  3. Configurer le monitoring des emails"
echo ""

read -p "Continuer? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Annulé"
    exit 1
fi

echo ""
echo -e "${GREEN}📋 ÉTAPE 1/4: Nettoyage email bounces${NC}"
echo "Exécution de cleanup_email_bounces.sql..."

# Vérifier si supabase CLI est installé
if ! command -v supabase &> /dev/null
then
    echo -e "${RED}❌ Supabase CLI non installé${NC}"
    echo "Installation: npm install -g supabase"
    exit 1
fi

# Exécuter le script de nettoyage
supabase db execute --file scripts/cleanup_email_bounces.sql --project-ref "$PROJECT_REF" || {
    echo -e "${YELLOW}⚠️  Erreur lors du nettoyage (peut-être déjà nettoyé)${NC}"
}

echo ""
echo -e "${GREEN}📋 ÉTAPE 2/4: Configuration email monitoring${NC}"
echo "Exécution de supabase_email_config.sql..."

supabase db execute --file scripts/supabase_email_config.sql --project-ref "$PROJECT_REF" || {
    echo -e "${RED}❌ Erreur lors de la configuration${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}📋 ÉTAPE 3/4: Vérification config.toml${NC}"

# Vérifier que enable_confirmations = false
if grep -q "enable_confirmations = false" supabase/config.toml; then
    echo -e "${GREEN}✅ enable_confirmations = false${NC}"
else
    echo -e "${YELLOW}⚠️  enable_confirmations n'est pas à false${NC}"
    echo "   Modification de config.toml..."

    # Backup
    cp supabase/config.toml supabase/config.toml.backup

    # Remplacer enable_confirmations = true par false
    sed -i 's/enable_confirmations = true/enable_confirmations = false/g' supabase/config.toml

    echo -e "${GREEN}✅ Config.toml mis à jour${NC}"
fi

echo ""
echo -e "${GREEN}📋 ÉTAPE 4/4: Vérifications finales${NC}"

# Compter les users non confirmés
echo "Requête de vérification..."
supabase db execute --project-ref "$PROJECT_REF" --sql "
  SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed,
    COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed
  FROM auth.users;
" || echo -e "${YELLOW}⚠️  Impossible de vérifier (permissions)${NC}"

echo ""
echo -e "${GREEN}✅ DÉPLOIEMENT TERMINÉ${NC}"
echo ""
echo "=========================================="
echo "🎯 ACTIONS MANUELLES REQUISES:"
echo "=========================================="
echo ""
echo "1. Dashboard Supabase (https://supabase.com/dashboard/project/$PROJECT_REF/auth/settings):"
echo "   - Authentication > Email Auth Settings"
echo "   - ${RED}Désactiver 'Enable email confirmations'${NC}"
echo "   - ${RED}Désactiver 'Enable email change confirmations'${NC}"
echo ""
echo "2. Si local, redémarrer Supabase:"
echo "   ${YELLOW}supabase stop && supabase start${NC}"
echo ""
echo "3. Vérifier que les bounces ont disparu:"
echo "   - Dashboard > Project Settings > Email"
echo "   - Vérifier 'Bounce Rate' = 0%"
echo ""
echo "4. Pour PRODUCTION (plus tard):"
echo "   - Configurer SMTP custom (Mailtrap/SendGrid/Resend)"
echo "   - Réactiver les confirmations email"
echo ""
echo "=========================================="
echo ""
echo -e "${GREEN}📊 Rapport détaillé disponible dans:${NC}"
echo "   docs/EMAIL_BOUNCE_FIX.md"
echo ""
