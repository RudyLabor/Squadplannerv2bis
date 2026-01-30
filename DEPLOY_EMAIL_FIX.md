# DÉPLOIEMENT URGENT - FIX EMAIL BOUNCES

## ACTION IMMÉDIATE REQUISE

Le bounce rate élevé menace les privilèges email de votre projet Supabase. Suivez ces étapes IMMÉDIATEMENT.

---

## ÉTAPE 1: EXÉCUTER LE SCRIPT DE FIX (2 minutes)

### Windows:
```bash
cd "C:\Users\RudyL\Documents\Maquette figma"
scripts\deploy_email_fix.bat
```

### Linux/Mac:
```bash
cd /path/to/Maquette figma
bash scripts/deploy_email_fix.sh
```

**Ce script va:**
- Nettoyer l'historique des emails bounce
- Auto-confirmer tous les users
- Configurer le monitoring
- Vérifier que config.toml est correct

---

## ÉTAPE 2: CONFIGURATION DASHBOARD SUPABASE (3 minutes)

### 2.1. Ouvrir Dashboard
https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/auth/settings

### 2.2. Désactiver Email Confirmations
Dans `Authentication > Email Auth Settings`:
- [ ] **Désactiver** "Enable email confirmations"
- [ ] **Désactiver** "Enable email change confirmations"
- [ ] **Désactiver** "Confirm email change with new email only"
- [ ] Cliquer **"Save"**

### 2.3. Vérifier Email Settings
Dans `Project Settings > Email`:
- Vérifier que "Bounce Rate" diminue (peut prendre quelques heures)
- Vérifier "Recent Bounces" = 0 après quelques heures

---

## ÉTAPE 3: VÉRIFICATION (2 minutes)

### 3.1. Vérifier les Users
```bash
supabase db execute --project-ref cwtoprbowdqcemdjrtir --sql "
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed
FROM auth.users;
"
```

**Résultat attendu:** `unconfirmed = 0`

### 3.2. Vérifier Email Health
```bash
supabase db execute --file scripts/monitor_email_health.sql --project-ref cwtoprbowdqcemdjrtir
```

**Résultat attendu:** Status = "HEALTHY" ou "OK"

### 3.3. Tester Création de Compte
1. Créer un nouveau compte de test
2. Vérifier qu'il est créé SANS email de confirmation
3. Vérifier que le compte est immédiatement actif

---

## ÉTAPE 4: REDÉMARRER SUPABASE LOCAL (si applicable)

Si vous utilisez Supabase en local:
```bash
supabase stop
supabase start
```

---

## ÉTAPE 5: MONITORING CONTINU

### Setup Monitoring Automatique (optionnel mais recommandé)

**Linux/Mac (cron):**
```bash
crontab -e
# Ajouter cette ligne (vérification toutes les 30 min)
*/30 * * * * /path/to/scripts/cron_email_monitor.sh >> /var/log/email_monitor.log 2>&1
```

**Windows (Task Scheduler):**
1. Ouvrir Task Scheduler
2. Créer tâche de base
3. Trigger: Répéter toutes les 30 minutes
4. Action: `C:\Users\RudyL\Documents\Maquette figma\scripts\cron_email_monitor.sh`

---

## VÉRIFICATION FINALE

Après 1-2 heures, vérifier dans Dashboard Supabase:

1. **Project Settings > Email:**
   - Bounce Rate doit être proche de 0%
   - Recent Bounces = 0

2. **Authentication > Users:**
   - Tous les users doivent avoir "Email Confirmed" ✅

3. **Créer un nouveau compte de test:**
   - Doit fonctionner sans tentative d'email
   - Compte immédiatement actif

---

## EN CAS DE PROBLÈME

### Si le bounce rate reste élevé:
1. Vérifier que les étapes 1 et 2 sont bien complètes
2. Attendre 24h (Supabase met à jour les stats avec délai)
3. Re-exécuter `scripts/cleanup_email_bounces.sql`
4. Contacter Supabase Support si toujours bloqué

### Si les nouveaux comptes ne se créent pas:
1. Vérifier logs: `SELECT * FROM public.email_monitoring ORDER BY created_at DESC LIMIT 10;`
2. Vérifier config.toml: `enable_confirmations = false`
3. Redémarrer Supabase local

### Si vous voyez encore des tentatives d'emails:
1. Vérifier Dashboard: `enable_confirmations` doit être OFF
2. Chercher triggers custom qui envoient des emails:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%email%' OR tgname LIKE '%mail%';
   ```
3. Désactiver ces triggers temporairement

---

## PROCHAINES ÉTAPES (POUR PRODUCTION)

Une fois la crise résolue, pour préparer la production:

1. **Configurer SMTP de test (Mailtrap):**
   - Créer compte: https://mailtrap.io
   - Configurer dans Dashboard Supabase
   - Tester les emails (ils seront interceptés, pas envoyés)

2. **Avant production, configurer SMTP réel:**
   - Recommandé: Resend (https://resend.com) - 3000 emails/mois gratuits
   - Alternative: SendGrid, AWS SES
   - Configurer SPF/DKIM pour votre domaine

3. **Réactiver confirmations email:**
   - Dashboard: `enable_confirmations = true`
   - config.toml: `enable_confirmations = true`
   - Tester avec plusieurs providers (Gmail, Outlook, etc.)

---

## DOCUMENTATION COMPLÈTE

Pour plus de détails, consulter:
**`docs/EMAIL_BOUNCE_FIX.md`**

Contient:
- Explication détaillée du problème
- Guide complet de configuration SMTP
- Stratégies de monitoring
- FAQ et troubleshooting
- Checklist de migration production

---

## RÉSUMÉ

1. ✅ Exécuter `scripts/deploy_email_fix.bat` (ou .sh)
2. ✅ Dashboard: Désactiver "Enable email confirmations"
3. ✅ Vérifier que users sont confirmés
4. ✅ Tester création de compte
5. ✅ Attendre 24h et vérifier bounce rate = 0%

**Temps total:** 10-15 minutes + 24h d'attente pour confirmation

**Support:** En cas de problème, consulter `docs/EMAIL_BOUNCE_FIX.md` ou contacter Supabase Support.

---

**Créé le:** 2026-01-28
**Projet:** cwtoprbowdqcemdjrtir (Squad Planner)
