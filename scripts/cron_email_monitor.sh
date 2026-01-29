#!/bin/bash
# ============================================================================
# CRON JOB - MONITORING EMAIL HEALTH
# Projet: cwtoprbowdqcemdjrtir
# Date: 2026-01-28
# ============================================================================
# À ajouter à crontab pour monitoring automatique:
# */30 * * * * /path/to/cron_email_monitor.sh >> /var/log/email_monitor.log 2>&1
# (Exécution toutes les 30 minutes)
# ============================================================================

set -e

# Variables
PROJECT_REF="cwtoprbowdqcemdjrtir"
ALERT_THRESHOLD=5.0  # % de bounce rate critique
LOG_FILE="/tmp/supabase_email_health_$(date +%Y%m%d_%H%M%S).log"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================"
echo "Email Health Check - $(date)"
echo "========================================"

# Exécuter le script de monitoring
supabase db execute \
  --project-ref "$PROJECT_REF" \
  --file scripts/monitor_email_health.sql \
  > "$LOG_FILE" 2>&1

# Vérifier le résultat
if grep -q "CRITICAL" "$LOG_FILE"; then
    echo -e "${RED}🚨 CRITICAL: High bounce rate detected!${NC}"
    echo "Log: $LOG_FILE"

    # Envoyer une alerte (exemple avec mail ou webhook)
    # curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
    #   -H 'Content-Type: application/json' \
    #   -d "{\"text\":\"🚨 CRITICAL: Supabase email bounce rate is high! Check $LOG_FILE\"}"

    # Ou envoyer un email
    # echo "Check $LOG_FILE" | mail -s "CRITICAL: Supabase Email Bounce Alert" admin@example.com

    exit 1

elif grep -q "WARNING" "$LOG_FILE"; then
    echo -e "${YELLOW}⚠️  WARNING: Email health needs attention${NC}"
    echo "Log: $LOG_FILE"
    exit 0

else
    echo -e "${GREEN}✅ OK: Email health is good${NC}"
    # Nettoyer le log si tout va bien (optionnel)
    # rm "$LOG_FILE"
    exit 0
fi
