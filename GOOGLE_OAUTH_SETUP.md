# 🔐 Configuration Google OAuth & Calendar API

## ⚠️ OBLIGATOIRE AVANT DÉPLOIEMENT

Cette configuration est **obligatoire** pour activer la synchronisation Google Calendar.

---

## 📋 Étapes de configuration

### 1️⃣ Créer un projet Google Cloud

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquer sur **"Sélectionner un projet"** → **"Nouveau projet"**
3. Nom du projet: `Squad Planner` (ou autre)
4. Cliquer sur **"Créer"**
5. Attendre la création du projet (10-30 secondes)
6. Sélectionner le projet créé

---

### 2️⃣ Activer Google Calendar API

1. Dans le menu de gauche: **APIs & Services** → **Library**
2. Rechercher: `Google Calendar API`
3. Cliquer sur **Google Calendar API**
4. Cliquer sur **"ENABLE"** (Activer)
5. Attendre l'activation (5-10 secondes)

---

### 3️⃣ Configurer l'écran de consentement OAuth

1. Dans le menu de gauche: **APIs & Services** → **OAuth consent screen**
2. Sélectionner: **External** (Externe)
3. Cliquer sur **"CREATE"**

#### Informations de l'application
- **App name**: `Squad Planner`
- **User support email**: Votre email
- **App logo**: (Optionnel)
- **Application home page**: `https://[YOUR_DOMAIN].com`
- **Application privacy policy**: `https://[YOUR_DOMAIN].com/privacy`
- **Application terms of service**: `https://[YOUR_DOMAIN].com/terms`
- **Authorized domains**: 
  - `supabase.co`
  - `[YOUR_DOMAIN].com`
- **Developer contact email**: Votre email

4. Cliquer sur **"SAVE AND CONTINUE"**

#### Scopes (Autorisations)
1. Cliquer sur **"ADD OR REMOVE SCOPES"**
2. Rechercher et sélectionner:
   - ✅ `https://www.googleapis.com/auth/userinfo.profile`
   - ✅ `https://www.googleapis.com/auth/userinfo.email`
   - ✅ `https://www.googleapis.com/auth/calendar`
   - ✅ `https://www.googleapis.com/auth/calendar.events`
3. Cliquer sur **"UPDATE"**
4. Cliquer sur **"SAVE AND CONTINUE"**

#### Test users (Mode développement)
1. Ajouter votre email de test
2. Cliquer sur **"ADD"**
3. Cliquer sur **"SAVE AND CONTINUE"**

#### Summary
1. Vérifier les informations
2. Cliquer sur **"BACK TO DASHBOARD"**

---

### 4️⃣ Créer les credentials OAuth 2.0

1. Dans le menu de gauche: **APIs & Services** → **Credentials**
2. Cliquer sur **"+ CREATE CREDENTIALS"** → **OAuth client ID**
3. Sélectionner: **Web application**

#### Configuration
- **Name**: `Squad Planner Web Client`
- **Authorized JavaScript origins**: 
  - `https://[PROJECT_ID].supabase.co`
  - `https://[YOUR_DOMAIN].com`
- **Authorized redirect URIs**:
  - `https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/oauth/google/callback`

⚠️ **IMPORTANT**: Remplacez `[PROJECT_ID]` par votre vrai PROJECT_ID Supabase !

4. Cliquer sur **"CREATE"**

#### Copier les credentials
Une popup s'affiche avec:
- **Client ID**: `123456789-abcdefgh.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abcdefghijklmnop`

⚠️ **COPIEZ CES VALEURS IMMÉDIATEMENT** (vous en aurez besoin à l'étape suivante)

---

### 5️⃣ Configurer les secrets Supabase

1. Aller sur [Supabase Dashboard](https://app.supabase.com/)
2. Sélectionner votre projet Squad Planner
3. Menu de gauche: **Edge Functions** → **Secrets**
4. Ajouter les secrets suivants:

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=123456789-abcdefgh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
```

5. Cliquer sur **"Save"** pour chaque secret

---

### 6️⃣ Re-déployer le backend

```bash
# Re-deploy pour charger les nouveaux secrets
supabase functions deploy make-server-e884809f
```

---

## ✅ Tester l'intégration

### Test 1: OAuth Flow
1. Aller sur votre app Squad Planner
2. Naviguer vers **Profil** → **Paramètres** → **Intégrations**
3. Cliquer sur **"Connecter Google Calendar"**
4. Accepter les autorisations Google
5. Vérifier que le status passe à **"Connecté"** ✅

### Test 2: Sync Session
1. Créer une session de jeu
2. Confirmer votre participation (RSVP)
3. Cliquer sur **"Ajouter à Google Calendar"**
4. Vérifier que le toast affiche **"Session ajoutée à Google Calendar !"**
5. Ouvrir Google Calendar et vérifier que l'événement est créé ✅

---

## 🐛 Troubleshooting

### Erreur: "Google Calendar non connecté"
**Solution**: Aller dans Paramètres → Intégrations → Connecter Google

### Erreur: "redirect_uri_mismatch"
**Solution**: Vérifier que l'URI dans Google Cloud Console correspond **exactement** à:
```
https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/oauth/google/callback
```

### Erreur: "invalid_client"
**Solution**: Vérifier que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont bien configurés dans Supabase Secrets

### Erreur: "insufficient_permissions"
**Solution**: Vérifier que les scopes Calendar sont bien activés dans Google Cloud Console

### Erreur: "calendar_api_not_enabled"
**Solution**: Activer Google Calendar API dans Google Cloud Console

---

## 🔒 Sécurité

### Bonnes pratiques
- ✅ Ne **JAMAIS** commit les secrets dans Git
- ✅ Utiliser uniquement HTTPS en production
- ✅ Restreindre les domaines autorisés
- ✅ Activer 2FA sur votre compte Google Cloud
- ✅ Monitorer les quotas API

### Quotas Google Calendar API (Gratuit)
- **Requêtes par jour**: 1,000,000
- **Requêtes par utilisateur par seconde**: 10
- **Requêtes par projet par seconde**: 500

Pour Squad Planner, ces quotas sont **largement suffisants** pour un usage normal.

---

## 📊 Monitoring

### Logs Supabase
Vérifier les logs de la fonction:
```bash
# Dashboard Supabase → Edge Functions → make-server-e884809f → Logs
```

Rechercher:
- ✅ `Calendar event created: evt_123456`
- ❌ `Failed to create calendar event: ...`

### Logs Google Cloud
1. Google Cloud Console → **APIs & Services** → **Dashboard**
2. Cliquer sur **Google Calendar API**
3. Onglet **"Metrics"** → Vérifier les requêtes

---

## 🎯 Checklist finale

Avant de considérer l'intégration comme complète:

- [ ] Projet Google Cloud créé
- [ ] Google Calendar API activée
- [ ] Écran de consentement OAuth configuré
- [ ] Scopes Calendar ajoutés
- [ ] Credentials OAuth 2.0 créés
- [ ] Redirect URI configurée correctement
- [ ] Secrets Supabase configurés
- [ ] Backend re-déployé
- [ ] Test OAuth flow réussi
- [ ] Test sync session réussi
- [ ] Event visible dans Google Calendar

---

## 📞 Support

**Problème persistant ?**

1. Vérifier les logs Supabase
2. Vérifier les métriques Google Cloud
3. Vérifier que tous les secrets sont bien configurés
4. Re-déployer le backend

**Documentation officielle**:
- [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Configuration complétée** ✅  
**Date**: _______________  
**Par**: _______________
