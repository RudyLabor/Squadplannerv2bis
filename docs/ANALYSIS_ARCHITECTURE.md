# Analyse Complète - Architecture et Fonctionnalités Squad Planner

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Technique](#architecture-technique)
3. [Stack Technologique](#stack-technologique)
4. [Base de Données](#base-de-données)
5. [Design System](#design-system)
6. [Structure du Projet](#structure-du-projet)
7. [Navigation Complète](#navigation-complète)
8. [Fonctionnalités Détaillées](#fonctionnalités-détaillées)
9. [Système de Gamification](#système-de-gamification)
10. [Intégrations](#intégrations)
11. [Flux Utilisateurs](#flux-utilisateurs)

---

## Vue d'Ensemble

**Squad Planner** est une plateforme mobile premium conçue pour les gamers exigeants qui transforme l'organisation de vos sessions de jeu en équipe.

### Objectifs Principaux

- Application mobile premium pour les équipes de joueurs (squads)
- Révolutionne la planification des sessions de jeu en équipe
- Élimine le chaos des communications dispersées
- Offre une expérience fluide, organisée et gamifiée

### Fonctionnalités Clés

- **Création de squads** : De 2 à 100 joueurs
- **Planification de sessions** : Système intelligent avec RSVP
- **Score de fiabilité** : Récompense l'engagement
- **Chat temps réel** : Communication instantanée
- **Gamification complète** : XP, niveaux, achievements, badges
- **Mode compétitif B2B** : Tournois, ligues, saisons

### Principe Fondamental

> "En 5 secondes je sais quand on joue, qui vient, et s'il manque des réponses."

---

## Architecture Technique

### Vue d'Ensemble de l'Architecture

L'application repose sur une architecture moderne et éprouvée garantissant **performance, scalabilité et maintenabilité**.

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  React 18 + TypeScript + Tailwind CSS v4.0                  │
│  61 écrans │ Composants réutilisables │ Contextes React    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                BACKEND (Supabase + Hono)                     │
│  PostgreSQL (27 tables) │ Auth │ Storage │ Realtime         │
│  Hono Server (API Edge Functions)                           │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Modulaire

L'architecture modulaire permet une **évolution rapide des fonctionnalités** tout en maintenant une base de code propre et organisée.

---

## Stack Technologique

### Frontend React

- **React 18 + TypeScript** : Framework moderne avec typage fort
- **Tailwind CSS v4.0** : Styling utilitaire et responsive
- **React Router** : Navigation côté client
- **Lucide React** : Bibliothèque d'icônes

### Backend Supabase

- **PostgreSQL** : 27 tables organisées
- **Supabase Auth** : Authentification sécurisée
- **Supabase Storage** : Stockage de fichiers (avatars, images)
- **Realtime** : WebSocket pour chat et notifications
- **Hono Server** : API Edge Functions pour logique métier

### Outils et Services

- **Hono** : Framework API ultra-rapide
- **WebSocket** : Communication temps réel
- **OAuth Google** : Connexion simplifiée (optionnel)

---

## Base de Données

### Structure PostgreSQL - 27 Tables

#### Tables Principales (9 tables)

1. **users** : Données utilisateurs
2. **squads** : Informations des équipes
3. **squad_members** : Relations membres/squads avec rôles
4. **sessions** : Sessions de jeu planifiées
5. **session_rsvps** : Réponses de participation
6. **recurring_sessions** : Rituels hebdomadaires
7. **messages** : Chat en temps réel
8. **notifications** : Alertes utilisateurs
9. **friendships** : Relations d'amitié

#### Tables Gamification (6 tables)

10. **achievements** : Définitions des succès
11. **user_achievements** : Succès débloqués par utilisateur
12. **badges** : Collection de badges
13. **user_badges** : Badges obtenus
14. **challenges** : Défis quotidiens/hebdo/mensuels
15. **user_challenge_progress** : Progression des défis

#### Tables Compétition (6 tables)

16. **tournaments** : Tournois organisés
17. **tournament_teams** : Équipes participantes
18. **leagues** : Ligues compétitives
19. **league_teams** : Équipes en ligue
20. **seasons** : Saisons compétitives
21. **season_stats** : Statistiques par saison

#### Tables Système (6 tables)

22. **availability_slots** : Disponibilités membres
23. **organizations** : Organisations B2B
24. **webhooks** : Intégrations externes
25. **integrations** : Discord, Steam, Twitch, etc.
26. **analytics_squad** : Analytics par squad
27. **analytics_user** : Analytics par utilisateur

---

## Design System

### Design System "Warm Premium v4.0"

#### Palette de Couleurs Principales

**Fond Principal**
- `#F5F3F0` : Beige chaleureux créant une atmosphère accueillante

**Couleurs Primaires**
- `#EF9C1E` : Amber/Or pour les actions principales
- `#D88A1A` : Amber Dark pour les états hover
- `#FEF3C7` : Amber Light pour les backgrounds subtils
- `#14B8A6` : Teal pour les succès et statuts positifs
- `#0F766E` : Teal Dark
- `#99F6E4` : Teal Light

#### Couleurs Sémantiques

- **Success** : `#10B981` (Vert "Partant")
- **Error** : `#EF4444` (Rouge "Pas dispo")
- **Warning** : `#F59E0B` (Orange "Peut-être")
- **Info** : `#3B82F6`

#### Couleurs de Texte

- **Primary** : `#1F2937`
- **Secondary** : `#6B7280`
- **Tertiary** : `#9CA3AF`

#### Couleurs des Composants

- **Carte Background** : `#FFFFFF`
- **Bouton Background** : `#EF9C1E`
- **Bouton Texte** : White
- **Bouton Hover** : `#D88A1A`

### Typographie

**Famille de police** : Inter, system-ui, sans-serif

#### Titres

- **H1** : 28px / 700
- **H2** : 24px / 700
- **H3** : 20px / 600
- **H4** : 18px / 600

#### Corps

- **Body** : 16px / 400 (normal)
- **Body Bold** : 16px / 600
- **Small** : 14px / 400
- **Tiny** : 12px / 400

### Espacement

- **XS** : 4px
- **SM** : 8px
- **MD** : 16px
- **LG** : 24px
- **XL** : 32px
- **2XL** : 48px

### Cartes

- **Fond** : Blanc
- **Ombre** : 0 4px 12px rgba(0,0,0,0.08)
- **Border-radius** : 16px

---

## Structure du Projet

### Arborescence des Dossiers

```
/src
  /app
    /screens                    # 61 écrans de l'application
    /components                 # Composants réutilisables
    /contexts                   # Contextes React (state management)
      - AuthContext.tsx
      - SquadsContext.tsx
      - SessionsContext.tsx
      - NotificationsContext.tsx
      - MessagesContext.tsx
    /services                   # Services API
      - api.ts                  # Client API centralisé
      - auth.ts                 # Service authentification
      - upload.ts               # Upload d'images
    /hooks                      # Hooks personnalisés
    /styles
      - theme.css               # Design system Warm Premium v4.0
      - fonts.css               # Fonts importées
    /imports                    # Assets Figma (images, SVGs)
    /utils                      # Utilitaires
    /supabase
      - info.tsx                # Config Supabase

/supabase
  /functions
    /server
      - index.tsx               # API Hono (toutes les routes)
      - kv_store.tsx            # Utilitaires KV (protégé)
```

---

## Navigation Complète

### Total : 61 Écrans répartis en 8 sections

#### 1. Section Authentification (3 écrans)

1. **Splash Screen** (`/`)
   - Logo Squad Planner
   - Tagline "Organisez vos sessions"
   - Animation de chargement
   - Redirection automatique

2. **Login Screen** (`/login`)
   - Email et mot de passe
   - Bouton "Se connecter"
   - Lien "Mot de passe oublié ?"
   - Option "Connexion avec Google"

3. **Signup Screen** (`/signup`)
   - Email et nom d'utilisateur
   - Mot de passe et confirmation
   - Bouton "Créer mon compte"
   - Auto-login après inscription

#### 2. Section Principale (10 écrans)

4. **Accueil** (`/home`)
   - Header & notifications
   - Prochaines sessions
   - Bouton flottant "+"

5. **Liste Squads** (`/squads`)
   - Barre de recherche
   - Cartes squad détaillées
   - Boutons Créer/Rejoindre

6. **Détail Squad** (`/squads/:squadId`)
   - 5 onglets (Sessions, Chat, Membres, Stats, Paramètres)
   - Fonctionnalités complètes

7. **Créer Squad** (`/create-squad`)
   - Formulaire de détails
   - Nom, Jeu, Avatar
   - Paramètres (max membres, visibilité)

8. **Rejoindre Squad** (`/join-squad`)
   - Input code invitation
   - Option QR code
   - Confirmation d'ajout

9. **Liste Sessions** (`/sessions`)
   - Calendrier visuel
   - Filtres (À venir/Passées)
   - Liste avec détails RSVP

10. **Détail Session** (`/sessions/:sessionId`)
    - Infos complètes (Titre, Date, Heure)
    - Statut & Boutons RSVP
    - Liste des réponses membres

11. **Proposer Session** (`/squads/:squadId/propose-session`)
    - Formulaire (Titre, Date, Heure)
    - Durée & joueurs requis
    - Toggle session récurrente

12. **Profil Utilisateur** (`/profile` ou `/users/:userId`)
    - Avatar, Nom, Rôle, Bio
    - Badges & Stats principales
    - 4 onglets (Stats, Achievements, Badges, Historique)

13. **Éditer Profil** (`/profile/edit`)
    - Upload avatar, Nom, Bio
    - Fuseau horaire, Langue
    - Boutons Enregistrer/Annuler

#### 3. Section Notifications (5 écrans)

14. **Notifications List** (`/notifications`)
    - Header "Notifications"
    - Bouton "Tout marquer comme lu"
    - Filtres: Toutes, Non lues, Sessions, Squads, Achievements
    - Liste avec icône, titre, message, temps relatif
    - Badge compteur sur l'icône header

**Types de Notifications :**
- Session proposée
- Session confirmée
- Session annulée
- Nouveau membre
- Achievement débloqué
- Nouveau message
- Demande d'ami
- Rappel session (2h avant)

15-18. **Détails Notifications** (par type)
    - Redirection automatique selon le type

#### 4. Section Social (8 écrans)

19. **Liste d'amis** (`/friends`)
    - Amis actuels
    - Demandes reçues/envoyées
    - Statut en ligne, dernière activité

20. **Ajouter un ami** (`/friends/add`)
    - Champ de recherche par pseudo
    - Bouton "Envoyer une demande"

21. **Profil ami** (`/users/:userId`)
    - Vue simplifiée du profil
    - Actions limitées
    - Dernière activité

22. **Messages directs** (`/messages/:userId`)
    - Chat temps réel avec amis
    - Pseudo et statut de l'ami
    - Input message simple

23. **Recherche joueurs** (`/search`)
    - Filtres par pseudo, jeu, score
    - Boutons "Voir profil" ou "Ajouter"

24. **Demandes reçues** (`/friends/requests/received`)
    - Acceptation/Refus direct

25. **Demandes envoyées** (`/friends/requests/sent`)
    - Possibilité d'annuler une demande

26. **Amis suggérés** (`/friends/suggested`)
    - Basé sur squads communes
    - Facile à ajouter

#### 5. Section Gamification (12 écrans)

27. **Achievements** (`/achievements`)
    - Suivi global & filtres par catégorie
    - Progression, Récompenses XP

28. **Détail Achievement** (`/achievements/:id`)
    - Infos complètes sur l'objectif
    - Progression visuelle, Stats % joueurs

29. **Badges** (`/badges`)
    - Collection de badges débloqués/verrouillés
    - Cliquez pour détails d'obtention

30. **Défis** (`/challenges`)
    - Quotidien, Hebdomadaire, Mensuel, Événements
    - Progression, Récompenses, Temps restant

31. **Détail Défi** (`/challenges/:id`)
    - Objectif détaillé & progression actuelle
    - Conseils, Bouton "Réclamer"

32. **Classement** (`/leaderboard`)
    - Filtres par XP, Fiabilité, Niveau, Sessions
    - Podium (Top 3), Votre position

33. **Stats Perso** (`/stats/personal`)
    - Toutes vos statistiques détaillées
    - Records, Graphiques d'évolution

34. **Stats par Squad** (`/stats/squad/:id`)
    - Performance de votre équipe
    - Comparaison, Forces & Faiblesses

35. **Stats par Jeu** (`/stats/game/:id`)
    - Vos performances par titre
    - Meilleurs scores, Temps de jeu

36. **Graphiques Évolution** (`/stats/evolution`)
    - Visualisation de votre progrès
    - Tendance, Points clés

37. **Comparaison Amis** (`/stats/compare`)
    - Comparez vos stats avec vos amis
    - Défis amicaux, Rivalité saine

38. **Records Personnels** (`/stats/records`)
    - Vos meilleures performances historiques
    - Trackez vos exploits

#### 6. Section B2B/Compétition (10 écrans)

39. **Tournois** (`/tournaments`)
    - Voir tournois à venir/en cours
    - Créer un tournoi (Orga)

40. **Détail Tournoi** (`/tournaments/:tournamentId`)
    - Bracket, équipes, règlement
    - Inscrire/Désinscrire Squad

41. **Ligues** (`/leagues`)
    - Explorer divisions & classements
    - Bouton "Rejoindre une ligue"

42. **Détail Ligue** (`/leagues/:leagueId`)
    - Classement équipes, calendrier matchs
    - Infos Promotion/Relégation

43. **Saisons** (`/seasons`)
    - Objectifs & récompenses
    - Historique des saisons

44-48. **Écrans Organisation** (Mode B2B)
    - Tableau de bord, gestion équipes
    - Analytics, membres, paramètres

49. **Mes Équipes** (`/my-teams`)
    - Liste de toutes mes équipes
    - Créer/Gérer une équipe

50. **Profil Équipe** (`/team/:id`)
    - Infos, stats, membres
    - Matchs à venir/passés

51. **Invitations** (`/invitations`)
    - Gérer les invitations d'équipe
    - Accepter/Refuser

52. **Stats Compétition** (`/stats/competition`)
    - Stats par jeu et par mode
    - Graphiques de performance

#### 7. Section Paramètres (8 écrans)

53. **Paramètres Généraux** (`/settings`)
    - Compte & Confidentialité
    - Notifications & Intégrations

54. **Changer Mot de Passe** (`/settings/password`)
    - Mise à jour sécurisée
    - Confirmation requise

55. **Confidentialité** (`/settings/privacy`)
    - Visibilité du profil
    - Gestion des amis & stats

56. **Notifications** (`/settings/notifications`)
    - Préférences d'alertes
    - Fréquence & horaires

57. **Intégrations** (`/settings/integrations`)
    - Connectez vos services
    - Discord, Twitch, Steam...

58. **Aide & Support** (`/help`)
    - FAQ & Contact support
    - Guides d'utilisation

59. **Questions Fréquentes** (`/help/faq`)
    - Réponses rapides
    - Conseils pratiques

60. **Contacter le Support** (`/help/contact`)
    - Assistance personnalisée
    - Résolution de problèmes

#### 8. Section Analytics (5 écrans)

61. **Dashboard Analytics** (`/analytics`)
    - Vue d'ensemble (Premium)
    - Insights automatiques

**Plus 4 autres écrans analytics** :
- Squad Analytics
- Jeu Analytics
- Analytics Temporels
- Export Données

---

## Fonctionnalités Détaillées

### 1. Gestion des Squads

#### Créer une Squad

**Flux de création :**
1. Accéder au formulaire de création
2. Remplir les détails (nom, jeu, description, avatar)
3. Définir le nombre max de membres (2-100)
4. Choisir la visibilité (publique/privée)
5. Le système génère un code d'invitation unique (6 caractères, ex: "ABC123")
6. Le créateur devient automatiquement "owner" avec tous les privilèges

**Tables impactées :**
- `squads` : Données de la squad
- `squad_members` : Membres et rôles
- `users` : Stats utilisateur

#### Rejoindre une Squad

**Trois méthodes :**
1. Saisir un code d'invitation
2. Scanner un QR code (mobile)
3. Découvrir des squads publiques via recherche

**Vérifications automatiques :**
- Squad non complète
- Utilisateur pas déjà membre

#### Quitter & Supprimer une Squad

**Quitter :**
- Membre normal : Quitte immédiatement
- Owner : Doit transférer la propriété d'abord

**Supprimer (owner uniquement) :**
- Confirmation requise
- Squad soft-deleted
- Membres notifiés et redirigés

### 2. Système de Sessions

#### Proposer une Session

**Processus :**
1. Un membre propose une session
2. Remplit : titre, date, heure, durée, nombre de joueurs requis
3. Tous les membres reçoivent une notification instantanée
4. La session est créée avec statut "pending"

**Sessions Récurrentes (Rituels) :**
- Création de rituels hebdomadaires
- Génération automatique chaque semaine
- Ex: "Tous les mercredis 20h"
- Cron job quotidien vérifie et génère les sessions
- Gestion depuis les paramètres de la squad

#### Système RSVP

**Trois réponses possibles :**
- **"Partant"** (vert #10B981) : Engagement ferme
- **"Pas dispo"** (rouge #EF4444) : Indisponible
- **"Peut-être"** (orange #F59E0B) : Incertain

**Mise à jour temps réel :**
- Les réponses sont visibles instantanément
- Compteur "X/Y prêts" affiché
- Proposeur notifié des changements

#### Confirmation Automatique

Dès que le nombre requis de "Partant" est atteint :
- Session passe en statut "confirmée"
- Notification envoyée à tous les participants
- Rappel automatique 2h avant la session

#### Gestion Post-Session

**Après la session :**
- Mise à jour des stats : présences, absences
- Calcul du score de fiabilité
- Distribution XP aux participants
- Archivage dans l'historique

**Annulation :**
- Proposeur ou admin peut annuler
- Raison optionnelle
- Tous les participants notifiés

### 3. Score de Fiabilité

#### Calcul du Score

**Formule :**
```
reliability_score = (sessions_attended / total_sessions) × 100
```

**Poids des Réponses RSVP :**
- "Partant" + Présent réel : +1 session_attended ✅
- "Partant" + Absent réel : +1 total_absences (pénalité) ❌
- "Pas dispo" : Neutre (pas compté) ⚪
- "Peut-être" + Présent : +1 session_attended ✅
- "Peut-être" + Absent : Neutre ⚪

#### Impact Visuel

**Badges de fiabilité :**
- **≥90%** : Badge vert "Fiable" 🟢 (très recherché)
- **75-89%** : Badge orange "Correct" 🟠 (acceptable)
- **<70%** : Badge rouge "Peu fiable" 🔴 (à améliorer)

#### Bonus Fiabilité

- **100% sur 10 sessions** → Achievement "Mr. Fiable" + 100 XP + Badge 💎
- **100% sur 20 sessions** → Badge "Ultra Fiable" 💎
- **100% sur 50 sessions** → Badge "Légende" 👑

**Affichage :**
Le score est visible sur profil utilisateur, liste des membres, réponses RSVP, et leaderboards.

### 4. Chat en Temps Réel

#### Fonctionnalités

- Saisir et envoyer des messages instantanément
- Livraison en temps réel via Supabase Realtime
- Support de différents types : texte, image, fichier
- Messages système pour événements importants

#### Implémentation Technique

- **WebSocket** via Supabase Realtime
- Synchronisation instantanée
- Gestion des états de connexion

### 5. Notifications en Temps Réel

#### Types de Notifications

1. **Session proposée** : Nouvelle session créée
2. **Session confirmée** : Nombre requis atteint
3. **Session annulée** : Annulation par admin
4. **Nouveau membre** : Quelqu'un a rejoint votre squad
5. **Achievement débloqué** : Critères remplis
6. **Nouveau message** : Message dans une squad
7. **Demande d'ami** : Demande d'amitié reçue
8. **Rappel session** : 2h avant une session confirmée

#### Fonctionnalités

- Badge compteur 🔔 mis à jour en temps réel
- Son distinctif pour chaque nouvelle notification
- Filtres : Toutes, Non lues, Sessions, Squads, Achievements
- Bouton "Tout marquer comme lu"

---

## Système de Gamification

### 1. Système XP & Niveaux

#### Gagner de l'XP

**Actions positives :**
- **+50 XP** : Créer une squad
- **+30 XP** : Proposer une session
- **+20 XP** : Rejoindre une squad
- **+15 XP** : Participer à une session (+ bonus fiabilité)
- **+50 XP** : Être MVP d'une session
- **+10 XP** : Ajouter un ami
- **+5 XP** : Envoyer 10 messages

**Pénalités :**
- **-20 XP** : "Partant" puis absent
- **-10 XP** : Annulation tardive (<2h)

#### Progression par Niveaux

**Formule exponentielle :**
```
XP requis niveau N = 100 × N × (N-1) / 2
```

**Paliers clés :**
- **Niveau 2** : 100 XP
- **Niveau 4** : 500 XP
- **Niveau 10** : 5,000 XP
- **Niveau 50** : 100,000 XP
- **Niveau 100** : 1,000,000 XP (cap maximum)

### 2. Achievements

#### Catégories d'Achievements

**🏅 Fiabilité :**
- "Mr. Fiable" : 100% sur 10 sessions
- "Ultra Fiable" : 100% sur 20 sessions
- "Légende" : 100% sur 50 sessions
- "Série de 20" : 20 sessions consécutives

**🦋 Social :**
- "Papillon Social" : 10 amis
- "Populaire" : 25 amis
- "Bavard" : 1000 messages
- "Ambassadeur" : Inviter 10 personnes

**🎯 Performance :**
- "MVP x5" : Être MVP 5 fois
- "Polyvalent" : Jouer à 5 jeux différents
- "Champion" : Gagner un tournoi

**🌟 Milestones :**
- "Fondateur" : Créer sa première squad
- "Leader" : Owner de 3 squads
- "Marathonien" : 100 sessions jouées
- "Vétéran" : 365 jours actif

#### Tiers XP

- **Bronze** : 50 XP
- **Silver** : 100 XP
- **Gold** : 200 XP
- **Platinum** : 300 XP

### 3. Badges

**Types de Badges :**

**👑 Premium :**
- Membre actif
- Statut Pro

**👥 Sociaux :**
- 25+ amis
- 1000+ messages

**🏆 Performance :**
- MVP
- Hot Streak
- All-Star

**🎉 Spéciaux :**
- Événements (Halloween, Noël)

**Déblocage :**
- Automatique lors de critères remplis
- Notifications + toast animé
- Affichage sur profil et leaderboard

### 4. Challenges

#### Types de Challenges

**📅 Quotidien :**
- Joue, tchatte, invite des amis
- Récompenses : 10-50 XP

**🗓 Hebdomadaire :**
- Participe à plusieurs sessions
- Joue à différents jeux
- Récompenses : 100-200 XP

**🌟 Mensuel :**
- Objectifs de jeu et recrutement
- Récompenses : 500-1000 XP

**🎉 Événements :**
- Badges exclusifs lors de fêtes
- Récompenses spéciales

#### Progression

- Barre de progression visuelle
- Temps restant affiché
- Conseils pour compléter
- Bouton "Réclamer" quand terminé

### 5. Classements (Leaderboards)

**Filtres disponibles :**
- Par XP total
- Par Fiabilité
- Par Niveau
- Par Sessions jouées

**Affichage :**
- Podium (Top 3) avec animations
- Liste complète
- Votre position actuelle mise en évidence

---

## Intégrations

### Intégrations Externes

#### 🗣 Discord

- Synchronise statut en ligne
- Notifications des sessions
- Commandes bot pour gérer squad
- Sync des rôles Discord avec Squad Planner

#### 📆 Google Calendar

- Ajoute automatiquement les sessions confirmées
- Rappels synchronisés
- Gestion bidirectionnelle

#### 🎮 Riot Games

- Import rank LoL/Valorant
- Synchronisation des stats
- Affichage du rank sur le profil

#### 🕹 Steam & Epic Games

- Sync bibliothèques de jeux
- Temps de jeu affiché
- Statut en ligne

#### 🎥 Twitch

- Affiche ta chaîne sur ton profil
- Notifie ta squad quand tu streams
- Badge "Streamer"

---

## Flux Utilisateurs

### Flux 1 : Inscription → Première Session

1. 📱 Lancer l'app & s'inscrire
2. 📝 Créer un compte utilisateur
3. 🏠 Accéder à l'écran d'accueil
4. ➕ Créer sa première squad
5. 🤝 Inviter des amis avec un code
6. 🗓 Proposer une nouvelle session de jeu
7. ✅ Confirmer sa participation
8. 🎉 Attendre la confirmation de la session
9. 🎮 Jouer la session
10. 🏅 Gagner de l'XP & débloquer des succès

**Récompenses :**
- +50 XP : Créer squad
- +30 XP : Proposer session
- +15 XP : Participer
- +15 XP : Bonus fiabilité
- +50 XP : Achievement "Fondateur"
- **Total : +160 XP** (presque niveau 2)

### Flux 2 : Rejoindre une Squad Existante

1. ✉️ Recevoir un code d'invitation
2. 🔍 Ouvrir l'app et rechercher "Rejoindre"
3. 🔑 Saisir le code de la squad
4. 👥 Confirmer la prévisualisation de la squad
5. 🔔 Recevoir la notification de rejoins
6. 👀 Voir les sessions proposées
7. ✅ Confirmer sa participation
8. 💬 Rejoindre le chat de la squad
9. 🎮 Jouer la session
10. 🌟 Gagner de l'XP en participant

### Flux 3 : Organiser un Tournoi

1. 📊 Créer une organisation et passer au plan Pro
2. 🏆 Créer un tournoi (nom, jeu, date, etc.)
3. 📤 Partager le lien d'inscription aux équipes
4. 🎯 Le bracket est généré automatiquement
5. 📝 Saisir les scores des matchs
6. 👑 Le vainqueur obtient un badge "Champion"
7. 📊 Les stats du tournoi sont archivées

### Flux 4 : Système d'Amis

1. 👀 Voir un joueur actif et cliquer sur son profil
2. ➕ Envoyer une demande d'ami
3. 🔔 La demande est notifiée à l'autre joueur
4. 📬 L'autre joueur ouvre ses notifications
5. ✅ Il accepte la demande d'ami
6. 🤝 Les deux joueurs sont maintenant amis
7. 💬 Ils peuvent s'envoyer des messages directs
8. 🤝 Ils peuvent s'inviter dans leurs squads

### Flux 5 : Achievements & Gamification

1. 🎮 Jouer régulièrement pour accumuler de l'XP
2. 🏆 Débloquer un achievement (ex: "Mr. Fiable")
3. 🔔 Recevoir une notification et un toast animé
4. 👀 Voir le nouvel achievement et le badge
5. 📈 L'XP total augmente et le niveau monte
6. 🎉 Recevoir une notification de "level up"
7. 🏅 Voir les badges débloqués sur le profil
8. 🚀 Continuer à jouer pour atteindre le niveau max

---

## Schémas et Diagrammes Mentionnés

### Diagramme de Navigation (Page 5)

Le PDF montre un diagramme circulaire illustrant les **8 sections majeures** de l'application :

```
          ┌──────────────────┐
          │  Authentification │
          └──────────────────┘
                   │
      ┌────────────┼────────────┐
      │            │            │
┌─────▼─────┐ ┌───▼────┐ ┌────▼──────┐
│Gamification│ │Principal│ │Notifications│
└─────┬─────┘ └───┬────┘ └────┬──────┘
      │           │            │
      └────────────┼────────────┘
                   │
          ┌────────▼────────┐
          │      Social      │
          └──────────────────┘
```

### Diagramme du Flux de Session (Page 7)

```
┌─────────────┐    ┌──────────┐    ┌──────────────┐    ┌────────────┐
│ Proposition │ -> │   RSVP   │ -> │ Confirmation │ -> │ Complétion │
└─────────────┘    └──────────┘    └──────────────┘    └────────────┘
```

### Architecture en 3 Couches (Page 12)

```
┌─────────────────────────────────────────┐
│           FRONTEND                       │
│  React 18 + TypeScript                  │
│  Tailwind CSS v4.0                      │
│  React Router                           │
│  Lucide React                           │
└─────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────┐
│           BACKEND                        │
│  Supabase (DB, Auth, Storage, Realtime) │
│  PostgreSQL                             │
│  Hono Server (API)                      │
└─────────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────┐
│       BASE DE DONNÉES                    │
│  27 tables PostgreSQL                   │
│  Organisées en 4 groupes                │
└─────────────────────────────────────────┘
```

---

## Dépendances et Intégrations

### Dépendances Frontend

```json
{
  "dependencies": {
    "react": "^18.x",
    "typescript": "^5.x",
    "tailwindcss": "^4.0",
    "react-router-dom": "^6.x",
    "lucide-react": "^0.x",
    "@supabase/supabase-js": "^2.x"
  }
}
```

### Dépendances Backend

```json
{
  "dependencies": {
    "hono": "^3.x",
    "@supabase/supabase-js": "^2.x",
    "postgresql": "^15.x"
  }
}
```

### Intégrations Externes Complètes

1. **Discord** : Statut, notifications, commandes bot
2. **Google Calendar** : Sync bidirectionnel des sessions
3. **Riot Games API** : Stats LoL/Valorant
4. **Steam API** : Bibliothèque de jeux
5. **Epic Games** : Bibliothèque de jeux
6. **Twitch API** : Chaîne et statut stream

---

## Récapitulatif des Fonctionnalités

### Fonctionnalités Principales

✅ **Authentification & Squads**
- Inscription & Connexion sécurisée
- Création et gestion des Squads
- Invitations de membres et rôles
- Personnalisation des Squads (avatar/bannière)
- Codes d'invitation uniques

✅ **Sessions & Chat**
- Proposition et gestion des sessions
- RSVP (Présent, Absent, Incertain)
- Sessions récurrentes et historiques
- Chat en temps réel intégré
- Envoi de messages texte et images

✅ **Notifications & Profil**
- Notifications en temps réel
- Gestion (filtres, marquer lu)
- Rappels avant sessions
- Profil utilisateur détaillé
- Statistiques de performance et XP
- Personnalisation du profil (avatar)

✅ **Gamification & Compétition**
- Système d'XP et niveaux
- Achievements et Badges visuels
- Challenges (quotidiens/hebdo)
- Tournois et Ligues
- Classements et Prize pools
- Gestion des amis et DM

---

## Conclusion

**Squad Planner** est une application mobile complète et ambitieuse qui transforme l'expérience de planification de sessions de jeu pour les équipes de gamers.

### Points Forts

1. **Architecture robuste** : React 18 + Supabase + PostgreSQL
2. **Design cohérent** : Warm Premium v4.0 avec palette Amber/Teal
3. **61 écrans** : Navigation complète et intuitive
4. **Gamification complète** : XP, niveaux, achievements, badges, challenges
5. **Temps réel** : Chat et notifications instantanées
6. **Intégrations** : Discord, Steam, Twitch, Riot Games, etc.
7. **Mode B2B** : Tournois, ligues, organisations eSport

### Chiffres Clés

- **61 écrans** répartis en 8 sections
- **27 tables** PostgreSQL
- **4 types** d'achievements
- **100 niveaux** de progression
- **5 intégrations** externes majeures
- **2-100 joueurs** par squad

### Principe Fondamental

> "En 5 secondes je sais quand on joue, qui vient, et s'il manque des réponses."

**Squad Planner est prête à révolutionner l'organisation des sessions de jeu en équipe!** 🚀🎮

---

**Document créé le** : 2026-01-28
**Source** : Architecture et fonctionnalités.pdf
**Version** : 1.0
