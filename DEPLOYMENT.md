# 🚀 Guide de déploiement - Squad Planner

Ce guide vous accompagne pour déployer Squad Planner en production.

---

## 📋 Prérequis

Avant de déployer, assurez-vous d'avoir :

- ✅ Un compte [Vercel](https://vercel.com) (ou Netlify)
- ✅ Un compte [Supabase](https://supabase.com)
- ✅ Git configuré localement
- ✅ CLI Vercel installée : `npm i -g vercel`
- ✅ CLI Supabase installée : `npm i -g supabase`

---

## 🏗️ Architecture de déploiement

```
┌─────────────────────────────────────────────────────────┐
│                    UTILISATEURS                          │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│   VERCEL     │          │  SUPABASE    │
│  (Frontend)  │◄────────►│  (Backend)   │
│              │   API    │              │
│  React App   │  Calls   │ Edge Funcs   │
│  Vite Build  │          │ PostgreSQL   │
│  Static CDN  │          │ Auth         │
└──────────────┘          └──────────────┘
```

---

## 🎯 Étape 1 : Configuration Supabase

### 1.1 Créer un projet Supabase

1. Aller sur [https://app.supabase.com](https://app.supabase.com)
2. Cliquer sur **"New Project"**
3. Remplir :
   - **Name** : `squad-planner`
   - **Database Password** : Générer un mot de passe fort
   - **Region** : Choisir la plus proche de vos utilisateurs
4. Cliquer sur **"Create new project"**
5. Attendre ~2 minutes que le projet soit prêt

### 1.2 Récupérer les clés API

1. Aller dans **Settings** → **API**
2. Copier :
   - **Project URL** : `https://xxx.supabase.co`
   - **anon public** : Clé publique (safe pour frontend)
   - **service_role** : Clé privée (⚠️ JAMAIS dans le frontend)

### 1.3 Configurer l'authentification

1. Aller dans **Authentication** → **Providers**
2. Configurer **Email** :
   - ✅ Enable Email provider
   - ✅ Enable Email confirmations (désactiver en dev)
3. **Optionnel** : Configurer OAuth (Google, GitHub)

### 1.4 Déployer les Edge Functions

```bash
# Se connecter à Supabase
supabase login

# Lier votre projet local
supabase link --project-ref your-project-id

# Déployer la fonction server
supabase functions deploy server

# Configurer les secrets
supabase secrets set SUPABASE_URL=https://xxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 1.5 Vérifier le déploiement

```bash
# Tester la fonction
curl https://xxx.supabase.co/functions/v1/make-server-e884809f/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2026-01-24T..."
}
```

---

## 🌐 Étape 2 : Déploiement Frontend (Vercel)

### 2.1 Connecter le repo GitHub

**Option A : Via Vercel Dashboard (Recommandé)**

1. Aller sur [https://vercel.com](https://vercel.com)
2. Cliquer **"Add New Project"**
3. Importer le repo GitHub `squad-planner`
4. Vercel détecte automatiquement Vite

**Option B : Via CLI**

```bash
# Depuis le dossier du projet
vercel

# Suivre les prompts
# - Set up and deploy: Y
# - Which scope: Votre compte
# - Link to existing project: N
# - Project name: squad-planner
# - Directory: ./
# - Override build command: N
# - Override output directory: N
```

### 2.2 Configurer les variables d'environnement

**Via Dashboard Vercel** :

1. Aller dans **Settings** → **Environment Variables**
2. Ajouter les variables **obligatoires** :

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `your_anon_key` | Production, Preview, Development |

3. Ajouter les variables **optionnelles** (selon les fonctionnalités activées) :

| Name | Value | Environment | Fonction |
|------|-------|-------------|----------|
| `VITE_VAPID_PUBLIC_KEY` | `your_vapid_public_key` | Production | Web Push Notifications |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` | Production | Paiements Premium |
| `VITE_STRIPE_PREMIUM_PRICE_ID` | `price_xxx` | Production | Prix Premium |
| `VITE_STRIPE_PRO_PRICE_ID` | `price_xxx` | Production | Prix Pro |
| `VITE_API_URL` | `https://your-api.com` | Production | Backend personnalisé |

**Via CLI** :

```bash
# Variables obligatoires
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Variables optionnelles (Web Push)
vercel env add VITE_VAPID_PUBLIC_KEY production

# Variables optionnelles (Stripe)
vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
vercel env add VITE_STRIPE_PREMIUM_PRICE_ID production
vercel env add VITE_STRIPE_PRO_PRICE_ID production
```

### 2.3 Déployer

```bash
# Déploiement en production
vercel --prod

# Ou push sur GitHub (déploiement auto si connecté)
git push origin main
```

### 2.4 Vérifier le déploiement

1. Vercel vous donne une URL : `https://squad-planner.vercel.app`
2. Ouvrir l'URL dans le navigateur
3. Vérifier que l'app se charge
4. Tester la connexion/inscription

---

## 🔧 Étape 3 : Configuration des fonctionnalités avancées

### 3.1 Web Push Notifications

1. **Générer les clés VAPID** :
```bash
npx web-push generate-vapid-keys
```

2. **Configurer dans Vercel** :
   - Ajouter la clé publique VAPID dans les variables d'environnement
   - La clé privée doit rester sur le backend (ne JAMAIS l'exposer)

3. **Vérifier le Service Worker** :
   - Le fichier `public/sw.js` est déjà configuré
   - Vercel le servira automatiquement à la racine

4. **Tester** :
   - Ouvrir l'app déployée
   - Aller dans Paramètres → Notifications
   - Activer les notifications push
   - Tester avec le bouton "Test"

### 3.2 Webhooks Discord

1. **Créer un Webhook Discord** :
   - Paramètres du serveur → Intégrations → Webhooks
   - Nouveau Webhook
   - Copier l'URL

2. **Configurer dans l'app** :
   - Connexion → Sélectionner un squad
   - Intégrations → Discord Bot
   - Coller l'URL du webhook
   - Sélectionner les événements à notifier

3. **Tester** :
   - Créer une session
   - Vérifier que la notification apparaît dans Discord

### 3.3 Intégrations OAuth (Optionnel)

Pour activer Discord, Google Calendar, Twitch, etc:

1. **Dans Supabase** :
   - Authentication → Providers
   - Activer chaque provider souhaité
   - Configurer les credentials OAuth

2. **Ajouter les Redirect URIs** :
   ```
   https://your-domain.vercel.app/oauth/callback
   https://*.vercel.app/oauth/callback
   ```

3. **Providers supportés** :
   - Discord
   - Google (Calendar sync)
   - Twitch
   - Steam
   - Riot Games
   - Battle.net

### 3.4 Stripe (Paiements Premium)

1. **Créer un compte Stripe** :
   - https://dashboard.stripe.com

2. **Créer des produits** :
   - Products → Add Product
   - Créer "Squad Planner Premium" (mensuel/annuel)
   - Créer "Squad Planner Pro" (mensuel/annuel)
   - Copier les Price IDs

3. **Configurer les webhooks** :
   - Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://your-api.com/webhooks/stripe`
   - Événements à écouter:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

4. **Ajouter les clés dans Vercel** :
   - Clé publique (commence par `pk_`)
   - Price IDs des produits

5. **Tester** :
   - Mode test d'abord (clés `pk_test_`)
   - Puis passer en production (clés `pk_live_`)

---

## 🔐 Étape 4 : Configuration Auth URL

### 3.1 Mise à jour Supabase

Dans Supabase Dashboard :

1. **Authentication** → **URL Configuration**
2. **Site URL** : `https://squad-planner.vercel.app`
3. **Redirect URLs** : Ajouter :
   ```
   https://squad-planner.vercel.app
   https://squad-planner.vercel.app/**
   https://*.vercel.app
   ```

---

## 🎨 Étape 4 : Configuration du domaine (Optionnel)

### 4.1 Ajouter un domaine personnalisé

Dans Vercel :

1. **Settings** → **Domains**
2. Ajouter votre domaine : `squad-planner.app`
3. Suivre les instructions DNS :
   - Ajouter un record `A` ou `CNAME` chez votre registrar
   - Vercel vérifie automatiquement

### 4.2 Mise à jour des URLs

1. Mettre à jour Supabase Auth URLs avec le nouveau domaine
2. Mettre à jour les variables d'environnement si nécessaire

---

## ⚡ Étape 5 : Optimisations production

### 5.1 Build optimisé

Le `vite.config.ts` est déjà configuré pour :
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Compression

### 5.2 Vercel Analytics (Optionnel)

```bash
# Installer Vercel Analytics
pnpm add @vercel/analytics

# Dans src/app/App.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### 5.3 Caching Headers

Vercel configure automatiquement les headers optimaux pour :
- Assets statiques (1 an)
- HTML (pas de cache)
- API routes (configurable)

---

## 📊 Étape 6 : Monitoring

### 6.1 Supabase Dashboard

Monitorer :
- **Database** → Queries, Connections
- **Edge Functions** → Invocations, Errors
- **Auth** → User signups, Active sessions

### 6.2 Vercel Analytics

Voir :
- **Performance** : Core Web Vitals
- **Traffic** : Pages views, Unique visitors
- **Errors** : Runtime errors

### 6.3 Performance Debug Panel (Dev)

L'app inclut un panneau de debug :
- Cliquer 5× sur le logo pour l'activer
- Voir les métriques en temps réel

---

## 🔄 Déploiement continu (CI/CD)

### Workflow GitHub Actions automatique

Vercel déploie automatiquement sur :
- **Production** : Push sur `main`
- **Preview** : Pull Requests

Configuration `.github/workflows/ci.yml` (optionnel) :

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm build
```

---

## 🚨 Troubleshooting

### Problème : Build fail sur Vercel

**Solution** :
```bash
# Vérifier localement
pnpm build

# Si succès local mais fail sur Vercel :
# - Vérifier Node version (Settings → General → Node Version)
# - Doit être 18.x ou 20.x
```

### Problème : Erreur CORS

**Solution** :
```typescript
// Vérifier dans /supabase/functions/server/index.tsx
app.use(
  "/*",
  cors({
    origin: "*", // Ou spécifier votre domaine
    allowHeaders: ["Content-Type", "Authorization"],
  })
);
```

### Problème : Auth redirect loop

**Solution** :
1. Vérifier Site URL dans Supabase
2. Vérifier Redirect URLs incluent tous les domaines
3. Vider le cache du navigateur

### Problème : Edge Function timeout

**Solution** :
```typescript
// Optimiser les requêtes DB
// Utiliser le cache pour les données fréquentes
// Limiter les appels en série (préférer parallèle)
```

---

## 📝 Checklist finale

Avant de considérer le déploiement comme complet :

### Frontend
- [ ] App se charge sans erreur
- [ ] Login/Signup fonctionnent
- [ ] Toutes les pages principales accessibles
- [ ] Responsive (mobile, tablette, desktop)
- [ ] Performance > 90 (Lighthouse)
- [ ] Domaine personnalisé configuré (optionnel)

### Backend
- [ ] Edge Function déployée
- [ ] Health check répond
- [ ] Auth fonctionne
- [ ] API endpoints répondent
- [ ] Logs accessibles

### Sécurité
- [ ] Service Role Key jamais exposée
- [ ] HTTPS uniquement
- [ ] Auth URLs correctement configurées
- [ ] Policies RLS activées (si utilisé)

### Monitoring
- [ ] Vercel Analytics actif
- [ ] Supabase logs configurés
- [ ] Error tracking (Sentry optionnel)

---

## 🎉 Déploiement réussi !

Votre application Squad Planner est maintenant **live en production** ! 🚀

**URLs importantes** :
- 📱 **App** : `https://squad-planner.vercel.app`
- 🔧 **Vercel Dashboard** : `https://vercel.com/dashboard`
- 🗄️ **Supabase Dashboard** : `https://app.supabase.com`

---

## 🔄 Mises à jour futures

Pour déployer des updates :

```bash
# 1. Développer localement
git checkout -b feature/new-feature
# ... développer ...

# 2. Commit et push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 3. Créer une PR sur GitHub
# 4. Review et merge dans main
# 5. Vercel déploie automatiquement !
```

---

## 📞 Support

Besoin d'aide ?
- 📖 [Documentation complète](./README_PREMIUM.md)
- 🐛 [Issues GitHub](https://github.com/votre-org/squad-planner/issues)
- 💬 [Discussions](https://github.com/votre-org/squad-planner/discussions)

---

**Bon déploiement ! 🎮✨**
