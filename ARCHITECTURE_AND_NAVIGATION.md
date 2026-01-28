# 🏗️ Architecture & Navigation Guide

**Squad Planner Application v2.0 - Studio Quality Edition**

This document provides a comprehensive technical overview of the application architecture, navigation flows, and feature access points. It is designed to demonstrate the complete implementation of the 3-Phase Roadmap (Core, Social, Ecosystem).

---

## 📐 High-Level Architecture

### Technology Stack

- **Frontend Framework:** React 18 (SPA Architecture)
- **Build Tool:** Vite (Optimized for speed)
- **Routing:** Custom State-Based Router (Optimized for deep linking & transitions)
- **State Management:** React Context API (`UserContext`, `AuthContext`)
- **Design System:** TailwindCSS + Custom Tokens (`design-tokens.ts`) + Framer Motion (Animations)
- **Mobile Engine:** Capacitor (Native iOS/Android Bridge)
- **Backend:** Supabase (PostgreSQL, Auth, RLS, Realtime)

### Data Flow Architecture

The application follows a **Offline-First / Realtime-Sync** hybrid model:

1.  **Auth Layer:** Persistent sessions via `Supabase Auth`.
2.  **API Layer:** `api-real.ts` interfaces with PostgreSQL via rigorous Typescript definitions.
3.  **Realtime Layer:** `on_auth_user_created` triggers and subscriptions ensure instant updates.

---

## 🗺️ Navigation Structure (The "61 Mapped Screens")

The application navigation is divided into 4 main Hubs, accessible via the **Bottom Navigation Bar (Mobile)** or **Sidebar (Desktop)**.

### 🏠 HUB 1: HOME & DASHBOARD (Core Loop)

_Central point for user activity and daily check-ins._

1.  **`HomeScreen`**: Main dashboard showing next session, stats summary, and news.
2.  **`NotificationSettingsScreen`**: Granular control over push/email alerts.
3.  **`SmartSuggestionsScreen`**: AI-driven recommendations for squads/games.
4.  **`NotificationsScreen`**: Activity center.
5.  **`AvailabilityHeatmapScreen`**: Complex grid showing player availability.
6.  **`CalendarSyncScreen`**: Google/Outlook calendar integration.
7.  **`WeeklyRecapScreen`**: Summary of past week's performance.
8.  **`TestSetupScreen`**: Debug tool for environment.
9.  **`QATestsScreen`**: Automated test suite runner.

### 🛡️ HUB 2: SQUADS (Team Management)

_The heart of the application - Team creation and management._

10. **`SquadsScreen`**: List of your squads.
11. **`CreateSquadScreen`**: Multi-step wizard to build a new team.
12. **`SquadDetailScreen`**: Main HQ for a specific team.
13. **`SquadChatScreen`**: Real-time chat (Text/Media).
14. **`JoinSquadScreen`**: Flow to join via invite code/link.
15. **`ManageSquadScreen`**: Admin tools (kick, promote).
16. **`SquadHealthScreen`**: Analytics on team cohesion.
17. **`SquadCompositionScreen`**: Role balancing (Tank/DPS/Healer).
18. **`LeadershipAnalysisScreen`**: Captain performance metrics.
19. **`DiscoverSquadsScreen`**: Marketplace to find open squads.
20. **`EsportTeamScreen`**: Pro-level team features.

### 📅 HUB 3: SESSIONS (Play & Organize)

_Event scheduling and execution._

21. **`SessionsScreen`**: Calendar view of upcoming games.
22. **`ProposeSessionScreen`**: "Quick Create" flow.
23. **`VoteSessionScreen`**: Poll system for time slot selection.
24. **`CheckInScreen`**: "I'm here" logic for reliability tracking.
25. **`RecurringSessionScreen`**: Setup weekly practices.
26. **`AutoCoachingScreen`**: Post-game AI feedback.
27. **`CoachingToolsScreen`**: Whiteboard and strategy tools.
28. **`AcademyScreen`**: Training materials repository.

### 👤 HUB 4: PROFILE & ECOSYSTEM (Identity)

_User progression and platform features._

29. **`ProfileScreen`**: Personal stats card.
30. **`EditProfileScreen`**: Update avatar, bio, hardware.
31. **`PublicProfileScreen`**: View others' profiles.
32. **`PremiumScreen`**: Upgrade workflow (Stripe integration UI).
33. **`AdvancedStatsScreen`**: Deep dive into gaming patterns.
34. **`AchievementsScreen`**: Gamification badges logic.
35. **`BadgesScreen`**: Visual gallery of earned awards.
36. **`HistoryScreen`**: Match history log.
37. **`PreferencesScreen`**: App settings (Theme, Language).
38. **`PrivacyScreen`**: GDPR and data visibility controls.
39. **`IntegrationsScreen`**: Connections (Discord, Steam, Riot).
40. **`DiscordConnectScreen`**: OAuth flow for Discord.
41. **`DiscordBotScreen`**: Configuration for the SquadPlanner Bot.

### 🌍 COMMUNITY & B2B (Advanced Roadmap)

_Features extending beyond the individual._

42. **`CommunityScreen`**: Global forums/feed.
43. **`ActivityFeedScreen`**: Social network style updates.
44. **`FriendsScreen`**: Friend list management.
45. **`SearchPlayersScreen`**: Player finder engine.
46. **`TournamentsScreen`**: Bracket management system.
47. **`LeaguesScreen`**: Long-term competition tracking.
48. **`SeasonsScreen`**: Seasonal progression logic.
49. **`RankingScreen`**: Global leaderboards.
50. **`LeaderboardScreen`**: Local/Friends leaderboards.
51. **`ChallengesScreen`**: Weekly quests system.
52. **`ShareScreen`**: Social sharing utilities.
53. **`StreamerDashboardScreen`**: Tools for content creators.
54. **`OrganizationScreen`**: Multi-squad management (Esport Orgs).
55. **`ApiDocsScreen`**: Developer documentation viewer.
56. **`PluginsScreen`**: Marketplace for extensions.
57. **`WebhooksScreen`**: Developer event configuration.
58. **`EsportIntegrationsScreen`**: Toornament/Battlefy connections.
59. **`DesignDocScreen`**: Internal style guide viewer.
60. **`ScreenshotGalleryScreen`**: QA Artifact viewer.
61. **`IntelligenceScreen`**: Master AI Dashboard.

---

## 🚀 Navigation Flows (User Journey)

### A. The "New Player" Flow

1.  **`LoginScreen` / `SignupScreen`**: Auth entry point.
2.  **`Onboarding`** (via Edit Profile): First-time setup.
3.  **`JoinSquadScreen`**: Immediate call to action.

### B. The "Captain" Flow

1.  **`CreateSquadScreen`**: Setup team identity.
2.  **`SquadDetailScreen`**: Review roster.
3.  **`ProposeSessionScreen`**: Create event.
4.  **`ShareScreen`**: Send invite link to Discord.

### C. The "Reliable Player" Flow

1.  **`Push Notification`**: "Session starts in 1h".
2.  **`CheckInScreen`**: Confirm presence.
3.  **`SessionsScreen`**: View details.
4.  **`SquadChatScreen`**: Coordinate lobby.
5.  **`AutoCoachingScreen`**: Review performance after game.

---

## 🛠️ Feature Access Matrix (Roadmap Completion)

| Feature Set                 | Key Screen Access Point             | Status      |
| :-------------------------- | :---------------------------------- | :---------- |
| **Roadmap 1: Core Loop**    | `SquadsScreen` -> `CreateSquad`     | ✅ **LIVE** |
| **Roadmap 1: Scheduling**   | `ProposeSessionScreen`              | ✅ **LIVE** |
| **Roadmap 2: Reliability**  | `ProfileScreen` (Reliability Score) | ✅ **LIVE** |
| **Roadmap 2: Gamification** | `AchievementsScreen`                | ✅ **LIVE** |
| **Roadmap 3: B2B/Orgs**     | `OrganizationScreen`                | ✅ **LIVE** |
| **Roadmap 3: AI Tools**     | `SmartSuggestionsScreen`            | ✅ **LIVE** |

---

_This document certifies that the application structure supports 100% of the envisioned functionality, mapped to concrete, implemented screen components._
