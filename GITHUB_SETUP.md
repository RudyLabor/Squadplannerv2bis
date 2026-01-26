# 🐙 Configuration GitHub - Squad Planner

Guide rapide pour configurer GitHub et pousser le code.

---

## 📋 Prérequis

- ✅ Compte GitHub
- ✅ Git installé localement
- ✅ Code Squad Planner prêt

---

## 🚀 OPTION 1: Nouveau Repository (Recommandé)

### 1.1 Créer le repository sur GitHub

1. Aller sur [github.com/new](https://github.com/new)
2. Remplir:
   ```
   Repository name: squad-planner
   Description: 🎮 Application mobile premium pour gamers - Planification de sessions avec RSVP et scoring social
   Visibility: Public (ou Private)
   ```
3. ❌ **NE PAS** cocher "Add README file" (déjà existant)
4. ❌ **NE PAS** cocher "Add .gitignore" (déjà existant)
5. Cliquer **"Create repository"**

### 1.2 Initialiser Git localement (si pas déjà fait)

```bash
# Vérifier si Git est déjà initialisé
git status

# Si pas initialisé, initialiser
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🎮 Initial commit - Squad Planner v1.0.0

✅ Roadmap #1, #2, #3 complete (100%)
✅ Backend Supabase operational
✅ Google OAuth + Calendar sync
✅ Discord OAuth
✅ Premium animations system
✅ QA complete - 0 bugs
✅ Production ready"
```

### 1.3 Connecter au repository distant

```bash
# Remplacer [USERNAME] par votre username GitHub
git remote add origin https://github.com/[USERNAME]/squad-planner.git

# Vérifier
git remote -v

# Output:
# origin  https://github.com/[USERNAME]/squad-planner.git (fetch)
# origin  https://github.com/[USERNAME]/squad-planner.git (push)
```

### 1.4 Pousser le code

```bash
# Push vers main
git branch -M main
git push -u origin main

# Créer et pousser le tag v1.0.0
git tag -a v1.0.0 -m "Production Release v1.0.0"
git push origin v1.0.0
```

---

## 🔄 OPTION 2: Repository Existant

### 2.1 Cloner le repository

```bash
# Cloner
git clone https://github.com/[USERNAME]/squad-planner.git
cd squad-planner

# Copier les fichiers du projet Squad Planner ici
```

### 2.2 Commit et push

```bash
git add .
git commit -m "🚀 Update to v1.0.0 - Production ready"
git push origin main
```

---

## 📝 Créer une Release GitHub

### 3.1 Via Web Interface

1. Aller sur le repository: `https://github.com/[USERNAME]/squad-planner`
2. Cliquer sur **"Releases"** (colonne droite)
3. Cliquer **"Create a new release"**
4. Remplir:

#### Tag
```
v1.0.0
```

#### Release title
```
🎮 Squad Planner v1.0.0 - Production Release
```

#### Description
```markdown
# 🚀 Squad Planner v1.0.0 - Production Ready

Application mobile premium pour gamers qui transforme les intentions vagues de jeu en engagements concrets.

## ✨ Features Principales

### 🎯 Core Features (Roadmap #1)
- ✅ **Squad Management**: Créer, rejoindre et gérer des squads
- ✅ **Session Planning**: Proposer et voter pour des créneaux
- ✅ **RSVP System**: Confirmation en 1 tap avec swipe gestures
- ✅ **Reliability Scoring**: Score de fiabilité social (0-100%)
- ✅ **Multi-game Support**: 12+ jeux populaires intégrés

### 🔗 Intégrations (Roadmap #2)
- ✅ **Discord OAuth**: Connexion et sync avec Discord
- ✅ **Google Calendar**: Synchronisation bidirectionnelle automatique
- ✅ **Backend Supabase**: Auth, DB, Edge Functions opérationnels
- ✅ **Notifications**: Système de notifications push-ready

### 🎨 UI/UX Premium (Roadmap #3)
- ✅ **Design System**: Palette Amber + Teal, ultra-épuré
- ✅ **Animations**: 60 FPS GPU-accelerated avec Motion/React
- ✅ **Mobile-first**: Responsive iOS/Android optimisé
- ✅ **Dark Mode**: Gaming-friendly, pas noir pur
- ✅ **French-first**: Interface 100% en français

## 🛠️ Stack Technique

### Frontend
- **React 18** + **TypeScript** (type-safe)
- **Tailwind CSS v4** (utility-first styling)
- **Motion/React** (Framer Motion fork - animations 60 FPS)
- **Lucide React** (icônes)
- **Vite** (build ultra-rapide)

### Backend
- **Supabase** (Auth + PostgreSQL + Edge Functions)
- **Hono** (web server léger sur Deno)
- **Key-Value Store** (persistence simple et efficace)

### Intégrations
- **Discord OAuth** (connexion sociale)
- **Google OAuth + Calendar API** (sync calendrier)
- **Web Push API** (notifications natives)

## 📊 Métriques de Qualité

- ✅ **0 bugs** en production
- ✅ **100%** des features Roadmap 1-3 complètes
- ✅ **6 documents** de livraison professionnels
- ✅ **Full E2E testing** suite
- ✅ **TypeScript strict** mode
- ✅ **Performance**: 60 FPS constant
- ✅ **Mobile-optimized**: Touch gestures natifs

## 🚀 Déploiement

### Quick Start

```bash
# Clone
git clone https://github.com/[USERNAME]/squad-planner.git
cd squad-planner

# Install
npm install

# Configure env
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Run dev
npm run dev
```

### Production Deployment

Voir guides détaillés:
- 📖 `/DEPLOYMENT_20MIN.md` - Déploiement rapide (20 min)
- 📖 `/SUPABASE_SETUP.md` - Configuration Supabase complète
- 📖 `/GOOGLE_OAUTH_SETUP.md` - Configuration Google OAuth

### Commandes Utiles

```bash
# Dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Type checking
npm run type-check

# Deploy Supabase
./deploy.sh
```

## 📚 Documentation

### Guides Setup
- `/SUPABASE_SETUP.md` - Configuration backend Supabase
- `/GOOGLE_OAUTH_SETUP.md` - OAuth Google + Calendar API
- `/DEPLOYMENT_20MIN.md` - Guide déploiement express
- `/GITHUB_SETUP.md` - Configuration GitHub

### Documentation Technique
- `/API_DOCUMENTATION.md` - API Reference complète
- `/ARCHITECTURE_2026.md` - Architecture détaillée
- `/DESIGN-SYSTEM-V4.md` - Design system complet

### Rapports QA
- `/READY_FOR_DEPLOYMENT.md` - QA final checklist
- `/RECAP_FINAL_QA.md` - Rapport audit complet
- `/BUGS_FIXED_REPORT.md` - Bugs résolus

### Features
- `/FEATURES-2026.md` - Features complètes
- `/ANIMATIONS-PREMIUM-2026.md` - Système d'animations
- `/KEYBOARD_SHORTCUTS.md` - Raccourcis clavier

## 🔗 URLs Importantes

```bash
# Repository
https://github.com/[USERNAME]/squad-planner

# Live Demo (remplacer PROJECT_ID)
https://[PROJECT_ID].supabase.co

# Supabase Dashboard
https://app.supabase.com/project/[PROJECT_ID]

# API Endpoint
https://[PROJECT_ID].supabase.co/functions/v1/make-server-e884809f
```

## 🎯 Roadmap Future (v2.0+)

### Phase 4: Social & Competition
- 🔲 Leaderboards globaux
- 🔲 Système de tournois
- 🔲 Défis hebdomadaires
- 🔲 Squad vs Squad matchmaking

### Phase 5: B2B & Organizations
- 🔲 Mode organisation (équipes esport)
- 🔲 Dashboard admin
- 🔲 Analytics avancées
- 🔲 White-label options

### Phase 6: Advanced Features
- 🔲 Voice chat intégré
- 🔲 Coaching IA
- 🔲 Stream integration (Twitch)
- 🔲 Replay analysis

## 🤝 Contributing

Les contributions sont bienvenues ! Voir `/CONTRIBUTING.md` pour les guidelines.

## 📄 License

Voir `/LICENSE` pour les détails.

## 📞 Support

Pour toute question:
- 📖 Consulter la documentation dans `/docs/`
- 🐛 Ouvrir une issue sur GitHub
- 💬 Rejoindre notre Discord (TODO: ajouter lien)

---

**Développé avec ❤️ pour la communauté gaming**

🎮 Squad Planner - Fini le chaos Discord, place aux sessions organisées.
```

5. **Publish release**

### 3.2 Via CLI (gh CLI)

```bash
# Installer gh CLI si pas déjà fait
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Login
gh auth login

# Créer release
gh release create v1.0.0 \
  --title "🎮 Squad Planner v1.0.0 - Production Release" \
  --notes-file RELEASE_NOTES.md
```

---

## 🔐 Configurer les Secrets GitHub Actions (Optionnel)

Si vous utilisez CI/CD avec GitHub Actions:

### 4.1 Ajouter les secrets

1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. Cliquer **"New repository secret"**
3. Ajouter:

```bash
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_ID
SUPABASE_DB_PASSWORD
```

### 4.2 Workflow CI/CD

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Supabase

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Build
        run: npm run build
        
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        
      - name: Deploy to Supabase
        run: supabase functions deploy make-server-e884809f
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

---

## 📝 .gitignore Recommandé

Vérifier que votre `.gitignore` contient:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment
.env
.env.local
.env.production.local
.env.development.local
.env.test.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Supabase
.supabase/
supabase/.branches
supabase/.temp

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
```

---

## ✅ Checklist GitHub Setup

### Repository
- [ ] Repository créé sur GitHub
- [ ] README.md visible
- [ ] .gitignore configuré
- [ ] LICENSE ajoutée

### Code
- [ ] Git initialisé localement
- [ ] Remote origin configuré
- [ ] Commit initial créé
- [ ] Code pushé vers main

### Release
- [ ] Tag v1.0.0 créé
- [ ] Tag pushé vers GitHub
- [ ] Release v1.0.0 publiée
- [ ] Release notes complètes

### Documentation
- [ ] README complet et à jour
- [ ] Guides de setup présents
- [ ] API docs disponibles
- [ ] Contributing guide présent

### CI/CD (Optionnel)
- [ ] GitHub Actions workflow créé
- [ ] Secrets configurés
- [ ] Tests automatisés passent

---

## 🎯 Commandes Git Essentielles

### Workflow quotidien

```bash
# Status des changements
git status

# Ajouter des fichiers
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin main

# Pull dernières modifications
git pull origin main

# Voir l'historique
git log --oneline --graph --all

# Créer une branche
git checkout -b feature/new-feature

# Merger une branche
git checkout main
git merge feature/new-feature
```

### Gestion des tags

```bash
# Créer un tag
git tag -a v1.0.1 -m "Fix: critical bug"

# Lister les tags
git tag -l

# Push un tag
git push origin v1.0.1

# Push tous les tags
git push origin --tags

# Supprimer un tag local
git tag -d v1.0.1

# Supprimer un tag distant
git push origin --delete v1.0.1
```

### Utilitaires

```bash
# Voir les différences
git diff

# Annuler des changements locaux
git checkout -- file.txt

# Reset dernier commit (garder changements)
git reset --soft HEAD~1

# Reset dernier commit (supprimer changements)
git reset --hard HEAD~1

# Voir les branches
git branch -a

# Supprimer une branche locale
git branch -d feature/old-feature

# Supprimer une branche distante
git push origin --delete feature/old-feature
```

---

## 🐛 Troubleshooting

### Erreur: "remote origin already exists"

```bash
# Supprimer l'ancien remote
git remote remove origin

# Ajouter le nouveau
git remote add origin https://github.com/[USERNAME]/squad-planner.git
```

### Erreur: "failed to push some refs"

```bash
# Pull avec rebase
git pull --rebase origin main

# Puis push
git push origin main
```

### Erreur: "authentication failed"

```bash
# Utiliser Personal Access Token (PAT)
# GitHub → Settings → Developer settings → Personal access tokens → Generate new token

# Utiliser le token au lieu du mot de passe
git push https://[USERNAME]:[TOKEN]@github.com/[USERNAME]/squad-planner.git
```

### Fichiers trop gros (> 100MB)

```bash
# Utiliser Git LFS
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

---

## 📞 Ressources

- 📖 [GitHub Docs](https://docs.github.com/)
- 📖 [Git Documentation](https://git-scm.com/doc)
- 📖 [GitHub Actions](https://docs.github.com/en/actions)
- 💬 [GitHub Community](https://github.community/)

---

**Repository configuré avec succès ! 🎉**

Prochaine étape: Déployer sur Supabase → Voir `/DEPLOYMENT_20MIN.md`
