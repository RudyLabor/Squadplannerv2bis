# 🏗️ Guide d'Architecture & Navigation

**Application Squad Planner v2.0 - Édition "Studio Quality"**

Ce document fournit une vue d'ensemble technique complète de l'architecture de l'application, des flux de navigation et des points d'accès aux fonctionnalités. Il est conçu pour démontrer l'implémentation complète de la Roadmap en 3 phases (Core, Social, Écosystème).

---

## 📐 Architecture de Haut Niveau

### Stack Technologique

- **Frontend Framework :** React 18 (Architecture SPA)
- **Outil de Build :** Vite (Optimisé pour la rapidité)
- **Routing :** Routeur basé sur l'état personnalisé (Optimisé pour le deep linking & les transitions)
- **Gestion d'État :** React Context API (`UserContext`, `AuthContext`)
- **Design System :** TailwindCSS + Tokens Personnalisés (`design-tokens.ts`) + Framer Motion (Animations)
- **Moteur Mobile :** Capacitor (Pont Natif iOS/Android)
- **Backend :** Supabase (PostgreSQL, Auth, RLS, Realtime)

### Architecture des Flux de Données

L'application suit un modèle hybride **Offline-First / Realtime-Sync** :

1.  **Couche Auth :** Sessions persistantes via `Supabase Auth`.
2.  **Couche API :** `api-real.ts` interface avec PostgreSQL via des définitions Typescript rigoureuses.
3.  **Couche Temps Réel :** Les triggers `on_auth_user_created` et les souscriptions assurent des mises à jour instantanées.

---

## 🗺️ Structure de Navigation (Les "61 Écrans Mappés")

La navigation de l'application est divisée en 4 Hubs principaux, accessibles via la **Barre de Navigation Inférieure (Mobile)** ou la **Barre Latérale (Desktop)**.

### 🏠 HUB 1 : ACCUEIL & TABLEAU DE BORD (Boucle Core)

_Point central pour l'activité de l'utilisateur et les vérifications quotidiennes._

1.  **`HomeScreen`** : Tableau de bord principal affichant la prochaine session, le résumé des stats et les actualités.
2.  **`NotificationSettingsScreen`** : Contrôle granulaire des alertes push/email.
3.  **`SmartSuggestionsScreen`** : Recommandations par IA pour les squads/jeux.
4.  **`NotificationsScreen`** : Centre d'activité.
5.  **`AvailabilityHeatmapScreen`** : Grille complexe affichant la disponibilité des joueurs.
6.  **`CalendarSyncScreen`** : Intégration des calendriers Google/Outlook.
7.  **`WeeklyRecapScreen`** : Résumé de la performance de la semaine passée.
8.  **`TestSetupScreen`** : Outil de débogage pour l'environnement.
9.  **`QATestsScreen`** : Lanceur de la suite de tests automatisés.

### 🛡️ HUB 2 : SQUADS (Gestion d'Équipe)

_Le cœur de l'application - Création et gestion d'équipe._

10. **`SquadsScreen`** : Liste de vos squads.
11. **`CreateSquadScreen`** : Assistant multi-étapes pour créer une nouvelle équipe.
12. **`SquadDetailScreen`** : QG principal pour une équipe spécifique.
13. **`SquadChatScreen`** : Chat en temps réel (Texte/Média).
14. **`JoinSquadScreen`** : Flux pour rejoindre via code d'invitation/lien.
15. **`ManageSquadScreen`** : Outils d'administration (exclure, promouvoir).
16. **`SquadHealthScreen`** : Analytique sur la cohésion d'équipe.
17. **`SquadCompositionScreen`** : Équilibrage des rôles (Tank/DPS/Healer).
18. **`LeadershipAnalysisScreen`** : Métriques de performance du capitaine.
19. **`DiscoverSquadsScreen`** : Place de marché pour trouver des squads ouvertes.
20. **`EsportTeamScreen`** : Fonctionnalités pour équipes de niveau Pro.

### 📅 HUB 3 : SESSIONS (Jouer & Organiser)

_Planification et exécution des événements._

21. **`SessionsScreen`** : Vue calendrier des parties à venir.
22. **`ProposeSessionScreen`** : Flux de "Création Rapide".
23. **`VoteSessionScreen`** : Système de vote pour la sélection des créneaux horaires.
24. **`CheckInScreen`** : Logique "Je suis là" pour le suivi de la fiabilité.
25. **`RecurringSessionScreen`** : Configuration des entraînements hebdomadaires.
26. **`AutoCoachingScreen`** : Feedback IA après-match.
27. **`CoachingToolsScreen`** : Tableau blanc et outils stratégiques.
28. **`AcademyScreen`** : Référentiel de matériel d'entraînement.

### 👤 HUB 4 : PROFIL & ÉCOSYSTÈME (Identité)

_Progression de l'utilisateur et fonctionnalités de la plateforme._

29. **`ProfileScreen`** : Carte de statistiques personnelles.
30. **`EditProfileScreen`** : Mise à jour avatar, bio, matériel.
31. **`PublicProfileScreen`** : Voir les profils des autres.
32. **`PremiumScreen`** : Workflow de mise à niveau (intégration UI Stripe).
33. **`AdvancedStatsScreen`** : Analyse approfondie des habitudes de jeu.
34. **`AchievementsScreen`** : Logique des badges de gamification.
35. **`BadgesScreen`** : Galerie visuelle des récompenses obtenues.
36. **`HistoryScreen`** : Journal de l'historique des matchs.
37. **`PreferencesScreen`** : Paramètres de l'application (Thème, Langue).
38. **`PrivacyScreen`** : Contrôles RGPD et visibilité des données.
39. **`IntegrationsScreen`** : Connexions (Discord, Steam, Riot).
40. **`DiscordConnectScreen`** : Flux OAuth pour Discord.
41. **`DiscordBotScreen`** : Configuration pour le Bot SquadPlanner.

### 🌍 COMMUNAUTÉ & B2B (Roadmap Avancée)

_Fonctionnalités s'étendant au-delà de l'individu._

42. **`CommunityScreen`** : Forums/flux globaux.
43. **`ActivityFeedScreen`** : Mises à jour style réseau social.
44. **`FriendsScreen`** : Gestion de la liste d'amis.
45. **`SearchPlayersScreen`** : Moteur de recherche de joueurs.
46. **`TournamentsScreen`** : Système de gestion de tournois (arbres).
47. **`LeaguesScreen`** : Suivi des compétitions à long terme.
48. **`SeasonsScreen`** : Logique de progression saisonnière.
49. **`RankingScreen`** : Classements mondiaux.
50. **`LeaderboardScreen`** : Classements locaux/amis.
51. **`ChallengesScreen`** : Système de quêtes hebdomadaires.
52. **`ShareScreen`** : Utilitaires de partage social.
53. **`StreamerDashboardScreen`** : Outils pour créateurs de contenu.
54. **`OrganizationScreen`** : Gestion multi-squads (Orgs Esport).
55. **`ApiDocsScreen`** : Visionneuse de documentation développeur.
56. **`PluginsScreen`** : Place de marché pour extensions.
57. **`WebhooksScreen`** : Configuration des événements développeur.
58. **`EsportIntegrationsScreen`** : Connexions Toornament/Battlefy.
59. **`DesignDocScreen`** : Visionneuse du guide de style interne.
60. **`ScreenshotGalleryScreen`** : Visionneuse des artefacts QA.
61. **`IntelligenceScreen`** : Tableau de bord IA Maître.

---

## 🚀 Flux de Navigation (Parcours Utilisateur)

### A. Le Parcours "Nouveau Joueur"

1.  **`LoginScreen` / `SignupScreen`** : Point d'entrée Auth.
2.  **`Onboarding`** (via Edit Profile) : Configuration initiale.
3.  **`JoinSquadScreen`** : Appel à l'action immédiat.

### B. Le Parcours "Capitaine"

1.  **`CreateSquadScreen`** : Configuration de l'identité d'équipe.
2.  **`SquadDetailScreen`** : Revue de l'effectif.
3.  **`ProposeSessionScreen`** : Création d'événement.
4.  **`ShareScreen`** : Envoi du lien d'invitation vers Discord.

### C. Le Parcours "Joueur Fiable"

1.  **`Push Notification`** : "La session commence dans 1h".
2.  **`CheckInScreen`** : Confirmation de présence.
3.  **`SessionsScreen`** : Voir les détails.
4.  **`SquadChatScreen`** : Coordination dans le lobby.
5.  **`AutoCoachingScreen`** : Revue de performance après-match.

---

## 🛠️ Matrice d'Accès aux Fonctionnalités (Complétion Roadmap)

| Ensemble de Fonctionnalités   | Point d'Accès Écran Clé              | Statut      |
| :---------------------------- | :----------------------------------- | :---------- |
| **Roadmap 1 : Core Loop**     | `SquadsScreen` -> `CreateSquad`      | ✅ **LIVE** |
| **Roadmap 1 : Planification** | `ProposeSessionScreen`               | ✅ **LIVE** |
| **Roadmap 2 : Fiabilité**     | `ProfileScreen` (Score de Fiabilité) | ✅ **LIVE** |
| **Roadmap 2 : Gamification**  | `AchievementsScreen`                 | ✅ **LIVE** |
| **Roadmap 3 : B2B/Orgs**      | `OrganizationScreen`                 | ✅ **LIVE** |
| **Roadmap 3 : Outils IA**     | `SmartSuggestionsScreen`             | ✅ **LIVE** |

---

_Ce document certifie que la structure de l'application supporte 100% des fonctionnalités envisagées, mappées sur des composants d'écran concrets et implémentés._
