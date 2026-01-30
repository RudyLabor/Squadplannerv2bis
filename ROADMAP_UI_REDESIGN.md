# ROADMAP UI REDESIGN - Linear Design System

> **Objectif**: Refonte des 61 écrans de Squad Planner avec le design system Linear (dark, premium, minimal)
>
> **Base URL**: `https://squadplanner.vercel.app`
> **Déploiement**: Auto-deploy sur chaque `git push` vers `main`

---

## Progression Globale

| Groupe | Pages | Fait | Reste | Progression |
|--------|-------|------|-------|-------------|
| 1. Auth | 2 | 2 | 0 | ██████████ 100% |
| 2. Dashboard | 8 | 1 | 7 | █░░░░░░░░░ 12% |
| 3. Squads | 10 | 5 | 5 | █████░░░░░ 50% |
| 4. Sessions | 8 | 1 | 7 | █░░░░░░░░░ 12% |
| 5. Profile & Settings | 11 | 1 | 10 | █░░░░░░░░░ 9% |
| 6. Social & Community | 10 | 0 | 10 | ░░░░░░░░░░ 0% |
| 7. Compétition | 6 | 0 | 6 | ░░░░░░░░░░ 0% |
| 8. B2B & Avancé | 6 | 0 | 6 | ░░░░░░░░░░ 0% |
| **TOTAL** | **61** | **10** | **51** | **16%** |

---

## Groupe 1: Auth (2/2) ✅ COMPLET

| # | Page | Statut | Lien |
|---|------|--------|------|
| 1 | LoginScreen | ✅ Fait | [/login](https://squadplanner.vercel.app/login) |
| 2 | SignupScreen | ✅ Fait | [/signup](https://squadplanner.vercel.app/signup) |

---

## Groupe 2: Dashboard & Home (1/8)

| # | Page | Statut | Lien |
|---|------|--------|------|
| 3 | HomeScreen | ✅ Fait | [/home](https://squadplanner.vercel.app/home) |
| 4 | NotificationsScreen | ⏳ À faire | [/notifications](https://squadplanner.vercel.app/notifications) |
| 5 | NotificationSettingsScreen | ⏳ À faire | [/notification-settings](https://squadplanner.vercel.app/notification-settings) |
| 6 | SmartSuggestionsScreen | ⏳ À faire | [/smart-suggestions](https://squadplanner.vercel.app/smart-suggestions) |
| 7 | AvailabilityHeatmapScreen | ⏳ À faire | [/availability](https://squadplanner.vercel.app/availability) |
| 8 | CalendarSyncScreen | ⏳ À faire | [/calendar-sync](https://squadplanner.vercel.app/calendar-sync) |
| 9 | WeeklyRecapScreen | ⏳ À faire | [/weekly-recap](https://squadplanner.vercel.app/weekly-recap) |
| 10 | ActivityFeedScreen | ⏳ À faire | [/activity](https://squadplanner.vercel.app/activity) |

---

## Groupe 3: Squads (5/10)

| # | Page | Statut | Lien |
|---|------|--------|------|
| 11 | SquadsScreen | ✅ Fait | [/squads](https://squadplanner.vercel.app/squads) |
| 12 | CreateSquadScreen | ✅ Fait | [/create-squad](https://squadplanner.vercel.app/create-squad) |
| 13 | SquadDetailScreen | ✅ Fait | [/squads/squad-1](https://squadplanner.vercel.app/squads/squad-1) |
| 14 | SquadManagementScreen | ✅ Fait | [/squad-management/squad-1](https://squadplanner.vercel.app/squad-management/squad-1) |
| 15 | SquadChatScreen | ✅ Fait | [/chat/squad-1](https://squadplanner.vercel.app/chat/squad-1) |
| 16 | SquadHealthScreen | ⏳ À faire | [/squad-health/squad-1](https://squadplanner.vercel.app/squad-health/squad-1) |
| 17 | SquadCompositionScreen | ⏳ À faire | [/squad-composition/squad-1](https://squadplanner.vercel.app/squad-composition/squad-1) |
| 18 | LeadershipAnalysisScreen | ⏳ À faire | [/leadership-analysis/squad-1](https://squadplanner.vercel.app/leadership-analysis/squad-1) |
| 19 | JoinSquadScreen | ⏳ À faire | [/join-squad](https://squadplanner.vercel.app/join-squad) |
| 20 | DiscoverSquadsScreen | ⏳ À faire | [/discover-squads](https://squadplanner.vercel.app/discover-squads) |

---

## Groupe 4: Sessions (1/8)

| # | Page | Statut | Lien |
|---|------|--------|------|
| 21 | SessionsScreen | ✅ Fait | [/sessions](https://squadplanner.vercel.app/sessions) |
| 22 | ProposeSessionScreen | ⏳ À faire | [/propose-session](https://squadplanner.vercel.app/propose-session) |
| 23 | RSVPScreen | ⏳ À faire | [/rsvp/session-1](https://squadplanner.vercel.app/rsvp/session-1) |
| 24 | VoteSessionScreen | ⏳ À faire | [/vote-session/session-1](https://squadplanner.vercel.app/vote-session/session-1) |
| 25 | CheckInScreen | ⏳ À faire | [/check-in/session-1](https://squadplanner.vercel.app/check-in/session-1) |
| 26 | RecurringSessionScreen | ⏳ À faire | [/recurring-sessions](https://squadplanner.vercel.app/recurring-sessions) |
| 27 | AutoCoachingScreen | ⏳ À faire | [/auto-coaching](https://squadplanner.vercel.app/auto-coaching) |
| 28 | CoachingToolsScreen | ⏳ À faire | [/coaching-tools](https://squadplanner.vercel.app/coaching-tools) |

---

## Groupe 5: Profile & Settings (1/11)

| # | Page | Statut | Lien |
|---|------|--------|------|
| 29 | ProfileScreen | ✅ Fait | [/profile](https://squadplanner.vercel.app/profile) |
| 30 | EditProfileScreen | ⏳ À faire | [/edit-profile](https://squadplanner.vercel.app/edit-profile) |
| 31 | PublicProfileScreen | ⏳ À faire | [/profile/user-1](https://squadplanner.vercel.app/profile/user-1) |
| 32 | PremiumScreen | ⏳ À faire | [/premium](https://squadplanner.vercel.app/premium) |
| 33 | PremiumSuccessScreen | ⏳ À faire | [/premium/success](https://squadplanner.vercel.app/premium/success) |
| 34 | AdvancedStatsScreen | ⏳ À faire | [/advanced-stats](https://squadplanner.vercel.app/advanced-stats) |
| 35 | PreferencesScreen | ⏳ À faire | [/preferences](https://squadplanner.vercel.app/preferences) |
| 36 | PrivacyScreen | ⏳ À faire | [/privacy](https://squadplanner.vercel.app/privacy) |
| 37 | IntegrationsScreen | ⏳ À faire | [/integrations](https://squadplanner.vercel.app/integrations) |
| 38 | DiscordConnectScreen | ⏳ À faire | [/discord-connect](https://squadplanner.vercel.app/discord-connect) |
| 39 | DiscordBotScreen | ⏳ À faire | [/discord-bot](https://squadplanner.vercel.app/discord-bot) |

---

## Groupe 6: Social & Community (0/10)

| # | Page | Statut | Lien |
|---|------|--------|------|
| 40 | FriendsScreen | ⏳ À faire | [/friends](https://squadplanner.vercel.app/friends) |
| 41 | SearchPlayersScreen | ⏳ À faire | [/search-players](https://squadplanner.vercel.app/search-players) |
| 42 | CommunityScreen | ⏳ À faire | [/community](https://squadplanner.vercel.app/community) |
| 43 | AchievementsScreen | ⏳ À faire | [/achievements](https://squadplanner.vercel.app/achievements) |
| 44 | BadgesScreen | ⏳ À faire | [/badges](https://squadplanner.vercel.app/badges) |
| 45 | HistoryScreen | ⏳ À faire | [/history](https://squadplanner.vercel.app/history) |
| 46 | ShareScreen | ⏳ À faire | [/share](https://squadplanner.vercel.app/share) |
| 47 | InviteMemberScreen | ⏳ À faire | [/invite-member/squad-1](https://squadplanner.vercel.app/invite-member/squad-1) |
| 48 | JoinViaLinkScreen | ⏳ À faire | [/join/ABC123](https://squadplanner.vercel.app/join/ABC123) |
| 49 | AcademyScreen | ⏳ À faire | [/academy](https://squadplanner.vercel.app/academy) |

---

## Groupe 7: Compétition (0/6)

| # | Page | Statut | Lien |
|---|------|--------|------|
| 50 | LeaderboardScreen | ⏳ À faire | [/leaderboard](https://squadplanner.vercel.app/leaderboard) |
| 51 | RankingScreen | ⏳ À faire | [/ranking](https://squadplanner.vercel.app/ranking) |
| 52 | TournamentsScreen | ⏳ À faire | [/tournaments](https://squadplanner.vercel.app/tournaments) |
| 53 | LeaguesScreen | ⏳ À faire | [/leagues](https://squadplanner.vercel.app/leagues) |
| 54 | SeasonsScreen | ⏳ À faire | [/seasons](https://squadplanner.vercel.app/seasons) |
| 55 | ChallengesScreen | ⏳ À faire | [/challenges](https://squadplanner.vercel.app/challenges) |

---

## Groupe 8: B2B & Avancé (0/6)

| # | Page | Statut | Lien |
|---|------|--------|------|
| 56 | OrganizationScreen | ⏳ À faire | [/organization](https://squadplanner.vercel.app/organization) |
| 57 | EsportTeamScreen | ⏳ À faire | [/esport-team](https://squadplanner.vercel.app/esport-team) |
| 58 | EsportIntegrationsScreen | ⏳ À faire | [/esport-integrations](https://squadplanner.vercel.app/esport-integrations) |
| 59 | StreamerDashboardScreen | ⏳ À faire | [/streamer-dashboard](https://squadplanner.vercel.app/streamer-dashboard) |
| 60 | IntelligenceScreen | ⏳ À faire | [/intelligence](https://squadplanner.vercel.app/intelligence) |
| 61 | ApiDocsScreen | ⏳ À faire | [/api-docs](https://squadplanner.vercel.app/api-docs) |

---

## Pages Utilitaires (hors scope redesign)

| Page | Lien | Note |
|------|------|------|
| PluginsScreen | [/plugins](https://squadplanner.vercel.app/plugins) | B2B - basse priorité |
| WebhooksScreen | [/webhooks](https://squadplanner.vercel.app/webhooks) | B2B - basse priorité |
| TestSetupScreen | [/test-setup](https://squadplanner.vercel.app/test-setup) | Dev only |
| QATestsScreen | [/qa-tests](https://squadplanner.vercel.app/qa-tests) | Dev only |
| DesignDocScreen | [/design-doc](https://squadplanner.vercel.app/design-doc) | Dev only |
| ScreenshotGalleryScreen | [/screenshots](https://squadplanner.vercel.app/screenshots) | Dev only |
| OAuthCallbackScreen | [/oauth/callback](https://squadplanner.vercel.app/oauth/callback) | Technique |

---

## Design System - Linear Dark Mode (MIS À JOUR 30 Jan 2026)

### Couleurs Linear
```
Background:
  base:       #08090a                          (page background)
  elevated:   #101012                          (cards, surfaces)
  surface:    #18191b                          (raised elements)
  hover:      #1f2023                          (hover states)
  active:     #27282b                          (active/pressed)

Foreground:
  primary:    #f7f8f8                          (main text)
  secondary:  #c9cace                          (secondary text)
  tertiary:   #8b8d90                          (muted text)
  quaternary: #5e6063                          (very muted)

Borders (RGBA pour transparence):
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

### Standards d'Icônes (colorées par catégorie)
```
Squads/Gaming:  #5e6dd2 (violet)
Sessions/Time:  #f5a623 (orange)
Stats/Success:  #4ade80 (vert)
Time/Clock:     #60a5fa (bleu)
Users/Friends:  #8b93ff (violet clair)
```

### Animations Linear
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.02 }
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

### Composants Standards Linear
```
Card (transparent):
  bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]
  hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]

Input Linear:
  bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]
  hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]
  focus:border-[rgba(94,109,210,0.5)] focus:ring-2 focus:ring-[rgba(94,109,210,0.15)]

Button Primary:
  bg-[#5e6dd2] hover:bg-[#6a79db] shadow-lg shadow-[#5e6dd2]/20

Button Secondary (transparent):
  bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]
  hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]

StatCard (avec icône colorée):
  bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]
  + icône avec backgroundColor: `${accentColor}15`

EmptyState:
  bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]
  + icône colorée par catégorie
```

---

## Notes

- Chaque page doit être validée visuellement avant de passer à la suivante
- **IMPORTANT**: Utiliser les backgrounds rgba transparents (0.02) au lieu des couleurs hex solides
- Les icônes doivent être colorées par catégorie (voir Standards d'Icônes)
- Les focus states doivent inclure un ring: `focus:ring-2 focus:ring-[rgba(94,109,210,0.15)]`
- Redémarrer le serveur après chaque session: `npm run dev`

## Changelog

### 30 Janvier 2026 - Refonte Linear Complete
- ✅ Mise à jour HomeScreen avec backgrounds transparents et icônes colorées
- ✅ Mise à jour SquadsScreen avec StatCards colorés et cards transparentes
- ✅ Mise à jour SessionsScreen avec FilterTabs Linear et cards transparentes
- ✅ Mise à jour ProfileScreen avec sections colorées et ListItems améliorés
- ✅ Création tokens.ts avec `linearDark` et `motionVariants`
- ✅ Mise à jour theme.css avec classes `.linear-*`

---

*Dernière mise à jour: 30 janvier 2026*
