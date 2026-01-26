# 🔐 Configuration des Secrets GitHub

Pour activer le déploiement automatique, tu dois ajouter des secrets dans GitHub.

---

## 📍 Où Ajouter les Secrets

1. Va sur ton repo GitHub
2. Clique sur **Settings** (en haut à droite)
3. Dans le menu de gauche, clique sur **Secrets and variables** → **Actions**
4. Clique sur **New repository secret**

---

## 🔑 Secrets Requis

### Pour Vercel (Frontend)

```
VERCEL_TOKEN
├─ Où trouver: https://vercel.com/account/tokens
├─ Comment: Créer un nouveau token
└─ Nom: "GitHub Actions Token"

VERCEL_ORG_ID
├─ Où trouver: Vercel Dashboard → Settings → General
└─ Format: team_xxxxxxxxxxxxx ou user_xxxxxxxxxxxxx

VERCEL_PROJECT_ID
├─ Où trouver: Ton projet Vercel → Settings → General
└─ Format: prj_xxxxxxxxxxxxx

VITE_SUPABASE_URL
├─ Où trouver: Supabase Dashboard → Settings → API
└─ Format: https://xxxxx.supabase.co

VITE_SUPABASE_ANON_KEY
├─ Où trouver: Supabase Dashboard → Settings → API → anon public
└─ Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

VITE_SUPABASE_PROJECT_ID
├─ Où trouver: Supabase Dashboard → Settings → General → Reference ID
└─ Format: xxxxxxxxxxxxx (sans le .supabase.co)
```

### Pour Supabase (Backend)

```
SUPABASE_ACCESS_TOKEN
├─ Où trouver: https://supabase.com/dashboard/account/tokens
├─ Comment: Créer un nouveau token
└─ Nom: "GitHub Actions Deploy Token"

SUPABASE_PROJECT_ID
├─ Où trouver: Supabase Dashboard → Settings → General → Reference ID
└─ Format: xxxxxxxxxxxxx
```

---

## 📝 Checklist Complète

### Étape 1: Copier les Valeurs

- [ ] **VERCEL_TOKEN** → https://vercel.com/account/tokens
- [ ] **VERCEL_ORG_ID** → Vercel → Settings → General
- [ ] **VERCEL_PROJECT_ID** → Ton projet → Settings → General
- [ ] **VITE_SUPABASE_URL** → Supabase → Settings → API
- [ ] **VITE_SUPABASE_ANON_KEY** → Supabase → Settings → API
- [ ] **VITE_SUPABASE_PROJECT_ID** → Supabase → Settings → General
- [ ] **SUPABASE_ACCESS_TOKEN** → https://supabase.com/dashboard/account/tokens
- [ ] **SUPABASE_PROJECT_ID** → Supabase → Settings → General

### Étape 2: Ajouter sur GitHub

- [ ] Aller sur GitHub → Ton repo → Settings → Secrets and variables → Actions
- [ ] Cliquer **New repository secret** pour chaque secret
- [ ] Copier-coller la valeur exacte
- [ ] Cliquer **Add secret**

### Étape 3: Vérifier

- [ ] Tous les 8 secrets sont ajoutés
- [ ] Aucune faute de frappe dans les noms
- [ ] Les valeurs sont correctes

---

## 🎯 Guide Visuel

### 1. Trouver VERCEL_TOKEN

```
1. https://vercel.com/account/tokens
2. Cliquer "Create Token"
3. Nom: "GitHub Actions Token"
4. Scope: Full Account
5. Copier le token (une seule fois!)
```

### 2. Trouver VERCEL_ORG_ID et VERCEL_PROJECT_ID

```
1. Ouvrir Vercel Dashboard
2. Sélectionner ton projet Squad Planner
3. Settings → General
4. Copier "Project ID"
5. Pour ORG_ID: Account Settings → General
```

### 3. Trouver les Clés Supabase

```
1. Ouvrir Supabase Dashboard
2. Sélectionner ton projet
3. Settings → API
4. Copier:
   - URL (Project URL)
   - anon public key
   - Reference ID (pour PROJECT_ID)
```

### 4. Créer SUPABASE_ACCESS_TOKEN

```
1. https://supabase.com/dashboard/account/tokens
2. Cliquer "Generate New Token"
3. Nom: "GitHub Actions Deploy"
4. Copier le token immédiatement
```

---

## ✅ Vérification

Après avoir ajouté tous les secrets, tu peux vérifier :

1. Va dans **Actions** sur GitHub
2. Tu devrais voir les workflows :
   - ✅ Deploy to Vercel
   - ✅ Deploy Supabase Functions
3. Push un commit sur `main`
4. Regarde les workflows s'exécuter en temps réel

---

## 🐛 Troubleshooting

### Secret invalide

```
Error: Invalid token

Solution:
1. Vérifier que le token n'a pas expiré
2. Régénérer le token
3. Mettre à jour le secret GitHub
```

### Variable d'environnement manquante

```
Error: VITE_SUPABASE_URL is not defined

Solution:
1. Vérifier l'orthographe exacte du secret
2. S'assurer que tous les secrets sont ajoutés
3. Re-run le workflow
```

### Permission denied

```
Error: Permission denied

Solution:
1. Vérifier que le token a les bonnes permissions
2. Pour Vercel: Full Account access
3. Pour Supabase: Full access ou Functions deploy
```

---

## 🎉 Une Fois Configuré

Après configuration, **tout est automatique** :

```
git add .
git commit -m "feat: nouvelle feature"
git push origin main

↓

GitHub detecte le push
↓
Vercel déploie automatiquement (2-3 min)
↓
Supabase déploie automatiquement (1-2 min)
↓
✅ Ton app est en production !
```

---

## 📞 Aide

Si tu as des problèmes :

1. Vérifier que les secrets sont bien ajoutés
2. Vérifier l'orthographe exacte (sensible à la casse)
3. Re-run le workflow dans GitHub Actions
4. Consulter les logs détaillés du workflow

---

**Temps de configuration:** 10-15 minutes
**Déploiements suivants:** Automatiques ! 🚀
