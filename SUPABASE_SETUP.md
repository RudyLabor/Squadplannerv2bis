# 🗄️ Configuration Supabase - Squad Planner

Guide complet pour configurer Supabase en local et en production pour Squad Planner.

---

## 📋 Prérequis

- ✅ Compte Supabase (gratuit)
- ✅ Docker Desktop (pour Supabase local)
- ✅ Supabase CLI installée

---

## 🔧 Installation Supabase CLI

### macOS / Linux

```bash
# Via Homebrew
brew install supabase/tap/supabase

# Ou via npm
npm install -g supabase
```

### Windows

```bash
# Via npm
npm install -g supabase

# Ou via Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Vérification

```bash
supabase --version
# Output: 1.x.x
```

---

## 🌐 Étape 1 : Créer un projet Supabase

### Via Dashboard Web

1. Aller sur [https://app.supabase.com](https://app.supabase.com)
2. Cliquer **"New Project"**
3. Remplir :
   - **Name** : `squad-planner`
   - **Database Password** : Générer un mot de passe fort (SAUVEGARDER !)
   - **Region** : Choisir la plus proche (ex: `eu-west-1` pour Europe)
   - **Pricing Plan** : Free (suffisant pour commencer)
4. Cliquer **"Create new project"**
5. ⏱️ Attendre ~2 minutes

### Récupérer les clés

Une fois le projet créé :

1. Aller dans **Settings** → **API**
2. Copier :

```bash
# Project URL
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# anon public (clé publique - OK pour frontend)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# service_role (clé privée - JAMAIS dans frontend !)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Copier aussi :

```bash
# Database URL (pour connexions directes si besoin)
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

---

## 📝 Étape 2 : Configurer les variables d'environnement

### Fichier .env local

```bash
# Dans le dossier du projet
cp .env.example .env
```

Éditer `.env` :

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_URL=postgresql://postgres:...
```

⚠️ **IMPORTANT** : Ne jamais commiter `.env` sur Git !

---

## 🚀 Étape 3 : Configurer l'authentification

### Via Dashboard

1. **Authentication** → **Providers**
2. Configurer **Email** :
   - ✅ Enable Email provider
   - **Email confirmations** : 
     - Développement : ❌ Désactiver (auto-confirm)
     - Production : ✅ Activer (sécurité)
   - **Template URL** : `https://votre-domaine.com`

3. **Optionnel** : Configurer OAuth

#### Google OAuth
1. Créer app OAuth sur [Google Cloud Console](https://console.cloud.google.com/)
2. Dans Supabase : **Authentication** → **Providers** → **Google**
3. Ajouter :
   - Client ID
   - Client Secret
   - ✅ Enable Google provider

#### GitHub OAuth
1. Créer app OAuth sur [GitHub Settings](https://github.com/settings/developers)
2. Dans Supabase : **Authentication** → **Providers** → **GitHub**
3. Ajouter Client ID et Secret

### Configuration URL

Dans **Authentication** → **URL Configuration** :

```bash
# Site URL (production)
https://squad-planner.vercel.app

# Redirect URLs (ajouter tous les domaines)
https://squad-planner.vercel.app
https://squad-planner.vercel.app/**
https://*.vercel.app
http://localhost:5173
http://localhost:3000
```

---

## 📦 Étape 4 : Déployer les Edge Functions

### Se connecter

```bash
# Login Supabase CLI
supabase login

# Lier le projet local
supabase link --project-ref xxxxxxxxxxxxx
```

### Déployer la fonction server

```bash
# Déployer
supabase functions deploy server

# Vérifier le déploiement
curl https://xxxxxxxxxxxxx.supabase.co/functions/v1/make-server-e884809f/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "timestamp": "2026-01-24T..."
}
```

### Configurer les secrets

```bash
# Secrets nécessaires pour la fonction
supabase secrets set SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vérifier les secrets
supabase secrets list
```

### Logs en temps réel

```bash
# Voir les logs de la fonction
supabase functions serve server

# Ou via dashboard
# Functions → server → Logs
```

---

## 🗄️ Étape 5 : Configurer la base de données

### Table KV Store (déjà créée par défaut)

Le projet utilise une table key-value `kv_store_e884809f` automatiquement gérée.

Structure :
```sql
CREATE TABLE kv_store_e884809f (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Appliquer les migrations (optionnel)

```bash
# Pousser les migrations vers Supabase
supabase db push

# Ou via Dashboard : Database → Migrations
```

### Row Level Security (RLS)

La table est protégée par RLS. Policy par défaut :
- Les utilisateurs peuvent accéder à leurs propres données
- Le service role peut tout accéder

Pour voir/modifier : **Database** → **kv_store_e884809f** → **RLS Policies**

---

## 💾 Étape 6 : Configurer le Storage (optionnel)

Si vous avez besoin de stocker des fichiers (avatars, etc.) :

### Créer un bucket

Via Dashboard : **Storage** → **New bucket**

```bash
Bucket name: avatars
Public: false (ou true si images publiques)
File size limit: 5MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

### Via code (dans Edge Function)

```typescript
const { data: buckets } = await supabase.storage.listBuckets();
const bucketExists = buckets?.some(b => b.name === 'avatars');

if (!bucketExists) {
  await supabase.storage.createBucket('avatars', {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
  });
}
```

---

## 🧪 Étape 7 : Supabase Local (Développement)

### Démarrer Supabase localement

```bash
# Première fois (initialise le projet)
supabase init

# Démarrer tous les services
supabase start
```

Services démarrés :
- 🔧 API : `http://localhost:54321`
- 📊 Studio : `http://localhost:54323`
- 🗄️ DB : `postgresql://postgres:postgres@localhost:54322/postgres`
- 📨 Inbucket (emails) : `http://localhost:54324`

### Obtenir les clés locales

```bash
supabase status
```

Copier les clés affichées dans `.env` :
```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Servir les Edge Functions localement

```bash
# Dans un terminal séparé
supabase functions serve server

# La fonction sera accessible sur :
# http://localhost:54321/functions/v1/make-server-e884809f/
```

### Arrêter

```bash
supabase stop
```

---

## 🔄 Étape 8 : Synchronisation Local ↔ Cloud

### Pousser les changements locaux vers Supabase

```bash
# Migrations
supabase db push

# Edge Functions
supabase functions deploy server
```

### Tirer les changements de Supabase en local

```bash
# Base de données
supabase db pull

# Voir les différences
supabase db diff
```

---

## 📊 Étape 9 : Monitoring & Logs

### Via Dashboard

1. **Database** → **Queries** : Voir les requêtes actives
2. **Database** → **Logs** : Logs PostgreSQL
3. **Edge Functions** → **Logs** : Logs de vos fonctions
4. **Authentication** → **Users** : Voir les utilisateurs

### Via CLI

```bash
# Logs de la base de données
supabase db logs

# Logs des fonctions
supabase functions logs server

# Logs d'auth
supabase auth logs
```

---

## 🔐 Étape 10 : Sécurité en production

### Checklist

- [ ] **Service Role Key** : Jamais exposée dans le frontend
- [ ] **RLS activé** : Toutes les tables protégées
- [ ] **HTTPS uniquement** : Pas de HTTP en production
- [ ] **Auth URLs** : Correctement configurées
- [ ] **CORS** : Configuré pour vos domaines uniquement
- [ ] **Secrets** : Configurés via `supabase secrets set`
- [ ] **Database backups** : Activés (automatique sur plan payant)

### CORS dans Edge Function

Vérifier `/supabase/functions/server/index.tsx` :

```typescript
app.use("/*", cors({
  origin: [
    "https://squad-planner.vercel.app",
    "https://*.vercel.app",
    "http://localhost:5173",
  ],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
```

---

## 📈 Étape 11 : Optimisations

### Index pour performances

```sql
-- Créer des index sur les clés fréquemment accédées
CREATE INDEX idx_kv_key_prefix ON kv_store_e884809f (key text_pattern_ops);
CREATE INDEX idx_kv_updated_at ON kv_store_e884809f (updated_at DESC);
```

### Connection pooling

Pour beaucoup de connexions simultanées :

1. **Settings** → **Database** → **Connection Pooling**
2. Activer le pooler
3. Utiliser l'URL pooler : `postgresql://postgres.xxxxx.pooler.supabase.co:5432/postgres`

### Caching

Le projet utilise déjà un cache côté frontend (voir `/src/app/utils/cache.ts`).

---

## 🧹 Étape 12 : Nettoyage & Maintenance

### Supprimer les anciennes données

```sql
-- Exemple : Supprimer les sessions de plus de 6 mois
DELETE FROM kv_store_e884809f
WHERE key LIKE 'session:%'
AND (value->>'createdAt')::timestamptz < NOW() - INTERVAL '6 months';
```

### Backup manuel

```bash
# Backup de la base de données
supabase db dump -f backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## ✅ Checklist finale Supabase

### Setup initial
- [ ] Projet Supabase créé
- [ ] Clés API copiées
- [ ] Variables d'environnement configurées
- [ ] CLI installée et login OK

### Authentication
- [ ] Email provider configuré
- [ ] OAuth configuré (si besoin)
- [ ] URLs de redirection configurées
- [ ] Test login/signup fonctionne

### Edge Functions
- [ ] Fonction `server` déployée
- [ ] Secrets configurés
- [ ] Health check répond
- [ ] Logs accessibles

### Base de données
- [ ] Table KV store opérationnelle
- [ ] RLS configuré
- [ ] Migrations appliquées (si any)
- [ ] Index créés

### Storage (optionnel)
- [ ] Buckets créés
- [ ] Policies configurées
- [ ] Upload/download testés

### Monitoring
- [ ] Dashboard vérifié
- [ ] Logs accessibles
- [ ] Métriques suivies

---

## 🎉 Configuration terminée !

Votre backend Supabase est maintenant :
- ✅ Configuré en production
- ✅ Edge Functions déployées
- ✅ Auth opérationnelle
- ✅ Base de données prête
- ✅ Monitoring actif

**URLs importantes** :
- 🗄️ **Dashboard** : `https://app.supabase.com/project/xxxxx`
- 🔧 **API** : `https://xxxxx.supabase.co`
- 📊 **Studio** : `https://app.supabase.com/project/xxxxx/editor`
- 📝 **Logs** : `https://app.supabase.com/project/xxxxx/logs`

---

## 📞 Ressources

- 📖 [Supabase Documentation](https://supabase.com/docs)
- 📖 [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- 📖 [Authentication Guide](https://supabase.com/docs/guides/auth)
- 💬 [Supabase Discord](https://discord.supabase.com/)
- 🐛 [Supabase GitHub](https://github.com/supabase/supabase)

---

**Bon déploiement ! 🚀✨**
