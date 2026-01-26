# 🚀 Guide de Déploiement Automatique

Ce guide explique comment configurer le déploiement automatique de Squad Planner sur Vercel et Supabase.

---

## 📋 Prérequis

- ✅ Compte GitHub avec le repo Squad Planner
- ✅ Compte Vercel
- ✅ Compte Supabase
- ✅ Git installé localement

---

## 1️⃣ Configuration Vercel (Frontend)

### Étape 1: Connecter GitHub à Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Clique sur **"New Project"**
3. Sélectionne **"Import Git Repository"**
4. Choisis ton repo GitHub Squad Planner
5. Clique sur **"Import"**

### Étape 2: Configurer le Projet

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Étape 3: Variables d'Environnement

Ajoute ces variables dans **Settings → Environment Variables** :

```bash
VITE_SUPABASE_URL=https://[ton-projet].supabase.co
VITE_SUPABASE_ANON_KEY=[ta-clé-anon]
VITE_SUPABASE_PROJECT_ID=[ton-projet-id]
```

### Étape 4: Déployer

Clique sur **"Deploy"**. Vercel va :
- ✅ Installer les dépendances
- ✅ Build l'application
- ✅ Déployer sur un domaine .vercel.app
- ✅ Générer une URL de preview

### Étape 5: Déploiement Automatique

Vercel est maintenant configuré pour déployer automatiquement :

- ✅ **Branche `main`** → Déploiement en production
- ✅ **Pull Requests** → Déploiements de preview
- ✅ **Autres branches** → Déploiements de preview

**Chaque push sur `main` déclenchera un nouveau déploiement automatiquement ! 🎉**

---

## 2️⃣ Configuration Supabase (Backend)

### Étape 1: Connecter GitHub à Supabase

1. Va dans ton projet Supabase
2. Va dans **Database → Extensions**
3. Active l'extension **"http"** (si ce n'est pas déjà fait)

### Étape 2: Déploiement des Edge Functions

#### Option A: Via Supabase CLI (Recommandé)

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter à Supabase
supabase login

# Lier le projet
supabase link --project-ref [ton-projet-id]

# Déployer les fonctions
supabase functions deploy make-server-e884809f
```

#### Option B: Via GitHub Actions (CI/CD)

Crée `.github/workflows/deploy-supabase.yml` :

```yaml
name: Deploy Supabase Functions

on:
  push:
    branches:
      - main
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        
      - name: Deploy functions
        run: supabase functions deploy make-server-e884809f
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

Puis ajoute les secrets dans **GitHub → Settings → Secrets** :
- `SUPABASE_ACCESS_TOKEN`: Token d'accès Supabase
- `SUPABASE_PROJECT_ID`: ID de ton projet

### Étape 3: Variables d'Environnement Supabase

Dans Supabase, va dans **Settings → Edge Functions → Environment Variables** et ajoute :

```bash
SUPABASE_URL=https://[ton-projet].supabase.co
SUPABASE_ANON_KEY=[ta-clé-anon]
SUPABASE_SERVICE_ROLE_KEY=[ta-clé-service-role]
SUPABASE_DB_URL=[ton-db-url]
DISCORD_CLIENT_ID=[si nécessaire]
DISCORD_CLIENT_SECRET=[si nécessaire]
FRONTEND_URL=https://[ton-app].vercel.app
```

---

## 3️⃣ Workflow de Déploiement

### Développement Local

```bash
# 1. Faire des modifications
git add .
git commit -m "feat: nouvelle feature"

# 2. Push sur GitHub
git push origin main
```

### Déploiement Automatique

**Ce qui se passe automatiquement :**

1. **GitHub** reçoit le push
2. **Vercel** détecte le push et :
   - ✅ Clone le repo
   - ✅ Installe les dépendances
   - ✅ Build l'application
   - ✅ Déploie sur le domaine production
   - ✅ Envoie une notification
3. **Supabase** (si GitHub Actions configuré) :
   - ✅ Détecte les changements dans `/supabase/functions/`
   - ✅ Déploie les Edge Functions
   - ✅ Envoie une notification

**Durée totale : 2-5 minutes ⏱️**

---

## 4️⃣ Vérification du Déploiement

### Frontend (Vercel)

1. Va sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionne ton projet Squad Planner
3. Vérifie que le dernier déploiement est **"Ready"** ✅
4. Clique sur **"Visit"** pour voir l'app en production

### Backend (Supabase)

1. Va sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionne ton projet
3. Va dans **Edge Functions**
4. Vérifie que `make-server-e884809f` est déployée
5. Teste avec un appel :

```bash
curl https://[ton-projet].supabase.co/functions/v1/make-server-e884809f/auth/profile \
  -H "Authorization: Bearer [ta-clé-anon]"
```

---

## 5️⃣ Rollback en Cas de Problème

### Sur Vercel

1. Va dans **Deployments**
2. Trouve un déploiement précédent qui fonctionnait
3. Clique sur les **trois points** → **"Promote to Production"**

### Sur Supabase

```bash
# Redéployer une version précédente
supabase functions deploy make-server-e884809f --no-verify-jwt
```

---

## 6️⃣ Monitoring et Logs

### Logs Vercel

```bash
# Via CLI
vercel logs [deployment-url]

# Via Dashboard
Vercel → Ton projet → Deployments → [Cliquer sur un déploiement] → Logs
```

### Logs Supabase

```bash
# Via CLI
supabase functions logs make-server-e884809f

# Via Dashboard
Supabase → Edge Functions → make-server-e884809f → Logs
```

---

## 7️⃣ Optimisations

### Build Time

```json
// package.json
{
  "scripts": {
    "build": "vite build --mode production",
    "build:fast": "vite build --mode production --minify false"
  }
}
```

### Caching

Vercel cache automatiquement :
- ✅ `node_modules/`
- ✅ `.next/cache/`
- ✅ Build artifacts

### Preview Deployments

Chaque PR génère une URL de preview unique :
```
https://squad-planner-[hash].vercel.app
```

---

## 8️⃣ Domaine Personnalisé (Optionnel)

### Sur Vercel

1. Va dans **Settings → Domains**
2. Clique sur **"Add Domain"**
3. Entre ton domaine (ex: `squadplanner.com`)
4. Configure les DNS selon les instructions
5. Attends la propagation (5-60 minutes)

### DNS Records

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🎉 C'est Tout !

Maintenant, **chaque fois que tu push sur GitHub** :

1. ✅ Vercel déploie automatiquement le frontend
2. ✅ Supabase déploie automatiquement le backend (si configuré)
3. ✅ L'écosystème de démo se génère automatiquement au démarrage
4. ✅ Ton app est en production avec les dernières modifications !

---

## 🆘 Troubleshooting

### Déploiement Vercel échoue

```bash
# Vérifier les logs
vercel logs

# Vérifier les variables d'environnement
vercel env ls

# Redéployer manuellement
vercel --prod
```

### Edge Function ne se déploie pas

```bash
# Vérifier la syntaxe
deno check supabase/functions/server/index.tsx

# Redéployer avec verbose
supabase functions deploy make-server-e884809f --debug
```

### Variables d'environnement manquantes

```bash
# Lister les variables
vercel env ls
supabase secrets list

# Ajouter une variable
vercel env add VITE_SUPABASE_URL
supabase secrets set MY_SECRET=value
```

---

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase CLI](https://supabase.com/docs/guides/cli)
- [GitHub Actions pour Supabase](https://supabase.com/docs/guides/functions/deploy)

---

**Status:** ✅ Prêt pour la production
**Dernière mise à jour:** Janvier 2026
