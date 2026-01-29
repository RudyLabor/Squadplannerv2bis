# Scripts Email Bounce Fix

Ce dossier contient tous les scripts nécessaires pour résoudre et prévenir les problèmes de bounce rate email sur Supabase.

---

## Scripts Disponibles

### 🚨 Scripts d'Urgence (Exécuter UNE FOIS)

#### 1. `cleanup_email_bounces.sql`
**Description:** Nettoie l'historique des emails bounce et auto-confirme les users
**Usage:**
```bash
supabase db execute --file scripts/cleanup_email_bounces.sql --project-ref cwtoprbowdqcemdjrtir
```
**Attention:** Supprime l'historique d'emails. Utiliser seulement en DEV ou en cas d'urgence.

#### 2. `supabase_email_config.sql`
**Description:** Configure le système de monitoring des emails
**Usage:**
```bash
supabase db execute --file scripts/supabase_email_config.sql --project-ref cwtoprbowdqcemdjrtir
```
**Résultat:**
- Crée table `public.email_monitoring`
- Crée fonctions `auto_confirm_user()`, `log_email_event()`
- Configure RLS policies

---

### 📊 Scripts de Monitoring (Exécuter Régulièrement)

#### 3. `monitor_email_health.sql`
**Description:** Vérifie la santé actuelle des emails
**Usage:**
```bash
# Manuel
supabase db execute --file scripts/monitor_email_health.sql --project-ref cwtoprbowdqcemdjrtir

# Avec psql
psql $DATABASE_URL -f scripts/monitor_email_health.sql
```
**Sortie:**
- Rapport détaillé de santé email
- Alertes si bounce rate élevé
- Liste des emails failed récents

**Fonctions créées:**
- `public.check_email_health()` - Statistiques globales
- `public.get_failed_emails(limit)` - Liste emails échoués
- `public.alert_high_bounce_rate(threshold)` - Alerte si bounce rate > seuil

---

### 🤖 Scripts de Déploiement Automatique

#### 4. `deploy_email_fix.sh` (Linux/Mac)
**Description:** Script tout-en-un pour déployer le fix
**Usage:**
```bash
chmod +x scripts/deploy_email_fix.sh
bash scripts/deploy_email_fix.sh
```
**Actions:**
1. Exécute `cleanup_email_bounces.sql`
2. Exécute `supabase_email_config.sql`
3. Vérifie `config.toml`
4. Vérifie les users
5. Affiche les actions manuelles restantes

#### 5. `deploy_email_fix.bat` (Windows)
**Description:** Version Windows du script de déploiement
**Usage:**
```cmd
scripts\deploy_email_fix.bat
```
**Actions:** Identiques au script .sh

---

### ⏰ Scripts Cron (Monitoring Automatique)

#### 6. `cron_email_monitor.sh`
**Description:** Monitoring automatique via cron job
**Setup:**
```bash
# Rendre exécutable
chmod +x scripts/cron_email_monitor.sh

# Ajouter à crontab (vérification toutes les 30 min)
crontab -e
*/30 * * * * /path/to/scripts/cron_email_monitor.sh >> /var/log/email_monitor.log 2>&1
```
**Actions:**
- Exécute `monitor_email_health.sql`
- Génère logs dans `/tmp/`
- Envoie alertes si bounce rate critique (optionnel)

**Personnalisation alertes:**
Modifier le script pour ajouter:
- Webhook Slack
- Webhook Discord
- Email alert (si SMTP configuré)

---

## Ordre d'Exécution Recommandé

### Première Fois (Fix Initial)

1. **Déploiement automatique (recommandé):**
   ```bash
   # Windows
   scripts\deploy_email_fix.bat

   # Linux/Mac
   bash scripts/deploy_email_fix.sh
   ```

2. **OU Déploiement manuel:**
   ```bash
   # Étape 1: Nettoyage
   supabase db execute --file scripts/cleanup_email_bounces.sql --project-ref cwtoprbowdqcemdjrtir

   # Étape 2: Configuration monitoring
   supabase db execute --file scripts/supabase_email_config.sql --project-ref cwtoprbowdqcemdjrtir

   # Étape 3: Vérification
   supabase db execute --file scripts/monitor_email_health.sql --project-ref cwtoprbowdqcemdjrtir
   ```

3. **Actions manuelles Dashboard:**
   - Désactiver "Enable email confirmations"
   - Désactiver "Enable email change confirmations"
   - Vérifier bounce rate après 24h

### Monitoring Continu

1. **Setup cron job:**
   ```bash
   chmod +x scripts/cron_email_monitor.sh
   crontab -e
   # Ajouter: */30 * * * * /path/to/scripts/cron_email_monitor.sh >> /var/log/email_monitor.log 2>&1
   ```

2. **Vérification manuelle hebdomadaire:**
   ```bash
   supabase db execute --file scripts/monitor_email_health.sql --project-ref cwtoprbowdqcemdjrtir
   ```

---

## Fonctions SQL Disponibles

Une fois `supabase_email_config.sql` exécuté, ces fonctions sont disponibles:

### 1. `public.check_email_health()`
**Retourne:** Table avec métriques email (users, confirmations, emails failed)
**Usage:**
```sql
SELECT * FROM public.check_email_health();
```

### 2. `public.get_failed_emails(limit_rows)`
**Retourne:** Liste des emails échoués récents
**Usage:**
```sql
SELECT * FROM public.get_failed_emails(10);  -- 10 derniers emails failed
```

### 3. `public.alert_high_bounce_rate(threshold_percent)`
**Retourne:** Alerte si bounce rate > seuil
**Usage:**
```sql
SELECT * FROM public.alert_high_bounce_rate(5.0);  -- Alerte si > 5%
```

### 4. `public.log_email_event(...)`
**Description:** Logger un événement email custom
**Usage:**
```sql
SELECT public.log_email_event(
  p_user_id := auth.uid(),
  p_event_type := 'signup',
  p_email := 'user@example.com',
  p_status := 'skipped',
  p_error := NULL,
  p_metadata := '{"reason": "email_confirmations_disabled"}'::jsonb
);
```

---

## Tables Créées

### `public.email_monitoring`
**Description:** Logs des événements email
**Colonnes:**
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `event_type` (signup/email_change/password_recovery/email_sent)
- `email_address` (TEXT)
- `status` (success/skipped/failed)
- `error_message` (TEXT, nullable)
- `metadata` (JSONB, nullable)
- `created_at` (TIMESTAMPTZ)

**RLS:**
- Admins voient tout
- Users voient leurs propres logs

**Usage:**
```sql
-- Voir tous les événements
SELECT * FROM public.email_monitoring ORDER BY created_at DESC;

-- Événements failed
SELECT * FROM public.email_monitoring WHERE status = 'failed';

-- Événements pour un user
SELECT * FROM public.email_monitoring WHERE user_id = 'uuid-here';
```

---

## Views Créées

### `public.email_monitoring_summary`
**Description:** Résumé des événements email par jour/type/statut
**Usage:**
```sql
SELECT * FROM public.email_monitoring_summary
WHERE day >= NOW() - INTERVAL '7 days'
ORDER BY day DESC;
```

---

## Troubleshooting

### Erreur: "permission denied for table auth.email_messages"
**Cause:** Pas d'accès aux tables système auth
**Solution:** Normal - les fonctions gèrent cette erreur gracieusement

### Erreur: "relation public.email_monitoring does not exist"
**Cause:** `supabase_email_config.sql` pas exécuté
**Solution:**
```bash
supabase db execute --file scripts/supabase_email_config.sql --project-ref cwtoprbowdqcemdjrtir
```

### Bounce rate ne baisse pas après 24h
**Causes possibles:**
1. Dashboard: `enable_confirmations` toujours ON
2. Triggers custom envoient encore des emails
3. SMTP configuré avec mauvaises credentials

**Solutions:**
1. Vérifier Dashboard > Authentication > Email Settings
2. Chercher triggers: `SELECT * FROM pg_trigger WHERE tgname LIKE '%email%';`
3. Désactiver SMTP temporairement ou configurer Mailtrap

---

## Configuration Recommandée

### Développement

**config.toml:**
```toml
[auth.email]
enable_signup = true
enable_confirmations = false
double_confirm_changes = false
secure_email_change_enabled = false
```

**Dashboard:**
- Enable email confirmations: OFF
- Enable email change confirmations: OFF

**SMTP:** Mailtrap (https://mailtrap.io)

### Production

**config.toml:**
```toml
[auth.email]
enable_signup = true
enable_confirmations = true
double_confirm_changes = true
secure_email_change_enabled = true
```

**Dashboard:**
- Enable email confirmations: ON
- Enable email change confirmations: ON

**SMTP:** Resend, SendGrid, ou AWS SES

---

## Support

**Documentation complète:** `docs/EMAIL_BOUNCE_FIX.md`
**Guide rapide:** `DEPLOY_EMAIL_FIX.md`
**Supabase Docs:** https://supabase.com/docs/guides/auth/auth-email
**Support Supabase:** https://supabase.com/support

---

**Dernière mise à jour:** 2026-01-28
**Projet:** cwtoprbowdqcemdjrtir (Squad Planner)
