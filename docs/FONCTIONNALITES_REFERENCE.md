# FONCTIONNALITES SQUAD PLANNER - REFERENCE COMPLETE

> **Source**: PDF "SECTION-AUTHENTIFICATION-3-ECRANS.pdf" (Presentation Gamma)
> **Date**: 31 Janvier 2026
> **Usage**: Document de reference pour tester TOUTES les fonctionnalites de l'app

---

## VUE D'ENSEMBLE

| Section | Nombre d'ecrans |
|---------|-----------------|
| Authentification | 3 |
| Principale | 10 |
| Notifications | 5 |
| Social | 8 |
| Gamification | 12 |
| B2B / Competition | 10 |
| Parametres | 8 |
| Analytics | 5 |
| **TOTAL** | **61 ecrans** |

---

## SECTION AUTHENTIFICATION (3 ECRANS)

### 1. Splash Screen
- **Chemin**: `/`
- **Elements**:
  - Logo Squad Planner
  - Tagline "Organisez vos sessions"
  - Animation de chargement
  - Redirection automatique

### 2. Login Screen
- **Chemin**: `/login`
- **Elements**:
  - Email et mot de passe
  - Bouton "Se connecter"
  - Lien "Mot de passe oublie ?"
  - Option "Connexion avec Google"

### 3. Signup Screen
- **Chemin**: `/signup`
- **Elements**:
  - Email et nom d'utilisateur
  - Mot de passe et confirmation
  - Bouton "Creer mon compte"
  - Auto-login apres inscription

---

## SECTION PRINCIPALE (10 ECRANS)

### 4. Accueil (Home)
- **Chemin**: `/home`
- **Elements**:
  - Header & notifications
  - Prochaines sessions
  - Bouton flottant "+"

### 5. Liste Squads
- **Chemin**: `/squads`
- **Elements**:
  - Barre de recherche
  - Cartes squad detaillees
  - Boutons Creer/Rejoindre

### 6. Detail Squad
- **Chemin**: `/squads/:squadId`
- **Elements**:
  - 5 onglets (Sessions, Chat...)
  - Fonctionnalites completes

### 7. Creer Squad
- **Chemin**: `/create-squad`
- **Elements**:
  - Formulaire de details
  - Nom, Jeu, Avatar
  - Parametres (max membres)

### 8. Rejoindre Squad
- **Chemin**: `/join-squad`
- **Elements**:
  - Input code invitation
  - Option QR code
  - Confirmation d'ajout

### 9. Liste Sessions
- **Chemin**: `/sessions`
- **Elements**:
  - Calendrier visuel
  - Filtres (A venir/Passees)
  - Liste avec details RSVP

### 10. Detail Session
- **Chemin**: `/sessions/:sessionId`
- **Elements**:
  - Infos completes (Titre, Date)
  - Statut & Boutons RSVP
  - Liste des reponses

### 11. Proposer Session
- **Chemin**: `/squads/:squadId/propose-session`
- **Elements**:
  - Formulaire (Titre, Date)
  - Duree & joueurs requis
  - Toggle recurrent

### 12. Profil Utilisateur
- **Chemin**: `/profile` ou `/users/:userId`
- **Elements**:
  - Avatar, Nom, Role, Bio
  - Badges & Stats principales
  - 4 onglets (Stats, Achiev.)

### 13. Editer Profil
- **Chemin**: `/profile/edit`
- **Elements**:
  - Upload avatar, Nom, Bio
  - Fuseau horaire, Langue
  - Boutons Enregistrer/Annuler

---

## SECTION NOTIFICATIONS (5 ECRANS)

### 14. Notifications List Screen
- **Chemin**: `/notifications`
- **Elements**:
  - Header "Notifications", Bouton "Tout marquer comme lu"
  - Filtres: Toutes, Non lues, Sessions, Squads, Achievements
  - Liste: Icone, Titre, Message, Temps relatif, Badge "Non lu"
  - Badge compteur sur l'icone notifications (header global)

### Types de Notifications:
| Type | Description |
|------|-------------|
| Session proposee | La creation d'une nouvelle session |
| Session confirmee | Quand la session atteint le nombre de joueurs requis |
| Session annulee | L'annulation d'une session par l'admin |
| Nouveau membre | Quelqu'un a rejoint votre squad |
| Achievement debloque | Criteres de succes remplis |
| Nouveau message | Un nouveau message dans une squad |
| Demande d'ami | Quelqu'un vous envoie une demande d'amitie |
| Rappel session | Un rappel 2h avant une session confirmee |

### Redirections automatiques:
- Session proposee -> `/sessions/:sessionId`
- Nouveau membre -> `/squads/:squadId`
- Achievement -> `/profile` (onglet Achievements)
- Message -> `/squads/:squadId` (onglet Chat)

---

## SECTION SOCIAL (8 ECRANS)

### 15. Liste d'amis
- **Chemin**: `/friends`
- **Elements**:
  - Amis, demandes (recues/envoyees)
  - Statut en ligne, derniere activite

### 16. Ajouter un ami
- **Chemin**: `/friends/add`
- **Elements**:
  - Champ de recherche
  - Bouton "Envoyer une demande"

### 17. Profil ami
- **Chemin**: `/users/:userId`
- **Elements**:
  - Vue simplifiee du profil
  - Actions limitees
  - Derniere activite

### 18. Messages directs
- **Chemin**: `/messages/:userId`
- **Elements**:
  - Chat en temps reel avec amis
  - Pseudo et statut de l'ami
  - Input message simple

### 19. Recherche joueurs
- **Chemin**: `/search`
- **Elements**:
  - Filtres par pseudo, jeu, score
  - Boutons "Voir profil" ou "Ajouter"

### 20. Demandes recues
- **Chemin**: `/friends/requests/received`
- **Elements**:
  - Acceptation/Refus direct

### 21. Demandes envoyees
- **Chemin**: `/friends/requests/sent`
- **Elements**:
  - Possibilite d'annuler une demande

### 22. Amis suggeres
- **Chemin**: `/friends/suggested`
- **Elements**:
  - Base sur squads communes
  - Facile a ajouter

---

## SECTION GAMIFICATION (12 ECRANS)

### 23. Achievements
- **Chemin**: `/achievements`
- **Elements**:
  - Suivi global & filtres par categorie
  - Progression, Recompenses XP

### 24. Detail Achievement
- **Chemin**: `/achievements/:id`
- **Elements**:
  - Infos completes sur l'objectif
  - Progression visuelle, Stats % joueurs

### 25. Badges
- **Chemin**: `/badges`
- **Elements**:
  - Collection de badges debloques/verrouilles
  - Cliquez pour details d'obtention

### 26. Defis
- **Chemin**: `/challenges`
- **Elements**:
  - Quotidien, Hebdomadaire, Mensuel, Evenements
  - Progression, Recompenses, Temps restant

### 27. Detail Defi
- **Chemin**: `/challenges/:id`
- **Elements**:
  - Objectif detaille & progression actuelle
  - Conseils, Bouton "Reclamer"

### 28. Classement
- **Chemin**: `/leaderboard`
- **Elements**:
  - Filtres par XP, Fiabilite, Niveau, Sessions
  - Podium (Top 3), Votre position

### 29. Stats Perso
- **Chemin**: `/stats/personal`
- **Elements**:
  - Toutes vos statistiques detaillees
  - Records, Graphiques d'evolution

### 30. Stats par Squad
- **Chemin**: `/stats/squad/:id`
- **Elements**:
  - Performance de votre equipe
  - Comparaison, Forces & Faiblesses

### 31. Stats par Jeu
- **Chemin**: `/stats/game/:id`
- **Elements**:
  - Vos performances par titre
  - Meilleurs scores, Temps de jeu

### 32. Graphiques Evolution
- **Chemin**: `/stats/evolution`
- **Elements**:
  - Visualisation de votre progres
  - Tendance, Points cles

### 33. Comparaison Amis
- **Chemin**: `/stats/compare`
- **Elements**:
  - Comparez vos stats avec vos amis
  - Defis amicaux, Rivalite saine

### 34. Records Personnels
- **Chemin**: `/stats/records`
- **Elements**:
  - Vos meilleures performances historiques
  - Trackez vos exploits

---

## SECTION B2B / COMPETITION (10 ECRANS)

### 35. Tournois
- **Chemin**: `/tournaments`
- **Elements**:
  - Voir tournois a venir/en cours
  - Creer un tournoi (Orga)

### 36. Detail Tournoi
- **Chemin**: `/tournaments/:tournamentId`
- **Elements**:
  - Bracket, equipes, reglement
  - Inscrire/Desinscrire Squad

### 37. Ligues
- **Chemin**: `/leagues`
- **Elements**:
  - Explorer divisions & classements
  - Bouton "Rejoindre une ligue"

### 38. Detail Ligue
- **Chemin**: `/leagues/:leagueId`
- **Elements**:
  - Classement equipes, calendrier matchs
  - Infos Promotion/Relegation

### 39. Saisons
- **Chemin**: `/seasons`
- **Elements**:
  - Objectifs & recompenses
  - Historique des saisons

### 40-44. Ecrans Organisation (Mode B2B)
- **Elements**:
  - Tableau de bord, gestion equipes
  - Analytics, membres, parametres

### 45. Mes Equipes
- **Chemin**: `/my-teams`
- **Elements**:
  - Liste de toutes mes equipes
  - Creer/Gerer une equipe

### 46. Profil Equipe
- **Chemin**: `/team/:id`
- **Elements**:
  - Infos, stats, membres
  - Matchs a venir/passes

### 47. Invitations
- **Chemin**: `/invitations`
- **Elements**:
  - Gerer les invitations d'equipe
  - Accepter/Refuser

### 48. Stats Competition
- **Chemin**: `/stats/competition`
- **Elements**:
  - Stats par jeu et par mode
  - Graphiques de performance

---

## SECTION PARAMETRES (8 ECRANS)

### 49. Parametres Generaux
- **Chemin**: `/settings`
- **Elements**:
  - Compte & Confidentialite
  - Notifications & Integrations

### 50. Changer Mot de Passe
- **Chemin**: `/settings/password`
- **Elements**:
  - Mise a jour securisee
  - Confirmation requise

### 51. Confidentialite
- **Chemin**: `/settings/privacy`
- **Elements**:
  - Visibilite du profil
  - Gestion des amis & stats

### 52. Notifications
- **Chemin**: `/settings/notifications`
- **Elements**:
  - Preferences d'alertes
  - Frequence & horaires

### 53. Integrations
- **Chemin**: `/settings/integrations`
- **Elements**:
  - Connectez vos services
  - Discord, Twitch, Steam...

### 54. Aide & Support
- **Chemin**: `/help`
- **Elements**:
  - FAQ & Contact support
  - Guides d'utilisation

### 55. Questions Frequentes
- **Chemin**: `/help/faq`
- **Elements**:
  - Reponses rapides
  - Conseils pratiques

### 56. Contacter le Support
- **Chemin**: `/help/contact`
- **Elements**:
  - Assistance personnalisee
  - Resolution de problemes

---

## SECTION ANALYTICS (5 ECRANS)

### 57. Dashboard Analytics
- **Chemin**: `/analytics`
- **Elements**:
  - Vue d'ensemble (Premium)
  - Insights automatiques

### 58. Squad Analytics
- **Chemin**: `/analytics/squad/:id`
- **Elements**:
  - Performance d'equipe

### 59. Jeu Analytics
- **Chemin**: `/analytics/game/:game`
- **Elements**:
  - Statistiques par jeu

### 60. Analytics Temporels
- **Chemin**: `/analytics/temporal`
- **Elements**:
  - Vue par semaine, mois, annee

### 61. Export Donnees
- **Chemin**: `/analytics/export`
- **Elements**:
  - Exportation CSV

---

## FONCTIONNALITES DETAILLEES

### Authentification

#### Inscription (Signup)
1. Arrivee sur /signup et remplissage des informations
2. Validation des donnees (email, username, password)
3. Appel de authService.signUp() pour creation du compte
4. Stockage du token de session dans localStorage
5. Redirection automatique vers /home apres connexion

#### Connexion (Login)
1. Arrivee sur /login et saisie email/password
2. Appel de authService.signIn() pour verification
3. Reception et stockage des tokens (access/refresh)
4. Recuperation des donnees utilisateur via /auth/me
5. Redirection vers /home avec session active

### Gestion des Squads

#### Creer une Squad
1. Acceder au formulaire de creation
2. Remplir les details et proprietes
3. Le systeme genere un code unique
4. Le createur est designe "owner"
5. Redirection vers la nouvelle squad

#### Rejoindre une Squad
1. Cliquer sur "Rejoindre une squad"
2. Saisir le code d'invitation
3. Verification des conditions d'entree
4. Rejoindre en tant que membre
5. Acces immediat a la squad

#### Quitter & Supprimer
1. Acceder aux parametres de la squad
2. "Quitter": transfert de propriete requis pour owner
3. "Supprimer": owner uniquement, via confirmation
4. La squad est soft-deleted
5. Membres notifies et rediriges

### Systeme de Sessions

#### Proposer une Session
1. Acceder a la fonction "Proposer une session"
2. Remplir les details (titre, date, heure, duree...)
3. Cliquer "Proposer" pour creer la session
4. Les membres de la squad recoivent une notification
5. La session est creee avec le statut "pending"

#### Repondre RSVP
1. Recevoir la notification de session proposee
2. Cliquer pour voir les details de la session
3. Choisir sa disponibilite: "Partant", "Pas dispo", "Peut-etre"
4. Votre statut est mis a jour en temps reel
5. Le proposeur est notifie en cas de changement

#### Annuler & Completer
1. Pour annuler: le proposeur clique "Annuler la session"
2. Confirmer l'annulation (raison optionnelle)
3. Les participants sont notifies de l'annulation
4. Pour completer: le systeme met a jour automatiquement
5. Les statistiques de presence sont ajustees

### Chat en Temps Reel & Notifications

#### Chat en Temps Reel
- Saisir et envoyer des messages instantanement
- Les messages sont livres en temps reel via Supabase
- Supporte differents types de messages (texte, image, fichier)
- Genere des messages systeme pour les evenements importants

#### Notifications en Temps Reel
- Recevez des alertes instantanees
- Badge compteur mis a jour en temps reel dans l'en-tete
- Joue un son distinctif pour chaque nouvelle notification
- Integration robuste avec Supabase Realtime via WebSocket

### Systeme de Fiabilite & XP

#### Systeme de Fiabilite
- Calcule sur la presence aux sessions
- Formule: (Sessions Presentes / Total) x 100
- RSVP "Partant" + Absent = Penalite
- Badges: >=90% (vert), 70-89% (orange), <70% (rouge)
- Bonus: 100% sur 10 sessions -> "Mr. Fiable" +100 XP
- Affichage sur: Profil, Squads, Leaderboards

#### Systeme XP & Niveaux
- Gagne de l'XP via actions (ex: creer squad, session)
- Ex: Creer Squad (+50 XP), Participer Session (+10 XP)
- Penalites: "Partant" + Absent (-20 XP), Annuler <2h (-10 XP)
- Niveaux de 1 (0 XP) a 100 (1M XP)
- Recompenses: Niveau 5 -> "Rookie", Niveau 100 -> "Grand Maitre"

### Achievements & Badges

#### Achievements
- Fiabilite: Series de presence, Mr. Fiable
- Social: Amis, messages, invitations
- Performance: MVP, jeux varies, tournois
- Milestones: Squads, sessions, anciennete
- Secrets: Bugs, Easter Eggs, gains inattendus
- Tiers XP: Bronze a Platinum (50-300 XP)

#### Badges
- Premium: Membre actif, statut Pro
- Sociaux: 25+ amis, 1000+ messages
- Performance: MVP, Hot Streak, All-Star
- Speciaux: Evenements (Halloween, Noel)
- Deblocage: Auto, notifs, profil, leaderboard

### Challenges & Integrations Externes

#### Challenges
- Quotidien: Joue, tchatte, et invite des amis
- Hebdomadaire: Participe a plus de sessions et jeux
- Mensuel: Atteins des objectifs de jeu et recrutement
- Evenements: Gagne des badges exclusifs lors de fetes

#### Integrations Externes
- Discord: Synchronise statut, notifications et commandes
- Google Calendar: Ajoute et gere tes sessions automatiquement
- Riot Games: Importe rank et stats pour LoL/Valorant
- Steam & Epic: Sync tes bibliotheques et temps de jeu
- Twitch: Affiche ta chaine et notifie ta squad

---

## FLUX UTILISATEUR COMPLETS

### Flux 1: Inscription -> Premiere Session
1. Lancer l'app & s'inscrire
2. Creer un compte utilisateur
3. Acceder a l'ecran d'accueil
4. Creer sa premiere squad
5. Inviter des amis avec un code
6. Proposer une nouvelle session de jeu
7. Confirmer sa participation
8. Attendre la confirmation de la session
9. Jouer la session
10. Gagner de l'XP & debloquer des succes

### Flux 2: Rejoindre une Squad Existante
1. Recevoir un code d'invitation
2. Ouvrir l'app et rechercher "Rejoindre"
3. Saisir le code de la squad
4. Confirmer la previsualisation de la squad
5. Recevoir la notification de rejoins
6. Voir les sessions proposees
7. Confirmer sa participation
8. Rejoindre le chat de la squad
9. Jouer la session
10. Gagner de l'XP en participant

### Flux 3: Organiser un Tournoi
1. Creer une organisation et passer au plan Pro
2. Creer un tournoi (nom, jeu, date, etc.)
3. Partager le lien d'inscription aux equipes
4. Le bracket est genere automatiquement
5. Saisir les scores des matchs
6. Le vainqueur obtient un badge "Champion"
7. Les stats du tournoi sont archivees

### Flux 4: Systeme d'Amis
1. Voir un joueur actif et cliquer sur son profil
2. Envoyer une demande d'ami
3. La demande est notifiee a l'autre joueur
4. L'autre joueur ouvre ses notifications
5. Il accepte la demande d'ami
6. Les deux joueurs sont maintenant amis
7. Ils peuvent s'envoyer des messages directs
8. Ils peuvent s'inviter dans leurs squads

### Flux 5: Achievements & Gamification
1. Jouer regulierement pour accumuler de l'XP
2. Debloquer un achievement (ex: "Mr. Fiable")
3. Recevoir une notification et un toast anime
4. Voir le nouvel achievement et le badge
5. L'XP total augmente et le niveau monte
6. Recevoir une notification de "level up"
7. Voir les badges debloques sur le profil
8. Continuer a jouer pour atteindre le niveau max

---

## ARBORESCENCE COMPLETE DES ROUTES

```
/ (Splash)
├── /login
├── /signup
└── [Protected Routes]
    ├── /home
    ├── /squads
    │   ├── /squads (liste)
    │   ├── /squads/:id (detail)
    │   ├── /create-squad
    │   ├── /join-squad
    │   └── /squads/:id/propose-session
    ├── /sessions
    │   ├── /sessions (liste/calendrier)
    │   └── /sessions/:id (detail)
    ├── /profile
    │   ├── /profile (propre profil)
    │   ├── /profile/edit
    │   └── /users/:id (autre utilisateur)
    ├── /notifications
    ├── /friends
    │   ├── /friends (liste)
    │   ├── /friends/add
    │   ├── /friends/requests
    │   └── /messages/:userId (DM)
    ├── /achievements
    │   ├── /achievements (liste)
    │   └── /achievements/:id (detail)
    ├── /badges
    ├── /challenges
    │   ├── /challenges (liste)
    │   └── /challenges/:id (detail)
    ├── /leaderboard
    ├── /tournaments
    │   ├── /tournaments (liste)
    │   ├── /tournaments/:id (detail)
    │   └── /tournaments/create
    ├── /leagues
    │   ├── /leagues (liste)
    │   └── /leagues/:id (detail)
    ├── /seasons
    ├── /analytics
    │   ├── /analytics (dashboard)
    │   ├── /analytics/squad/:id
    │   ├── /analytics/game/:game
    │   └── /analytics/export
    ├── /organizations
    │   ├── /organizations (liste)
    │   ├── /organizations/:id (dashboard)
    │   ├── /organizations/create
    │   └── /organizations/:id/settings
    ├── /settings
    │   ├── /settings (general)
    │   ├── /settings/account
    │   ├── /settings/password
    │   ├── /settings/notifications
    │   ├── /settings/privacy
    │   ├── /settings/integrations
    │   ├── /settings/premium
    │   └── /settings/support
    └── /search
```

---

## FONCTIONNALITES CLES DE L'APPLICATION

### Authentification & Squads
- Inscription & Connexion securisee
- Creation et gestion des Squads
- Invitations de membres et roles
- Personnalisation des Squads (avatar/banniere)
- Codes d'invitation uniques

### Sessions & Chat
- Proposition et gestion des sessions
- RSVP (Present, Absent, Incertain)
- Sessions recurrentes et historiques
- Chat en temps reel integre
- Envoi de messages texte et images

### Notifications & Profil
- Notifications en temps reel
- Gestion (filtres, marquer lu)
- Rappels avant sessions
- Profil utilisateur detaille
- Statistiques de performance et XP
- Personnalisation du profil (avatar)

### Gamification & Competition
- Systeme d'XP et niveaux
- Achievements et Badges visuels
- Challenges (quotidiens/hebdo)
- Tournois et Ligues
- Classements et Prize pools
- Gestion des amis et DM

---

## PRINCIPE FONDAMENTAL

> "En 5 secondes je sais quand on joue, qui vient, et s'il manque des reponses."

Squad Planner est prete a transformer l'experience des squads de gamers!

---

_Document genere le 31 Janvier 2026 - Reference complete pour les tests fonctionnels_
