# CLAUDE CONTEXT - Squad Planner

> **INSTRUCTION**: Coller ce fichier au début de chaque nouvelle conversation pour maintenir le contexte complet et la continuité du travail.

---

## TABLE DES MATIÈRES

1. [Résumé Exécutif](#résumé-exécutif)
2. [Vision Produit Complète](#vision-produit-complète) ⭐ NOUVEAU
3. [Roadmap Fonctionnelle](#roadmap-fonctionnelle---6-phases) ⭐ NOUVEAU
4. [Context Engineering](#context-engineering)
5. [Méthode AIDD](#méthode-aidd-plan--code--test--review)
6. [Boucle de Rétroaction](#boucle-de-rétroaction)
7. [Architecture du Projet](#architecture-du-projet)
8. [Design System Linear Dark](#design-system-linear-dark)
9. [Plan de Refonte UI](#plan-de-refonte-ui---67-écrans)
10. [Agents Parallèles](#système-dagents-parallèles)
11. [Tests et Validation](#tests-et-validation)
12. [Credentials](#credentials)
13. [Bugs et Issues](#bugs-et-issues)
14. [Workflow Opérationnel](#workflow-opérationnel)

---

## RÉSUMÉ EXÉCUTIF

```
PROJET:      Squad Planner - Application de planification gaming
MISSION:     Refonte UI de 67 écrans avec design system Linear (dark, premium, minimal)
STACK:       React 18 + TypeScript + Vite + Supabase + Tailwind + Framer Motion
SERVEUR:     npm run dev → http://localhost:5173 (ou port suivant si occupé)
PRODUCTION:  https://squadplanner.fr (domaine principal)
             https://squadplanner.vercel.app (auto-deploy on git push)
```

### Progression Globale

```
██████████████████████████████  100% (67/67 écrans UI)

✅ Commités:     67 écrans (batch 1 + batch 2 + batch 3 + batch 4)
🔄 Phase:        Audit UI/UX et optimisation desktop
```

### Session Actuelle (31 Jan 2026 - Session 5) ⭐ EN COURS

**En cours:**
- 🔄 Audit UI/UX complet avec Puppeteer (8 agents parallèles)
- 🔄 Vérification cohérence design Linear sur toutes les pages
- 🔄 Optimisation version web (desktop)

**Fichiers modifiés (non commités):**
- `SignupScreen.tsx` - Correction couleurs accent (#5e6ad2 → #5e6dd2)
- `community-api.ts` - Ajout try/catch + fallback mock data

---

### Session Précédente (31 Jan 2026 - Session 4)

**Accomplissements:**
- ✅ 10 écrans restants redesignés (batch 4) - commit `2a32657`
- ✅ Protection beta activée (mot de passe: `ruudboy92`)
- ✅ Domaine squadplanner.fr configuré (DNS Ionos → Vercel)
- ✅ www.squadplanner.fr également configuré
- ✅ Progression: 67/67 écrans (100% UI)

**Pages commités dans le batch 4:**
- WeeklyRecapScreen, ActivityFeedScreen, SquadHealthScreen
- SquadCompositionScreen, LeadershipAnalysisScreen, ProposeSessionScreen
- PremiumSuccessScreen, DiscordBotScreen, ShareScreen, InviteMemberScreen

**Configuration Domaine:**
- squadplanner.fr → A record → 76.76.21.21 (Vercel)
- www.squadplanner.fr → CNAME → cname.vercel-dns.com

---

## VISION PRODUIT COMPLÈTE

> **Source**: Synthèse des 10 PDFs de présentation SquadPlanner

### Le Problème Réel (et Violent)

Les joueurs passent **plus de temps à organiser** leurs sessions qu'à jouer. Le chaos quotidien détruit les squads :

| Symptôme | Impact |
|----------|--------|
| Créneaux flous, horaires imprécis | Sessions ratées |
| Messages dispersés (Discord, WhatsApp, SMS) | Confusion |
| Confirmations de dernière minute | No-shows fréquents |
| Leaders épuisés par la logistique | Disbandment des squads |

**Ce n'est PAS un problème de matching. C'est un problème de coordination sociale.**

### La Solution Squad Planner

```
"Le système de coordination sociale des joueurs"
— L'équivalent de Notion, Slack ou Linear, mais pour le temps et l'engagement humain.
```

**Positionnement différenciateur** :
- **Organisation > Matching** : Coordonner les existants plutôt que créer de nouvelles connexions
- **Engagement > Réseau social** : Privilégier la fiabilité sur la popularité
- **Fiabilité > Flexibilité** : Créer un contrat moral plutôt qu'une option perpétuelle
- **Rituel > One-shot** : Transformer l'organisation en habitude automatique

### Les 5 Piliers Fondamentaux

> **Règle d'or** : Toute fonctionnalité doit renforcer au moins un pilier. Sinon, elle n'a pas sa place.

| Pilier | Objectif | Fonctionnalités clés |
|--------|----------|---------------------|
| 📅 **Planning** | Transformer l'intention en engagement | Créneaux multiples, vote collectif, auto-verrouillage |
| 🤝 **Engagement** | Créer un contrat moral | Check-in 1h avant, bouton "Je suis en route", rappels |
| 👥 **Pression Sociale Positive** | Encourager sans punir | Visibilité des statuts en temps réel, transparence |
| ⭐ **Réputation** | Mesurer la fiabilité | Score calculé, badges, historique traçable |
| 🤖 **Automatisation** | Friction zéro | Suggestions IA, rappels auto, bot Discord |

### La Métrique Ultime : Show-up Rate

```
Show-up Rate = (Joueurs présents / Joueurs invités) × 100

C'est le KPI n°1, bien avant les MAU.
Si Squad Planner n'améliore pas ce taux vs Discord + Google Calendar, il est mort.
```

### Avantages Compétitifs vs Discord

| Ce que Discord fait bien | Ce que Squad Planner fait mieux |
|-------------------------|--------------------------------|
| Chat en temps réel | Planning clair en 5 secondes |
| Déjà installé partout | RSVP en 1 tap (pas de commandes) |
| Réseau existant | Rappels intelligents qui relancent |
| "Assez bien" pour 80% | Score de fiabilité visible |

**Message clé** : "Connecté à Discord, pas contre Discord"

### Kill-Switchs (Erreurs Fatales à Éviter)

| ❌ Kill-Switch | Conséquence |
|---------------|-------------|
| Le bot n'est pas meilleur qu'un humain organisé | Raison d'être disparaît |
| Les rappels sont perçus comme du spam | Désactivation notifications = effondrement |
| Le score de fiabilité est ignoré | Mécanisme de motivation disparu |
| Ajouter des features "cool" au lieu du commitment | Dilution du produit |

---

## ROADMAP FONCTIONNELLE - 6 PHASES

> **Source**: Roadmaps 1-4 + Checklist de développement

### Vue d'Ensemble

```
Phase 0: Proof of Value (MVP)      → Prouver que ça marche
Phase 1: Engagement & Discipline   → Rendre indispensable
Phase 2: Intelligence Sociale      → Automatiser l'organisation
Phase 3: Intégration Discord       → Friction zéro
Phase 4: Monétisation              → Business model
Phase 5: Écosystème Standard       → Devenir l'infrastructure
```

### Phase 0 : Proof of Value (MVP)

**Objectif** : Prouver que les joueurs utilisent l'outil pour s'organiser.
**KPI** : Squads qui planifient ≥2 sessions/semaine avec taux de présence >80%

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Auth email | ✅ 95% | Flux stable |
| Auth Discord OAuth | ❌ 0% | Config existe |
| Création squad | ✅ 90% | squadsAPI.create() OK |
| Invitation par lien | 🔄 70% | API OK, manque UI/deep link |
| Page Squad centrale | ✅ 80% | SquadDetailScreen OK |
| Création session | ✅ 85% | ProposeSessionScreen OK |
| **Système RSVP** | ✅ 80% | DB + API + UI OK, manque real-time |
| Notifications auto J-1/H-1/10min | ❌ 0% | **CRITIQUE** - Cron jobs manquants |
| Chat squad | ✅ 85% | SquadChatScreen OK |

### Phase 1 : Engagement & Discipline

**Objectif** : Transformer l'outil en point de passage obligé.
**KPI** : Réduction de 60% des no-shows vs Discord classique

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Score fiabilité calculé | 🔄 15% | Column existe, algo manquant |
| **Check-in obligatoire 1h avant** | ❌ 0% | **FEATURE SIGNATURE ABSENTE** |
| Bouton "Je suis en route" | ❌ 0% | Transparence temps réel |
| Badges comportementaux | ❌ 5% | Badge engine manquant |
| Rôles (Leader/Co-leader/Membre) | 🔄 20% | Column role existe |
| Historique + tracking présence | 🔄 30% | Stats basiques |

### Phase 2 : Intelligence Sociale

**Objectif** : L'IA optimise automatiquement l'organisation.

| Fonctionnalité | Statut |
|----------------|--------|
| Suggestions automatiques de créneaux | ❌ 0% |
| Heatmap de disponibilité | ❌ 0% |
| Score de cohésion d'équipe | ❌ 0% |
| Prédiction de no-show | ❌ 0% |
| Détection des patterns | ❌ 0% |

### Phase 3 : Intégration Discord Native

**Objectif** : Friction zéro - les joueurs ne quittent plus Discord.

| Fonctionnalité | Statut |
|----------------|--------|
| Bot Discord avec slash commands | ❌ 0% |
| Création auto events Discord | ❌ 0% |
| Embeds riches auto-générés | ❌ 0% |
| Sync calendriers (Google, Apple) | ❌ 0% |
| Ouverture auto salon vocal | ❌ 0% |

### Phase 4 : Monétisation

| Offre | Prix | Fonctionnalités |
|-------|------|-----------------|
| **Freemium** | Gratuit | 1 squad, planning illimité, historique 30j |
| **Premium** | 5-10€/mois | Squads illimitées, stats avancées, heatmap IA |
| **B2B** | Sur devis | Multi-squads, dashboard managers, API privée |

### Phase 5 : Écosystème Standard

- API publique REST + SDK multi-langages
- Plugins Twitch, Steam, Battle.net
- Mode communauté (ligues, saisons)
- Mode B2B (organisations esport)

### TOP 10 Gaps Critiques à Combler

| Rang | Gap | Impact | Phase | Effort |
|------|-----|--------|-------|--------|
| 1 | **Notifications auto (J-1, H-1, 10min)** | 100% | Phase 0 | 2-3j |
| 2 | **Check-in obligatoire 1h avant** | 95% | Phase 1 | 2-3j |
| 3 | RSVP real-time subscriptions | 85% | Phase 0 | 1-2j |
| 4 | Score fiabilité + algorithme | 80% | Phase 1 | 3-4j |
| 5 | Système rôles (permissions) | 70% | Phase 1 | 2-3j |
| 6 | Badges comportementaux | 65% | Phase 1 | 3-4j |
| 7 | Invitation UI + deep link | 60% | Phase 0 | 1-2j |
| 8 | Heatmap disponibilité | 60% | Phase 2 | 4-5j |
| 9 | Bot Discord slash commands | 70% | Phase 3 | 5-7j |
| 10 | Historique + tracking présence | 60% | Phase 1 | 2-3j |

### Projections CA (si Product-Market Fit atteint)

| Niveau | Revenu/an | Condition |
|--------|-----------|-----------|
| Niveau 1 | 10K-200K€ | Prouver la fiabilité sociale |
| Niveau 2 | 200K-2M€ | Devenir indispensable |
| Niveau 3 | 2M-15M€ | Devenir le standard gaming |
| Niveau 4 | 15M-80M€ | Infrastructure mondiale |

---

## CONTEXT ENGINEERING

### Objectif du Context Engineering

Permettre à **n'importe quelle nouvelle conversation Claude** de reprendre le travail **exactement** là où la précédente s'est arrêtée, sans perte d'information ni de temps.

### Éléments de Contexte Critiques

| Élément | Description | Localisation |
|---------|-------------|--------------|
| **État Git** | Fichiers modifiés, commits récents | `git status`, `git log -5` |
| **Progression UI** | Pages terminées/en cours/restantes | Ce fichier + ROADMAP_UI_REDESIGN.md |
| **Design System** | Couleurs, composants, animations | Section dédiée ci-dessous |
| **Credentials** | Supabase, compte test | Section dédiée ci-dessous |
| **Bugs connus** | Issues identifiées et leur statut | Section dédiée ci-dessous |
| **Méthode de travail** | Agents parallèles, workflow | Sections dédiées ci-dessous |

### Fichiers de Contexte

```
docs/CLAUDE_PROGRESS.md     ← CE FICHIER (contexte principal)
ROADMAP_UI_REDESIGN.md      ← Progression détaillée par page
CLAUDE.md                   ← Instructions projet (lu automatiquement)
docs/TEST_CHECKLIST.md      ← Tests fonctionnels
```

### Commandes de Récupération du Contexte

```bash
# 1. État git actuel
git status --short

# 2. Commits récents
git log --oneline -10

# 3. Fichiers modifiés non commités
git diff --name-only

# 4. Serveur de dev
npm run dev
```

---

## MÉTHODE AIDD (Plan > Code > Test > Review)

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                        CYCLE AIDD                                │
│                                                                  │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│    │   PLAN   │───▶│   CODE   │───▶│   TEST   │───▶│  REVIEW  │ │
│    └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│         │                                               │        │
│         └───────────────◀───────────────────────────────┘        │
│                        (Feedback Loop)                           │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 1: PLAN

**Objectif**: Définir précisément ce qui doit être fait avant d'écrire du code.

**Actions**:
1. Lire le contexte (ce fichier)
2. Vérifier l'état git (`git status`)
3. Identifier les pages à refaire
4. Prioriser par groupe fonctionnel
5. Définir les critères de succès

**Output**: Liste des tâches avec priorités et critères d'acceptation.

### Phase 2: CODE

**Objectif**: Implémenter les changements avec le design system Linear.

**Actions**:
1. Lire le fichier source actuel
2. Appliquer le design system Linear dark
3. Utiliser les composants et patterns établis
4. Respecter les conventions de code

**Règles de Code**:
```typescript
// Structure type d'un écran refait
import { motion } from 'framer-motion';
import { IconName } from 'lucide-react';

// Animations Linear
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function XXXScreen() {
  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-[#08090a]">
      <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div variants={itemVariants}>...</motion.div>
          {/* Content */}
          <motion.div variants={itemVariants}>...</motion.div>
        </motion.div>
      </div>
    </div>
  );
}
```

### Phase 3: TEST

**Objectif**: Valider visuellement et fonctionnellement chaque modification.

**Actions**:
1. Naviguer vers la page avec Puppeteer
2. Prendre un screenshot
3. Comparer avec le design Linear.app
4. Tester les interactions (boutons, liens, formulaires)
5. Vérifier la responsivité

**Commandes Puppeteer**:
```
mcp__puppeteer__puppeteer_navigate → url
mcp__puppeteer__puppeteer_screenshot → name
mcp__puppeteer__puppeteer_click → selector
mcp__puppeteer__puppeteer_fill → selector, value
```

**Critères de Validation**:
- [ ] Fond `#08090a` appliqué
- [ ] Cartes transparentes avec bordures subtiles
- [ ] Textes avec hiérarchie correcte (f7f8f8, 8b8d90, 5e6063)
- [ ] Icônes colorées selon catégorie
- [ ] Animations fluides (pas de saccade)
- [ ] Pas d'erreurs console
- [ ] Navigation fonctionnelle

### Phase 4: REVIEW

**Objectif**: Valider, commiter et documenter les changements.

**Actions**:
1. Vérifier que tous les critères sont remplis
2. Ajouter au staging (`git add`)
3. Commiter avec message descriptif
4. Pousser vers GitHub (`git push`)
5. Mettre à jour la documentation

**Format de Commit**:
```bash
git commit -m "$(cat <<'EOF'
feat: Redesign XXXScreen with Linear dark design system

- Apply dark background #08090a
- Add transparent cards with subtle borders
- Update typography hierarchy
- Add colored icons by category
- Implement Linear-style animations

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## BOUCLE DE RÉTROACTION

### Principe

Chaque action génère un feedback qui influence l'action suivante. La boucle permet d'améliorer continuellement le processus.

```
┌────────────────────────────────────────────────────────────┐
│                   BOUCLE DE RÉTROACTION                     │
│                                                             │
│   ACTION ──────▶ OBSERVATION ──────▶ ANALYSE ──────▶ AJUSTEMENT
│      │                                                  │   │
│      └──────────────────────────────────────────────────┘   │
│                                                             │
│   Exemple:                                                  │
│   - Action: Refaire BadgesScreen                           │
│   - Observation: Screenshot montre fond trop clair          │
│   - Analyse: Mauvaise couleur de fond utilisée             │
│   - Ajustement: Corriger avec #08090a                      │
│   - Nouvelle action: Re-tester avec Puppeteer              │
└────────────────────────────────────────────────────────────┘
```

### Points de Feedback

| Point | Méthode | Fréquence |
|-------|---------|-----------|
| **Visuel** | Screenshot Puppeteer | Après chaque modification |
| **Console** | DevTools | Après chaque modification |
| **Git** | `git status` | Avant chaque commit |
| **Build** | `npm run build` | Avant chaque push |
| **Production** | Vercel preview | Après chaque push |

### Métriques de Qualité

```
Temps de chargement:  < 500ms (target)
Erreurs console:      0
Lighthouse score:     > 90
Cohérence design:     100% Linear dark
```

### Journal de Feedback (à maintenir)

| Date | Page | Problème | Solution | Statut |
|------|------|----------|----------|--------|
| 30/01 | IntegrationsScreen | Loading state visible | Vérifier API | ⏳ |
| 30/01 | PremiumScreen | Toggle mensuel/annuel | OK | ✅ |
| 30/01 | LeaderboardScreen | Podium bien stylisé | OK | ✅ |

---

## ARCHITECTURE DU PROJET

### Structure des Dossiers

```
Squad Planner/
├── src/
│   ├── app/
│   │   ├── screens/          # 67 écrans à refaire
│   │   ├── components/       # Composants réutilisables
│   │   └── hooks/            # Custom hooks
│   ├── contexts/             # React contexts (Auth, etc.)
│   ├── services/             # API, Supabase
│   ├── styles/
│   │   ├── tokens.ts         # Design tokens Linear
│   │   └── theme.css         # Classes CSS Linear
│   └── utils/                # Utilitaires
├── supabase/
│   ├── config.toml           # Config Supabase
│   └── migrations/           # Migrations DB
├── docs/
│   ├── CLAUDE_PROGRESS.md    # CE FICHIER
│   └── TEST_CHECKLIST.md     # Tests fonctionnels
├── CLAUDE.md                 # Instructions projet
├── ROADMAP_UI_REDESIGN.md    # Progression UI
└── package.json
```

### Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Typage statique |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| Framer Motion | 11.x | Animations |
| Supabase | 2.x | Backend (Auth, DB, RLS) |
| Lucide React | latest | Icônes |

### Dépendances Clés

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.x",
  "framer-motion": "^11.x",
  "tailwindcss": "^3.x",
  "@supabase/supabase-js": "^2.x",
  "lucide-react": "latest"
}
```

---

## DESIGN SYSTEM LINEAR DARK

### Palette de Couleurs

#### Backgrounds
```css
--bg-base:      #08090a;     /* Page background */
--bg-elevated:  #101012;     /* Cards, surfaces */
--bg-surface:   #18191b;     /* Raised elements */
--bg-hover:     #1f2023;     /* Hover states */
--bg-active:    #27282b;     /* Active/pressed */
```

#### Text Colors
```css
--text-primary:    #f7f8f8;  /* Main text */
--text-secondary:  #c9cace;  /* Secondary text */
--text-tertiary:   #8b8d90;  /* Muted text */
--text-quaternary: #5e6063;  /* Very muted */
```

#### Accent Colors (par catégorie)
```css
--color-primary:   #5e6dd2;  /* Violet - Squads/Gaming */
--color-success:   #4ade80;  /* Vert - Stats/Success */
--color-warning:   #f5a623;  /* Orange - Sessions/Time */
--color-info:      #60a5fa;  /* Bleu - Time/Clock */
--color-purple:    #8b93ff;  /* Violet clair - Users/Friends */
--color-error:     #f87171;  /* Rouge - Errors/Danger */
```

### Composants UI

#### Card (transparente)
```html
<div class="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]
            rounded-xl hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]
            transition-all">
```

#### Button Primary
```html
<button class="bg-[#5e6dd2] hover:bg-[#6a79db] text-white rounded-xl
               shadow-lg shadow-[#5e6dd2]/20 transition-colors">
```

#### Button Secondary
```html
<button class="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]
               hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]
               text-[#f7f8f8] rounded-xl transition-all">
```

#### Input
```html
<input class="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]
              hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]
              focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)]
              text-[#f7f8f8] placeholder-[#5e6063] rounded-xl transition-all">
```

#### Stat Card avec icône colorée
```html
<div class="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
  <div class="w-10 h-10 rounded-lg flex items-center justify-center"
       style="background-color: ${accentColor}15">
    <Icon class="w-5 h-5" style="color: ${accentColor}" />
  </div>
  <div class="text-[20px] font-semibold text-[#f7f8f8]">{value}</div>
  <div class="text-[12px] text-[#5e6063]">{label}</div>
</div>
```

### Animations Framer Motion

```typescript
// Container avec stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

// Item individuel
const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.14,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Hover effects
whileHover={{ y: -2, scale: 1.01 }}
whileTap={{ scale: 0.98 }}
```

### Icônes par Catégorie

| Catégorie | Couleur | Icônes typiques |
|-----------|---------|-----------------|
| Squads/Gaming | `#5e6dd2` | Users, Gamepad2, Trophy |
| Sessions/Time | `#f5a623` | Calendar, Clock, Timer |
| Stats/Success | `#4ade80` | TrendingUp, CheckCircle, Award |
| Time/Clock | `#60a5fa` | Clock, History, CalendarDays |
| Users/Friends | `#8b93ff` | User, UserPlus, Users |
| Errors/Danger | `#f87171` | AlertTriangle, XCircle, Trash |

---

## PLAN DE REFONTE UI - 67 ÉCRANS

### Pages de Référence (NE PAS TOUCHER)

Ces 4 pages sont parfaites et servent de modèle:

| Page | URL | Fichier |
|------|-----|---------|
| HomeScreen | `/home` | `src/app/screens/HomeScreen.tsx` |
| SquadsScreen | `/squads` | `src/app/screens/SquadsScreen.tsx` |
| SessionsScreen | `/sessions` | `src/app/screens/SessionsScreen.tsx` |
| ProfileScreen | `/profile` | `src/app/screens/ProfileScreen.tsx` |

### Groupe 1: Auth (2/2) ✅ COMPLET

| # | Page | URL | Statut |
|---|------|-----|--------|
| 1 | LoginScreen | `/login` | ✅ |
| 2 | SignupScreen | `/signup` | ✅ |

### Groupe 2: Dashboard & Home (3/8)

| # | Page | URL | Statut |
|---|------|-----|--------|
| 3 | HomeScreen | `/home` | ✅ RÉFÉRENCE |
| 4 | NotificationsScreen | `/notifications` | ⏳ |
| 5 | NotificationSettingsScreen | `/notification-settings` | ✅ |
| 6 | SmartSuggestionsScreen | `/smart-suggestions` | ⏳ |
| 7 | AvailabilityHeatmapScreen | `/availability` | ⏳ |
| 8 | CalendarSyncScreen | `/calendar-sync` | ✅ |
| 9 | WeeklyRecapScreen | `/weekly-recap` | ⏳ |
| 10 | ActivityFeedScreen | `/activity` | ⏳ |

### Groupe 3: Squads (9/10) ✅ PRESQUE COMPLET

| # | Page | URL | Statut |
|---|------|-----|--------|
| 11 | SquadsScreen | `/squads` | ✅ RÉFÉRENCE |
| 12 | CreateSquadScreen | `/create-squad` | ✅ |
| 13 | SquadDetailScreen | `/squads/:id` | ✅ |
| 14 | SquadManagementScreen | `/squad-management/:id` | ✅ |
| 15 | SquadChatScreen | `/chat/:id` | ✅ |
| 16 | SquadHealthScreen | `/squad-health/:id` | ⏳ |
| 17 | SquadCompositionScreen | `/squad-composition/:id` | ⏳ |
| 18 | LeadershipAnalysisScreen | `/leadership-analysis/:id` | ⏳ |
| 19 | JoinSquadScreen | `/join-squad` | ✅ |
| 20 | DiscoverSquadsScreen | `/discover-squads` | ✅ |

### Groupe 4: Sessions (4/8)

| # | Page | URL | Statut |
|---|------|-----|--------|
| 21 | SessionsScreen | `/sessions` | ✅ RÉFÉRENCE |
| 22 | ProposeSessionScreen | `/propose-session` | ⏳ |
| 23 | RSVPScreen | `/rsvp/:id` | ✅ |
| 24 | VoteSessionScreen | `/vote-session/:id` | ⏳ |
| 25 | CheckInScreen | `/check-in/:id` | ✅ |
| 26 | RecurringSessionScreen | `/recurring-sessions` | ⏳ |
| 27 | AutoCoachingScreen | `/auto-coaching` | ⏳ |
| 28 | CoachingToolsScreen | `/coaching-tools` | ⏳ |

### Groupe 5: Profile & Settings (11/12) ✅ PRESQUE COMPLET

| # | Page | URL | Statut |
|---|------|-----|--------|
| 29 | ProfileScreen | `/profile` | ✅ RÉFÉRENCE |
| 30 | EditProfileScreen | `/edit-profile` | ✅ |
| 31 | PublicProfileScreen | `/profile/:id` | ⏳ |
| 32 | PreferencesScreen | `/preferences` | ✅ |
| 33 | PrivacyScreen | `/privacy` | ✅ |
| 34 | PremiumScreen | `/premium` | ✅ |
| 35 | PremiumSuccessScreen | `/premium/success` | ⏳ |
| 36 | AdvancedStatsScreen | `/advanced-stats` | ✅ |
| 37 | HistoryScreen | `/history` | ✅ |
| 38 | IntegrationsScreen | `/integrations` | ✅ |
| 39 | DiscordConnectScreen | `/discord-connect` | ✅ |
| 40 | DiscordBotScreen | `/discord-bot` | ⏳ |

### Groupe 6: Social & Community (6/10)

| # | Page | URL | Statut |
|---|------|-----|--------|
| 41 | FriendsScreen | `/friends` | ✅ |
| 42 | SearchPlayersScreen | `/search-players` | ✅ |
| 43 | CommunityScreen | `/community` | ✅ |
| 44 | AchievementsScreen | `/achievements` | ⏳ |
| 45 | BadgesScreen | `/badges` | ✅ |
| 46 | LeaderboardScreen | `/leaderboard` | ✅ |
| 47 | ShareScreen | `/share` | ⏳ |
| 48 | InviteMemberScreen | `/invite-member/:id` | ⏳ |
| 49 | JoinViaLinkScreen | `/join/:code` | ⏳ |
| 50 | AcademyScreen | `/academy` | ⏳ |

### Groupe 7: Compétition (0/6)

| # | Page | URL | Statut |
|---|------|-----|--------|
| 51 | RankingScreen | `/ranking` | ⏳ |
| 52 | TournamentsScreen | `/tournaments` | ⏳ |
| 53 | LeaguesScreen | `/leagues` | ⏳ |
| 54 | SeasonsScreen | `/seasons` | ⏳ |
| 55 | ChallengesScreen | `/challenges` | ⏳ |

### Groupe 8: B2B & Avancé (0/6)

| # | Page | URL | Statut |
|---|------|-----|--------|
| 56 | OrganizationScreen | `/organization` | ⏳ |
| 57 | EsportTeamScreen | `/esport-team` | ⏳ |
| 58 | EsportIntegrationsScreen | `/esport-integrations` | ⏳ |
| 59 | StreamerDashboardScreen | `/streamer-dashboard` | ⏳ |
| 60 | IntelligenceScreen | `/intelligence` | ⏳ |
| 61 | ApiDocsScreen | `/api-docs` | ⏳ |

### Pages Utilitaires (hors scope)

| Page | Note |
|------|------|
| PluginsScreen | B2B - basse priorité |
| WebhooksScreen | B2B - basse priorité |
| TestSetupScreen | Dev only |
| QATestsScreen | Dev only |
| ScreenshotGalleryScreen | Dev only |
| OAuthCallbackScreen | Technique |

---

## SYSTÈME D'AGENTS PARALLÈLES

### Principe

Lancer **10-15 agents en parallèle** pour accélérer la refonte. Chaque agent travaille sur une page différente et utilise Puppeteer pour valider visuellement.

### Configuration d'un Agent

```javascript
Task tool avec:
{
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: "..." // Voir template ci-dessous
}
```

### Template de Prompt Agent (ANCIEN - ne plus utiliser)

```
[Voir ci-dessous le template amélioré]
```

### Template de Prompt Agent AMÉLIORÉ ⭐ NOUVEAU

```
Refais `src/app/screens/XXXScreen.tsx` avec le design Linear dark.

IMPORTANT: NE PAS TOUCHER HomeScreen, SquadsScreen, SessionsScreen, ProfileScreen - ce sont les références!

**ÉTAPE 0 - DÉTECTION DE BUGS (CRITIQUE):**
1. Naviguer vers http://localhost:5179/xxx avec Puppeteer
2. Attendre 3 secondes
3. Exécuter ce script pour détecter les erreurs:
   ```javascript
   mcp__puppeteer__puppeteer_evaluate({
     script: "JSON.stringify({
       errors: window.__errors || [],
       isLoading: document.querySelector('[class*=skeleton], [class*=loading], [class*=spinner]') !== null,
       isEmpty: document.body.innerText.trim().length < 50,
       consoleErrors: performance.getEntriesByType('resource').filter(r => r.responseStatus >= 400)
     })"
   })
   ```
4. Si skeleton/loading visible après 3s → BUG DÉTECTÉ → REPORTER
5. Si page blanche ou erreur → BUG DÉTECTÉ → REPORTER
6. Prendre screenshot AVANT modification

**ÉTAPE 1 - LIRE LE FICHIER:**
- Read `src/app/screens/XXXScreen.tsx`

**ÉTAPE 2 - REFAIRE AVEC DESIGN LINEAR DARK:**
- Fond: `bg-[#08090a]`
- Cartes: `bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]`
- Textes: `text-[#f7f8f8]` (principal), `text-[#8b8d90]` (secondaire), `text-[#5e6063]` (muted)
- Bouton primary: `bg-[#5e6dd2] hover:bg-[#6a79db]`
- Icônes colorées selon catégorie
- Animations Framer Motion (containerVariants, itemVariants)
- Padding bottom: `pb-24 md:pb-8`

**ÉTAPE 3 - VALIDATION:**
1. Prendre screenshot APRÈS
2. Vérifier que le design est cohérent
3. Re-exécuter le script de détection d'erreurs

**ÉTAPE 4 - RAPPORT FINAL OBLIGATOIRE:**
```
## RAPPORT - XXXScreen
- URL: /xxx
- BUGS DÉTECTÉS AVANT: [liste ou "Aucun"]
- BUGS DÉTECTÉS APRÈS: [liste ou "Aucun"]
- DESIGN: ✅ OK ou ❌ Problème: [description]
- ERREURS CONSOLE: [liste ou "Aucune"]
```
```

### Vérifier le Statut des Agents

```javascript
// Pour chaque agent lancé
TaskOutput tool avec:
{
  task_id: "ID_DE_LAGENT"
}
```

### Fichiers Modifiés par Agents (Session 30 Jan) - ✅ TOUS COMMITÉS

Tous les fichiers ont été validés visuellement et commités dans `f9ee6cb`:

| Fichier | Page | Statut |
|---------|------|--------|
| `AdvancedStatsScreen.tsx` | `/advanced-stats` | ✅ Commité |
| `BadgesScreen.tsx` | `/badges` | ✅ Commité |
| `CalendarSyncScreen.tsx` | `/calendar-sync` | ✅ Commité |
| `CheckInScreen.tsx` | `/check-in/:id` | ✅ Commité |
| `CommunityScreen.tsx` | `/community` | ✅ Commité |
| `DiscordConnectScreen.tsx` | `/discord-connect` | ✅ Commité |
| `DiscoverSquadsScreen.tsx` | `/discover-squads` | ✅ Commité |
| `EditProfileScreen.tsx` | `/edit-profile` | ✅ Commité |
| `FriendsScreen.tsx` | `/friends` | ✅ Commité |
| `JoinSquadScreen.tsx` | `/join-squad` | ✅ Commité |
| `NotificationSettingsScreen.tsx` | `/notification-settings` | ✅ Commité |
| `PrivacyScreen.tsx` | `/privacy` | ✅ Commité |
| `RSVPScreen.tsx` | `/rsvp/:id` | ✅ Commité |
| `SearchPlayersScreen.tsx` | `/search-players` | ✅ Commité |

---

## PAGES RESTANTES À REFAIRE (33 pages)

> **IMPORTANT**: Cette section est la liste de travail pour les prochains agents.

### Priorité HAUTE (fonctionnalités core)

| Page | URL | Groupe |
|------|-----|--------|
| NotificationsScreen | `/notifications` | Dashboard |
| ProposeSessionScreen | `/propose-session` | Sessions |
| VoteSessionScreen | `/vote-session/:id` | Sessions |
| PublicProfileScreen | `/profile/:id` | Profile |
| AchievementsScreen | `/achievements` | Social |

### Priorité MOYENNE (pages secondaires)

| Page | URL | Groupe |
|------|-----|--------|
| SmartSuggestionsScreen | `/smart-suggestions` | Dashboard |
| AvailabilityHeatmapScreen | `/availability` | Dashboard |
| WeeklyRecapScreen | `/weekly-recap` | Dashboard |
| ActivityFeedScreen | `/activity` | Dashboard |
| SquadHealthScreen | `/squad-health/:id` | Squads |
| SquadCompositionScreen | `/squad-composition/:id` | Squads |
| LeadershipAnalysisScreen | `/leadership-analysis/:id` | Squads |
| RecurringSessionScreen | `/recurring-sessions` | Sessions |
| AutoCoachingScreen | `/auto-coaching` | Sessions |
| CoachingToolsScreen | `/coaching-tools` | Sessions |
| PremiumSuccessScreen | `/premium/success` | Profile |
| DiscordBotScreen | `/discord-bot` | Profile |
| ShareScreen | `/share` | Social |
| InviteMemberScreen | `/invite-member/:id` | Social |
| JoinViaLinkScreen | `/join/:code` | Social |
| AcademyScreen | `/academy` | Social |

### Priorité BASSE (Compétition - Phase future)

| Page | URL | Groupe |
|------|-----|--------|
| RankingScreen | `/ranking` | Compétition |
| TournamentsScreen | `/tournaments` | Compétition |
| LeaguesScreen | `/leagues` | Compétition |
| SeasonsScreen | `/seasons` | Compétition |
| ChallengesScreen | `/challenges` | Compétition |

### Priorité TRÈS BASSE (B2B - Phase future)

| Page | URL | Groupe |
|------|-----|--------|
| OrganizationScreen | `/organization` | B2B |
| EsportTeamScreen | `/esport-team` | B2B |
| EsportIntegrationsScreen | `/esport-integrations` | B2B |
| StreamerDashboardScreen | `/streamer-dashboard` | B2B |
| IntelligenceScreen | `/intelligence` | B2B |
| ApiDocsScreen | `/api-docs` | B2B |

### Hors scope (pages dev/techniques)

- PluginsScreen, WebhooksScreen (B2B)
- TestSetupScreen, QATestsScreen, ScreenshotGalleryScreen (Dev only)
- OAuthCallbackScreen (Technique)

---

## TESTS ET VALIDATION

### Checklist de Validation Visuelle

Pour chaque page refaite, vérifier:

- [ ] **Background** - Fond `#08090a` appliqué
- [ ] **Cards** - Transparentes avec bordures subtiles (`rgba(255,255,255,0.02/0.06)`)
- [ ] **Typography** - Hiérarchie correcte (f7f8f8 > c9cace > 8b8d90 > 5e6063)
- [ ] **Icons** - Colorées selon catégorie
- [ ] **Buttons** - Primary violet, secondary transparent
- [ ] **Inputs** - Style Linear avec focus ring
- [ ] **Animations** - Fluides, pas de saccade
- [ ] **Console** - Pas d'erreurs
- [ ] **Navigation** - Tous les liens fonctionnent
- [ ] **Responsive** - Mobile et desktop OK

### Commandes de Test

```bash
# Build pour vérifier les erreurs
npm run build

# Lancer le serveur de dev
npm run dev

# Tests E2E (si configurés)
npx playwright test
```

### Tests avec Puppeteer

```javascript
// Navigation
mcp__puppeteer__puppeteer_navigate({ url: "http://localhost:5173/page" })

// Screenshot
mcp__puppeteer__puppeteer_screenshot({ name: "page-name" })

// Click
mcp__puppeteer__puppeteer_click({ selector: ".button-class" })

// Fill input
mcp__puppeteer__puppeteer_fill({ selector: "input[name='email']", value: "test@test.com" })

// Execute JS
mcp__puppeteer__puppeteer_evaluate({ script: "document.title" })
```

---

## CREDENTIALS

### Application Squad Planner - Compte Test

```
Email:    rudylabor@hotmail.fr
Password: SquadPlanner2026!
```

### Supabase

```
Project ID:      cwtoprbowdqcemdjrtir
URL:             https://cwtoprbowdqcemdjrtir.supabase.co
Service Role:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE
DB Password:     Ruudboy92600*
```

### URLs

```
Local:       http://localhost:5173
Production:  https://squadplanner.fr (domaine principal)
Vercel:      https://squadplanner.vercel.app (backup)
GitHub:      https://github.com/RudyLabor/Squadplannerv2bis
```

### Protection Beta (accès restreint)

```
Mot de passe: ruudboy92
```

> Le site est protégé par un mot de passe pendant la phase de développement.
> Seuls les utilisateurs avec le mot de passe peuvent accéder au site.
> Pour désactiver la protection, supprimer le composant BetaProtection dans App.tsx.

---

## BUGS ET ISSUES

### Bugs Corrigés

| # | Description | Sévérité | Fix | Date |
|---|-------------|----------|-----|------|
| 1 | Création squad bloque (RLS recursion) | Haute | Supabase RLS modifié | 29/01 |
| 2 | Page détail squad invisible (opacity: 0) | Haute | SquadDetailScreen corrigé | 29/01 |
| 3 | Affichage "0 membres" (RLS restrictive) | Moyenne | Supabase RLS modifié | 29/01 |
| 4 | Page Home timeout après F5 (Web Locks) | Haute | api.ts, supabase.ts | 30/01 |
| 5 | Bouton Déconnexion ne fonctionne pas | Moyenne | AuthContext.tsx | 30/01 |

### Bugs Potentiels à Surveiller

| # | Description | Où regarder |
|---|-------------|-------------|
| ? | Loading state IntegrationsScreen | API integrations |
| ? | Erreurs console sur certaines pages | DevTools |

### Comment Reporter un Bug

1. Noter la page et l'URL
2. Décrire le comportement attendu vs actuel
3. Copier les erreurs console si présentes
4. Prendre un screenshot
5. Ajouter au tableau ci-dessus

---

## WORKFLOW OPÉRATIONNEL

### Démarrage d'une Nouvelle Conversation

```
1. LIRE ce fichier (docs/CLAUDE_PROGRESS.md)
2. VÉRIFIER git status
3. DÉMARRER le serveur (npm run dev) si nécessaire
4. VALIDER les fichiers modifiés par agents précédents
5. COMMITER les pages validées
6. LANCER nouveaux agents pour pages restantes
```

### Cycle de Travail (AIDD)

```
PLAN    → Identifier les pages à refaire, prioriser
CODE    → Refaire avec design Linear dark
TEST    → Puppeteer screenshot + validation visuelle
REVIEW  → Commit + push + mise à jour docs
```

### Commandes Fréquentes

```bash
# État du projet
git status
git log --oneline -5

# Serveur de dev
npm run dev

# Build
npm run build

# Commit
git add src/app/screens/XXXScreen.tsx
git commit -m "feat: Redesign XXXScreen with Linear dark"

# Push
git push origin main
```

### Mise à Jour de la Documentation

Après chaque session de travail:

1. Mettre à jour la progression dans ce fichier
2. Mettre à jour ROADMAP_UI_REDESIGN.md
3. Noter les nouveaux bugs découverts
4. Commiter les fichiers de doc

---

## HISTORIQUE DES SESSIONS

### Session 30 Janvier 2026 - Partie 2 (ACTUELLE)

**Accomplissements**:
- ✅ Validation visuelle des pages refaites (Puppeteer screenshots)
- ✅ Confirmation que le commit `f9ee6cb` contient 14 pages validées
- ✅ Mise à jour complète de ce fichier de contexte
- ✅ Progression mise à jour: **34/67 écrans (51%)**

**État actuel**:
- Serveur: `http://localhost:5179` (ou port suivant si occupé)
- Toutes les pages refaites fonctionnent correctement
- Design Linear dark appliqué uniformément

**Prochaines étapes**:
- Lancer agents parallèles pour les 33 pages restantes
- Commencer par les pages de priorité HAUTE

---

### Session 30 Janvier 2026 - Partie 1

**Durée**: ~3h
**Accomplissements**:
- Bug #5 corrigé (déconnexion)
- 5 pages refaites manuellement (Preferences, History, Leaderboard, Premium, Integrations)
- 15 agents lancés en parallèle
- 14 fichiers modifiés et commités par agents
- Création de ce fichier de contexte

**Commit**: `f9ee6cb feat: Redesign 14 screens with Linear dark design system (batch 2)`

---

## EXTRAITS DE CODE - PAGES DE RÉFÉRENCE

### Pattern StatCard (HomeScreen)

```typescript
function StatCard({
  icon: Icon,
  value,
  label,
  accentColor = "#5e6dd2"
}: {
  icon: any;
  value: string | number;
  label: string;
  accentColor?: string;
}) {
  return (
    <motion.div
      className="relative p-4 md:p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 group"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-3">
        {/* Icône colorée avec fond teinté */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} strokeWidth={1.5} />
        </div>
      </div>
      <p className="text-[28px] font-semibold text-[#f7f8f8] tabular-nums leading-none mb-0.5">
        {value}
      </p>
      <span className="text-[12px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide">{label}</span>
    </motion.div>
  );
}
```

### Pattern ListItem (ProfileScreen)

```typescript
function ListItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
  danger,
  iconColor = "text-[#5e6dd2]"
}: {
  icon: any;
  title: string;
  subtitle: string;
  onClick: () => void;
  danger?: boolean;
  iconColor?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-colors group min-h-[56px] ${
        danger ? "hover:bg-[rgba(248,113,113,0.05)]" : "hover:bg-[rgba(255,255,255,0.03)]"
      }`}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.995 }}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        danger ? "bg-[rgba(248,113,113,0.1)]" : "bg-[rgba(255,255,255,0.04)]"
      }`}>
        <Icon className={`w-[18px] h-[18px] ${danger ? "text-[#f87171]" : iconColor}`} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <span className={`text-[14px] font-medium ${danger ? "text-[#f87171]" : "text-[#f7f8f8]"}`}>{title}</span>
        <p className="text-[13px] text-[#5e6063] truncate">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.15)]" />
    </motion.button>
  );
}
```

### Pattern SectionHeader

```typescript
function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[11px] font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-[0.05em]">
        {title}
      </h2>
      {action && onAction && (
        <motion.button
          onClick={onAction}
          className="text-[13px] text-[#5e6dd2] hover:text-[#8b93ff] font-medium flex items-center gap-1"
          whileHover={{ x: 2 }}
        >
          {action}
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </div>
  );
}
```

### Pattern Empty State

```typescript
<motion.div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#18191b] to-[#101012] border border-[rgba(255,255,255,0.06)] text-center">
  <div className="w-16 h-16 rounded-3xl bg-[#1f2023] flex items-center justify-center mx-auto mb-6">
    <Users className="w-8 h-8 text-[#5e6063]" strokeWidth={1.2} />
  </div>
  <h3 className="text-[18px] font-bold text-[#f7f8f8] mb-2">Pas encore de données</h3>
  <p className="text-[14px] text-[#8b8d90] mb-8 max-w-[300px] mx-auto">
    Description de l'état vide
  </p>
  <motion.button
    className="inline-flex items-center gap-2.5 h-12 px-7 rounded-xl bg-[#5e6dd2] text-white text-[15px] font-semibold shadow-lg shadow-[#5e6dd2]/20"
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Plus className="w-5 h-5" strokeWidth={2} />
    Action principale
  </motion.button>
</motion.div>
```

---

## COMPOSANTS PARTAGÉS EXISTANTS

### Composants UI Disponibles

| Composant | Fichier | Usage |
|-----------|---------|-------|
| `BottomNav` | `src/app/components/BottomNav.tsx` | Navigation mobile |
| `DesktopSidebar` | `src/app/components/DesktopSidebar.tsx` | Navigation desktop |
| `CommandPalette` | `src/app/components/CommandPalette.tsx` | Recherche rapide (Cmd+K) |
| `Toast` | `src/app/components/Toast.tsx` | Notifications |
| `ErrorBoundary` | `src/app/components/ErrorBoundary.tsx` | Gestion erreurs |
| `ProtectedRoute` | `src/app/components/ProtectedRoute.tsx` | Auth guard |
| `DatePicker` | `src/app/components/DatePicker.tsx` | Sélection date |
| `TimePicker` | `src/app/components/TimePicker.tsx` | Sélection heure |
| `Logo` | `src/app/components/Logo.tsx` | Logo app |

### Contexts React Disponibles

| Context | Import | Données fournies |
|---------|--------|------------------|
| `AuthContext` | `@/app/contexts/AuthContext` | `user`, `isAuthenticated`, `signOut`, `loading` |
| `SquadsContext` | `@/app/contexts/SquadsContext` | `squads`, `loading`, `refreshSquads` |
| `SessionsContext` | `@/app/contexts/SessionsContext` | `sessions`, `getSquadSessions` |
| `UserContext` | `@/app/contexts/UserContext` | `userProfile` |
| `NotificationsContext` | `@/app/contexts/NotificationsContext` | `notifications` |
| `FriendsContext` | `@/app/contexts/FriendsContext` | `friends` |
| `SubscriptionContext` | `@/app/contexts/SubscriptionContext` | `isPremium` |

### Hooks Personnalisés

| Hook | Usage |
|------|-------|
| `useIsMobile()` | Détecte si mobile |
| `useIsDesktop()` | Détecte si desktop |
| `useCommandPalette()` | Contrôle la palette de commandes |
| `useAnimationConfig()` | Config animations selon device |

---

## ERREURS À ÉVITER (CRITIQUE)

### 1. Animations Infinies

**NE JAMAIS FAIRE:**
```typescript
// INTERDIT - Cause des problèmes de performance
animate={{ rotate: 360 }}
transition={{ duration: 2, repeat: Infinity }}
```

**FAIRE À LA PLACE:**
```typescript
// OK - Animation finie ou CSS
transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
```

### 2. Opacity: 0 sur le Container Principal

**NE JAMAIS FAIRE:**
```typescript
// INTERDIT - Page invisible
<div style={{ opacity: 0 }}>
```

**FAIRE À LA PLACE:**
```typescript
// OK - Utiliser Framer Motion pour les transitions
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
```

### 3. Couleurs Hex Solides au lieu de RGBA

**NE JAMAIS FAIRE:**
```typescript
// ÉVITER - Pas assez subtil
className="bg-[#1a1a1a]"
```

**FAIRE À LA PLACE:**
```typescript
// OK - Transparent et subtil comme Linear
className="bg-[rgba(255,255,255,0.02)]"
```

### 4. Textes Trop Clairs

**NE JAMAIS FAIRE:**
```typescript
// ÉVITER - Trop blanc
className="text-white"
```

**FAIRE À LA PLACE:**
```typescript
// OK - Utiliser la hiérarchie
className="text-[#f7f8f8]"  // Principal
className="text-[#8b8d90]"  // Secondaire
className="text-[#5e6063]"  // Muted
```

### 5. Oublier le Padding Bottom pour BottomNav

**NE JAMAIS FAIRE:**
```typescript
// INTERDIT - Contenu caché par BottomNav
<div className="min-h-screen">
```

**FAIRE À LA PLACE:**
```typescript
// OK - Espace pour BottomNav mobile
<div className="min-h-screen pb-24 md:pb-8">
```

### 6. Web Locks / Timeout sur F5

**ATTENTION:** Le bug #4 était causé par des Web Locks mal gérés. Si tu vois des timeouts après refresh:
- Vérifier `api.ts` et `supabase.ts`
- Ne pas utiliser de locks persistants
- Timeout de sécurité de 15s max

---

## ORDRE DE PRIORITÉ DES PAGES

### Priorité 1 - Pages Principales (FAIT)
✅ Auth (Login, Signup)
✅ Navigation principale (Home, Squads, Sessions, Profile)
✅ Création/Détail (CreateSquad, SquadDetail)

### Priorité 2 - Pages Utilisateur (EN COURS)
🔄 Profile & Settings (EditProfile, Preferences, Privacy, Premium)
🔄 Stats & History (AdvancedStats, History, Leaderboard)
🔄 Intégrations (Discord, Calendar)

### Priorité 3 - Social & Community (À FAIRE)
⏳ Friends, SearchPlayers, Community
⏳ Badges, Achievements
⏳ Share, Invite

### Priorité 4 - Sessions Avancées (À FAIRE)
⏳ ProposeSession, RSVP, CheckIn
⏳ VoteSession, RecurringSession
⏳ Coaching tools

### Priorité 5 - Compétition (À FAIRE)
⏳ Ranking, Tournaments, Leagues
⏳ Seasons, Challenges

### Priorité 6 - B2B (BASSE PRIORITÉ)
⏳ Organization, EsportTeam
⏳ StreamerDashboard, Intelligence
⏳ ApiDocs

---

## NAVIGATION ET ROUTING

### Routes Principales

```typescript
// Auth
/login          → LoginScreen
/signup         → SignupScreen

// Navigation principale
/home           → HomeScreen (RÉFÉRENCE)
/squads         → SquadsScreen (RÉFÉRENCE)
/sessions       → SessionsScreen (RÉFÉRENCE)
/profile        → ProfileScreen (RÉFÉRENCE)

// Squads
/squads/:id     → SquadDetailScreen
/create-squad   → CreateSquadScreen
/join-squad     → JoinSquadScreen
/chat/:id       → SquadChatScreen

// Sessions
/propose-session → ProposeSessionScreen
/rsvp/:id       → RSVPScreen
/check-in/:id   → CheckInScreen

// Profile
/edit-profile   → EditProfileScreen
/preferences    → PreferencesScreen
/privacy        → PrivacyScreen
/premium        → PremiumScreen
```

### Fonction de Navigation

```typescript
// Dans les screens, utiliser onNavigate:
onNavigate('screen-name')           // Navigation simple
onNavigate('squad-detail', { squadId: 'xxx' })  // Avec params
```

---

_Dernière mise à jour: 30 Janvier 2026 - 34/67 écrans (51%)_
_Tous les fichiers commités - Prêt pour le prochain batch d'agents_
_Document enrichi avec: extraits de code, composants, erreurs à éviter, priorités, routing_
