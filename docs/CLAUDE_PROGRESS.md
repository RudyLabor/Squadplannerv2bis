# PROGRESSION CLAUDE - Squad Planner

> **IMPORTANT**: Copier ce fichier au début de chaque nouvelle conversation avec Claude pour maintenir le contexte.

## Consignes pour Claude

**Après chaque correction de bug ou modification de code :**

1. **Toujours commiter** les changements avec un message descriptif (format conventionnel : `fix:`, `feat:`, `perf:`, etc.)
2. **Toujours pousser** vers `origin/main` pour déployer sur Vercel
3. **Toujours mettre à jour** ce fichier CLAUDE_PROGRESS.md avec les changements effectués
4. **Utiliser Puppeteer** pour tester chaque page après modification

---

## CREDENTIALS (A GARDER CONFIDENTIEL)

### Application Squadplanner - Compte Test

- **Email**: rudylabor@hotmail.fr
- **Mot de passe**: SquadPlanner2026!

### Supabase

- **Project ID**: cwtoprbowdqcemdjrtir
- **URL**: https://cwtoprbowdqcemdjrtir.supabase.co
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE
- **Database Password**: Ruudboy92600\*

### URLs

- **Production**: https://squadplanner.vercel.app
- **Local**: http://localhost:5173

---

## MISSION ACTUELLE - Refonte UI Complète (51 écrans)

### Objectif

Refonte complète des 51 écrans restants de Squad Planner avec le design system Linear (dark, premium, minimal). S'inspirer des pages déjà refaites : Home, Squads, Sessions, Profil.

### Progression Globale

| Groupe                    | Total | Fait | Reste | Progression |
| ------------------------- | ----- | ---- | ----- | ----------- |
| 1. Auth                   | 2     | 2    | 0     | 100%        |
| 2. Dashboard & Home       | 8     | 1    | 7     | 12%         |
| 3. Squads                 | 10    | 5    | 5     | 50%         |
| 4. Sessions               | 8     | 1    | 7     | 12%         |
| 5. Profile & Settings     | 11    | 1    | 10    | 9%          |
| 6. Social & Community     | 10    | 0    | 10    | 0%          |
| 7. Compétition            | 6     | 0    | 6     | 0%          |
| 8. B2B & Avancé           | 6     | 0    | 6     | 0%          |
| **TOTAL**                 | **61**| **10**| **51**| **16%**    |

### Pages à Refaire (par priorité)

#### PRIORITÉ 1 - Dashboard (7 pages)
- [ ] NotificationsScreen `/notifications`
- [ ] NotificationSettingsScreen `/notification-settings`
- [ ] SmartSuggestionsScreen `/smart-suggestions`
- [ ] AvailabilityHeatmapScreen `/availability`
- [ ] CalendarSyncScreen `/calendar-sync`
- [ ] WeeklyRecapScreen `/weekly-recap`
- [ ] ActivityFeedScreen `/activity`

#### PRIORITÉ 2 - Squads (5 pages)
- [ ] SquadHealthScreen `/squad-health/:id`
- [ ] SquadCompositionScreen `/squad-composition/:id`
- [ ] LeadershipAnalysisScreen `/leadership-analysis/:id`
- [ ] JoinSquadScreen `/join-squad`
- [ ] DiscoverSquadsScreen `/discover-squads`

#### PRIORITÉ 3 - Sessions (7 pages)
- [ ] ProposeSessionScreen `/propose-session` (formulaire déjà vu mais à vérifier)
- [ ] RSVPScreen `/rsvp/:id`
- [ ] VoteSessionScreen `/vote-session/:id`
- [ ] CheckInScreen `/check-in/:id`
- [ ] RecurringSessionScreen `/recurring-sessions`
- [ ] AutoCoachingScreen `/auto-coaching`
- [ ] CoachingToolsScreen `/coaching-tools`

#### PRIORITÉ 4 - Profile & Settings (10 pages)
- [ ] EditProfileScreen `/edit-profile`
- [ ] PublicProfileScreen `/profile/:id`
- [ ] PremiumScreen `/premium`
- [ ] PremiumSuccessScreen `/premium/success`
- [ ] AdvancedStatsScreen `/advanced-stats`
- [ ] PreferencesScreen `/preferences`
- [ ] PrivacyScreen `/privacy`
- [ ] IntegrationsScreen `/integrations`
- [ ] DiscordConnectScreen `/discord-connect`
- [ ] DiscordBotScreen `/discord-bot`

#### PRIORITÉ 5 - Social & Community (10 pages)
- [ ] FriendsScreen `/friends`
- [ ] SearchPlayersScreen `/search-players`
- [ ] CommunityScreen `/community`
- [ ] AchievementsScreen `/achievements` (existe déjà, à vérifier)
- [ ] BadgesScreen `/badges`
- [ ] HistoryScreen `/history`
- [ ] ShareScreen `/share`
- [ ] InviteMemberScreen `/invite-member/:id`
- [ ] JoinViaLinkScreen `/join/:code`
- [ ] AcademyScreen `/academy`

#### PRIORITÉ 6 - Compétition (6 pages)
- [ ] LeaderboardScreen `/leaderboard`
- [ ] RankingScreen `/ranking`
- [ ] TournamentsScreen `/tournaments`
- [ ] LeaguesScreen `/leagues`
- [ ] SeasonsScreen `/seasons`
- [ ] ChallengesScreen `/challenges`

#### PRIORITÉ 7 - B2B & Avancé (6 pages)
- [ ] OrganizationScreen `/organization`
- [ ] EsportTeamScreen `/esport-team`
- [ ] EsportIntegrationsScreen `/esport-integrations`
- [ ] StreamerDashboardScreen `/streamer-dashboard`
- [ ] IntelligenceScreen `/intelligence`
- [ ] ApiDocsScreen `/api-docs`

---

## Design System Linear (Référence)

### Couleurs

```
Background:
  base:       #08090a      (page background)
  elevated:   #101012      (cards, surfaces)
  surface:    #18191b      (raised elements)
  hover:      #1f2023      (hover states)
  active:     #27282b      (active/pressed)

Foreground:
  primary:    #f7f8f8      (main text)
  secondary:  #c9cace      (secondary text)
  tertiary:   #8b8d90      (muted text)
  quaternary: #5e6063      (very muted)

Borders (RGBA):
  subtle:     rgba(255, 255, 255, 0.05)
  default:    rgba(255, 255, 255, 0.08)
  strong:     rgba(255, 255, 255, 0.12)
  focus:      rgba(94, 109, 210, 0.5)

Primary:      #5e6dd2 (hover: #6a79db)
Success:      #4ade80
Warning:      #f5a623
Error:        #f87171
Info:         #60a5fa
```

### Icônes colorées par catégorie

```
Squads/Gaming:  #5e6dd2 (violet)
Sessions/Time:  #f5a623 (orange)
Stats/Success:  #4ade80 (vert)
Time/Clock:     #60a5fa (bleu)
Users/Friends:  #8b93ff (violet clair)
```

### Composants Standards

```
Card (transparent):
  bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]
  hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]

Input Linear:
  bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]
  focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)]

Button Primary:
  bg-[#5e6dd2] hover:bg-[#6a79db] shadow-lg shadow-[#5e6dd2]/20

Button Secondary:
  bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]
  hover:bg-[rgba(255,255,255,0.06)]
```

### Animations Framer Motion

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }
  }
};
```

---

## BUGS CONNUS (À CORRIGER)

| #   | Description                                  | Sévérité | Fichier              | Statut     |
| --- | -------------------------------------------- | -------- | -------------------- | ---------- |
| 1   | Création squad bloque (RLS recursion)        | Haute    | Supabase RLS         | ✅ CORRIGÉ |
| 2   | Page détail squad invisible (opacity: 0)     | Haute    | SquadDetailScreen    | ✅ CORRIGÉ |
| 3   | Affichage "0 membres" (RLS trop restrictive) | Moyenne  | Supabase RLS         | ✅ CORRIGÉ |
| 4   | Page Home timeout après F5 (Web Locks SDK)   | Haute    | api.ts, supabase.ts  | ✅ CORRIGÉ |
| 5   | Bouton Déconnexion sidebar ne fonctionne pas | Moyenne  | DesktopSidebar.tsx   | ❌ À CORRIGER |

---

## TESTS AUTOMATISÉS (TEST_CHECKLIST.md)

### Phase 0 - MVP Core

| Section         | Passés | Total | Statut |
| --------------- | ------ | ----- | ------ |
| 0.1 Auth        | 3/7    | 7     | 43%    |
| 0.2 Home        | 5/7    | 7     | 71%    |
| 0.3 Navigation  | 6/6    | 6     | 100%   |
| 0.4 Squads      | 8/10   | 10    | 80%    |
| 0.5 Sessions    | 8/10   | 10    | 80%    |
| 0.6 RSVP        | 0/8    | 8     | 0%     |
| 0.7 Chat        | 0/4    | 4     | 0%     |

### Phase 1 - Engagement

| Section         | Passés | Total | Statut |
| --------------- | ------ | ----- | ------ |
| 1.1 Fiabilité   | 3/5    | 5     | 60%    |
| 1.5 Badges      | 3/5    | 5     | 60%    |

---

## Fichiers Clés du Projet

### Configuration
- `vite.config.ts` - Build config
- `tailwind.config.js` - Theme et design tokens
- `src/styles/tokens.ts` - Couleurs Linear et variants

### Composants Réutilisables
- `src/app/components/DesktopSidebar.tsx` - Navigation desktop
- `src/app/components/BottomNav.tsx` - Navigation mobile
- `src/app/components/AnimatedBackground.tsx` - Background statique CSS

### Écrans de Référence (déjà refaits)
- `src/app/screens/HomeScreen.tsx` - Page d'accueil
- `src/app/screens/SquadsScreen.tsx` - Liste des squads
- `src/app/screens/SessionsScreen.tsx` - Liste des sessions
- `src/app/screens/ProfileScreen.tsx` - Profil utilisateur

### Services & Contexts
- `src/lib/supabase.ts` - Client Supabase
- `src/app/contexts/AuthContext.tsx` - Authentification
- `src/app/contexts/SquadsContext.tsx` - Données squads
- `src/app/services/api.ts` - API calls

---

## Commandes Utiles

```bash
# Démarrer le serveur de dev
npm run dev

# Build production
npm run build

# Pousser vers Vercel (auto-deploy)
git add . && git commit -m "message" && git push origin main

# Tester avec Puppeteer (dans Claude)
# Utiliser les outils mcp__puppeteer__*
```

---

## Historique des Sessions

### Session 30 Jan 2026 - Tests et Bug Discovery

**Tests effectués avec Puppeteer:**
- ✅ Navigation (0.3.3-0.3.6) - TOUS PASSÉS
- ✅ Sessions (0.5.1-0.5.8) - TOUS PASSÉS
- ✅ Fiabilité (1.1.1, 1.1.2, 1.1.4) - PASSÉS
- ✅ Badges (1.5.1-1.5.3) - PASSÉS
- ❌ Déconnexion (0.1.4) - BUG TROUVÉ

**Bug découvert:**
- Bouton Déconnexion dans DesktopSidebar ne déclenche pas signOut()
- Workaround: vider localStorage + reload

### Sessions précédentes

- **30 Jan 23h55**: Fix Page Home timeout après F5
- **30 Jan 22h00**: Fix détail squad (animation + membres)
- **30 Jan 21h30**: Fix création squad (RLS recursion)
- **30 Jan 20h45**: Fix F5/refresh (workaround localStorage)

---

## Prochaines Étapes

1. **Corriger Bug #5** - Bouton Déconnexion
2. **Commencer Refonte Groupe 2** - Dashboard (7 pages)
3. **Tester chaque page** avec Puppeteer après refonte
4. **Identifier et corriger** les bugs au fur et à mesure
5. **Mettre à jour** ROADMAP_UI_REDESIGN.md après chaque page

---

_Dernière mise à jour: 30 Janvier 2026_
_Mission: Refonte UI 51 écrans + Bug fixing_
