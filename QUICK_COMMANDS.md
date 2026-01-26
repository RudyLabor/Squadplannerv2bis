# ⚡ Quick Commands - Squad Planner

Toutes les commandes essentielles en un coup d'œil.

---

## 🚀 Déploiement Rapide (20 min)

### ⚙️ Script automatique

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement automatique
./deploy.sh
```

Le script va:
- ✅ Vérifier les prérequis (Node, npm, Supabase CLI, Git)
- ✅ Build l'application
- ✅ Déployer sur Supabase
- ✅ Vérifier le health check
- ✅ Lister les secrets configurés

---

## 🔧 Configuration Supabase

### Login et link

```bash
# Se connecter
supabase login

# Lier le projet
supabase link --project-ref [PROJECT_ID]

# Vérifier le lien
supabase projects list
```

### Déployer la fonction

```bash
# Déployer make-server-e884809f
supabase functions deploy make-server-e884809f

# Voir les logs en temps réel
supabase functions logs make-server-e884809f --follow
```

### Gérer les secrets

```bash
# Lister les secrets
supabase secrets list

# Ajouter un secret
supabase secrets set SECRET_NAME=value

# Exemples:
supabase secrets set GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
supabase secrets set GOOGLE_CLIENT_SECRET=GOCSPX-xyz123

# Supprimer un secret
supabase secrets unset SECRET_NAME
```

### Health check

```bash
# Vérifier que le backend répond
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/health

# Réponse attendue:
# {"status":"ok","timestamp":"..."}
```

---

## 🔐 Configuration Google OAuth

### URLs importantes

```bash
# Google Cloud Console
https://console.cloud.google.com/

# Callback URL à configurer:
https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/oauth/google/callback
```

### Secrets à configurer

Après avoir créé les credentials OAuth sur Google Cloud:

```bash
supabase secrets set GOOGLE_CLIENT_ID=votre_client_id
supabase secrets set GOOGLE_CLIENT_SECRET=votre_client_secret

# Re-déployer pour appliquer
supabase functions deploy make-server-e884809f
```

**Guide complet**: Voir `/GOOGLE_OAUTH_SETUP.md`

---

## 🐙 Git & GitHub

### Premier commit et push

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🚀 Production v1.0.0 - Squad Planner ready for deployment"

# Ajouter remote GitHub
git remote add origin https://github.com/[USERNAME]/squad-planner.git

# Push vers main
git branch -M main
git push -u origin main
```

### Créer un tag de version

```bash
# Créer tag v1.0.0
git tag -a v1.0.0 -m "Production Release v1.0.0"

# Push le tag
git push origin v1.0.0

# Lister les tags
git tag -l
```

### Commits quotidiens

```bash
# Status
git status

# Ajouter changements
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin main
```

**Guide complet**: Voir `/GITHUB_SETUP.md`

---

## 🧪 Tests Production

### Tests manuels

```bash
# Lancer le guide de tests
cat PRODUCTION_TESTS.md

# Ou ouvrir dans un éditeur
code PRODUCTION_TESTS.md
```

**Durée**: 5 minutes  
**Tests**: 20 validations critiques

### Health checks automatiques

```bash
# Backend health
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/health

# Squads API
curl -H "Authorization: Bearer [ANON_KEY]" \
  https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/api/squads

# Sessions API
curl -H "Authorization: Bearer [ANON_KEY]" \
  https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/api/sessions
```

---

## 💻 Développement Local

### Installation

```bash
# Clone (si depuis GitHub)
git clone https://github.com/[USERNAME]/squad-planner.git
cd squad-planner

# Install dependencies
npm install

# Configure .env
cp .env.example .env
# Éditer .env avec vos clés
```

### Dev server

```bash
# Lancer dev server (port 5173)
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

### Supabase local (optionnel)

```bash
# Démarrer Supabase local
supabase start

# Studio local
http://localhost:54323

# Arrêter
supabase stop
```

---

## 📊 Monitoring & Logs

### Logs Supabase

```bash
# Logs Edge Functions
supabase functions logs make-server-e884809f --follow

# Logs base de données
supabase db logs

# Logs auth
supabase auth logs
```

### Dashboard Web

```bash
# Dashboard principal
https://app.supabase.com/project/[PROJECT_ID]

# Logs
https://app.supabase.com/project/[PROJECT_ID]/logs

# Métriques
https://app.supabase.com/project/[PROJECT_ID]/database/usage
```

---

## 🔍 Debug & Troubleshooting

### Problèmes courants

```bash
# Erreur: Function not found
supabase functions deploy make-server-e884809f

# Erreur: Not linked
supabase link --project-ref [PROJECT_ID]

# Erreur: Unauthorized
# → Vérifier les secrets:
supabase secrets list

# Erreur: CORS
# → Vérifier /supabase/functions/server/index.tsx
# → Les origins CORS doivent inclure votre domaine

# Erreur: OAuth redirect_uri_mismatch
# → Vérifier Google Cloud Console → Credentials
# → L'URI doit être exactement:
# https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/oauth/google/callback
```

### Logs frontend (browser)

```javascript
// Dans DevTools Console

// Vérifier le storage local
localStorage.getItem('supabase.auth.token')

// Vérifier les variables
console.log('Project ID:', import.meta.env.VITE_SUPABASE_URL)

// Test API call
fetch('https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 📦 Package Management

### NPM

```bash
# Install package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update packages
npm update

# Check outdated
npm outdated

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Audit sécurité

```bash
# Audit vulnerabilities
npm audit

# Fix automatique
npm audit fix

# Force fix
npm audit fix --force
```

---

## 🗄️ Database

### Accès direct

```bash
# Via Supabase CLI
supabase db shell

# Via psql
psql [DATABASE_URL]
```

### Queries utiles

```sql
-- Voir toutes les clés KV
SELECT key, value FROM kv_store_e884809f ORDER BY updated_at DESC LIMIT 10;

-- Compter les squads
SELECT COUNT(*) FROM kv_store_e884809f WHERE key LIKE 'squad:%';

-- Compter les sessions
SELECT COUNT(*) FROM kv_store_e884809f WHERE key LIKE 'session:%';

-- Compter les utilisateurs
SELECT COUNT(*) FROM kv_store_e884809f WHERE key LIKE 'user:%';

-- Dernières updates
SELECT key, updated_at FROM kv_store_e884809f ORDER BY updated_at DESC LIMIT 5;
```

### Backup

```bash
# Dump database
supabase db dump -f backup.sql

# Restore
psql [DATABASE_URL] < backup.sql
```

---

## 🔐 Sécurité

### Variables d'environnement

```bash
# JAMAIS commit ces fichiers:
.env
.env.local
.env.production

# Vérifier le .gitignore
cat .gitignore | grep .env

# Vérifier qu'aucun secret n'est commité
git grep -i "SERVICE_ROLE_KEY"
git grep -i "CLIENT_SECRET"
```

### Rotation des secrets

```bash
# 1. Générer nouveaux credentials sur Google Cloud
# 2. Mettre à jour les secrets Supabase
supabase secrets set GOOGLE_CLIENT_ID=nouveau_id
supabase secrets set GOOGLE_CLIENT_SECRET=nouveau_secret

# 3. Re-déployer
supabase functions deploy make-server-e884809f
```

---

## 📱 Mobile Testing

### Simulateurs iOS

```bash
# Via Xcode Simulator (macOS)
open -a Simulator

# Ou via browser DevTools
# Chrome: Cmd+Opt+M (Mac) / F12 → Toggle device toolbar
```

### Test Android

```bash
# Via Android Studio
# Ou via browser DevTools
```

### Remote debugging

```bash
# Chrome Remote Debugging
chrome://inspect/#devices

# Safari Web Inspector (iOS)
# Safari → Develop → [Device Name]
```

---

## 📄 Documentation

### Lire la doc

```bash
# Guide déploiement rapide (20 min)
cat DEPLOYMENT_20MIN.md

# Setup Supabase complet
cat SUPABASE_SETUP.md

# Setup Google OAuth
cat GOOGLE_OAUTH_SETUP.md

# Setup GitHub
cat GITHUB_SETUP.md

# Tests production
cat PRODUCTION_TESTS.md

# API documentation
cat API_DOCUMENTATION.md

# Architecture
cat ARCHITECTURE_2026.md
```

### Documentation en ligne

```bash
# Ouvrir dans browser
open DEPLOYMENT_20MIN.md
open SUPABASE_SETUP.md
```

---

## 🎯 Workflows Complets

### Workflow: Premier déploiement

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login et link
supabase login
supabase link --project-ref [PROJECT_ID]

# 3. Configurer les secrets
supabase secrets set GOOGLE_CLIENT_ID=...
supabase secrets set GOOGLE_CLIENT_SECRET=...

# 4. Déployer
./deploy.sh

# 5. Tester
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/health

# 6. Git push
git add .
git commit -m "🚀 Deploy v1.0.0"
git push origin main
git tag v1.0.0 && git push origin v1.0.0
```

### Workflow: Mise à jour

```bash
# 1. Coder les changements
# 2. Test local
npm run dev

# 3. Commit
git add .
git commit -m "feat: nouvelle feature"

# 4. Push
git push origin main

# 5. Deploy
supabase functions deploy make-server-e884809f

# 6. Vérifier
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f/health
```

### Workflow: Hotfix production

```bash
# 1. Identifier le bug
supabase functions logs make-server-e884809f --follow

# 2. Fix localement
# 3. Test
npm run build && npm run preview

# 4. Deploy immédiat
supabase functions deploy make-server-e884809f

# 5. Vérifier fix
# Tester manuellement

# 6. Commit après
git add .
git commit -m "fix: critical bug"
git push origin main
```

---

## 🎉 Checklist Déploiement

### Avant déploiement

- [ ] `npm install` OK
- [ ] `npm run build` OK sans erreurs
- [ ] Tests locaux passent
- [ ] `.env` configuré (mais PAS commité)
- [ ] `.gitignore` vérifié

### Pendant déploiement

- [ ] `supabase login` OK
- [ ] `supabase link` OK
- [ ] Secrets Supabase configurés
- [ ] `supabase functions deploy` OK
- [ ] Health check 200 OK

### Après déploiement

- [ ] Tests production (20/20)
- [ ] Discord OAuth fonctionne
- [ ] Google OAuth fonctionne
- [ ] Calendar sync fonctionne
- [ ] Logs sans erreurs
- [ ] Git commit + push + tag

---

## 📞 URLs de Référence

```bash
# Supabase Dashboard
https://app.supabase.com/project/[PROJECT_ID]

# Google Cloud Console
https://console.cloud.google.com/

# GitHub Repository
https://github.com/[USERNAME]/squad-planner

# Live Application
https://[PROJECT_ID].supabase.co

# API Endpoint
https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f
```

---

**Temps total déploiement**: 20 minutes  
**Documentation**: 6 guides complets  
**Status**: ✅ Production Ready

🚀 Squad Planner v1.0.0
