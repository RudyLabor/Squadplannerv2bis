# 🔍 AUDIT ROADMAP #2 - SOCIAL + COMPÉTITION

Date : 24 janvier 2026  
Status : **ANALYSE INITIALE**

---

## 📊 DÉFINITION ROADMAP #2

Basé sur la vision produit et le Master Plan, la ROADMAP #2 "Social + Compétition" devrait inclure :

### PILIER 1 : SOCIAL FEATURES

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| **Friends System** | Gérer une liste d'amis/contacts | P0 |
| **Activity Feed** | Flux d'activités des squads/amis | P0 |
| **Public Profiles** | Profils joueurs publics consultables | P1 |
| **Social Sharing** | Partage résultats/achievements | P1 |
| **Player Search** | Rechercher des joueurs par pseudo | P2 |
| **Squad Discovery** | Découvrir des squads publiques | P2 |

### PILIER 2 : COMPÉTITION FEATURES

| Fonctionnalité | Description | Priorité |
|----------------|-------------|----------|
| **Leaderboards** | Classements globaux et par jeu | P0 |
| **Achievements** | Système de trophées/succès | P0 |
| **Badges** | Badges de performance débloquables | P1 |
| **Tournaments** | Tournois entre squads | P1 |
| **Challenges** | Défis hebdomadaires/mensuels | P2 |
| **Ranking System** | ELO/MMR pour classement compétitif | P2 |

---

## 🎯 AUDIT PAR FONCTIONNALITÉ

### PILIER 1 : SOCIAL (0/6) ❌

#### 1. Friends System ❌
- **Écran** : `FriendsScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'friends'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Profile → "Mes amis" → ❌ **N'EXISTE PAS**
- **Chemin** : Profil → Mes amis
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Liste d'amis
- Invitations envoyées/reçues
- Statut en ligne
- Squads communes
- Bouton "Inviter dans une squad"

---

#### 2. Activity Feed ❌
- **Écran** : `ActivityFeedScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'activity'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Bottom Nav → "Activité" → ❌ **N'EXISTE PAS**
- **Chemin** : Bottom Nav → Activité
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Feed des sessions créées
- Feed des RSVP
- Achievements débloqués (amis)
- Nouvelles squads rejointes
- Filtres par type d'activité

---

#### 3. Public Profiles ❌
- **Écran** : `PublicProfileScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'public-profile'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Click sur avatar → Voir profil → ❌ **N'EXISTE PAS**
- **Chemin** : Squad → Click membre → Profil public
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Stats publiques
- Squads publiques
- Achievements visibles
- Score de fiabilité
- Bouton "Ajouter en ami"
- Bouton "Inviter dans squad"

---

#### 4. Social Sharing ❌
- **Écran** : `ShareScreen.tsx` ou Modal → ❌ **N'EXISTE PAS**
- **Route** : Modal ou écran dédié → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Share button sur achievements → ❌ **N'EXISTE PAS**
- **Chemin** : Achievements → Share
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Partage vers Discord
- Partage vers Twitter/X
- Partage vers WhatsApp
- Copy link
- Image preview

---

#### 5. Player Search ❌
- **Écran** : `SearchPlayersScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'search-players'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Command Palette → Search players → ❌ **PARTIELLEMENT**
- **Chemin** : Cmd+K → Search
- **Status** : 🟡 **PARTIELLEMENT** (Command Palette existe mais pas de search players)

**Ce qui devrait exister :**
- Search bar
- Filtres (jeu, niveau, région)
- Résultats avec preview profil
- Bouton "Voir profil"
- Bouton "Ajouter en ami"

---

#### 6. Squad Discovery ❌
- **Écran** : `DiscoverSquadsScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'discover'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Home → "Découvrir" → ❌ **N'EXISTE PAS**
- **Chemin** : Home → Découvrir
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Liste squads publiques
- Filtres (jeu, région, niveau)
- Nombre de membres
- Taux d'activité
- Bouton "Demander à rejoindre"

---

### PILIER 2 : COMPÉTITION (0/6) ❌

#### 1. Leaderboards ❌
- **Écran** : `LeaderboardScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'leaderboard'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Home → Card "Classements" → ❌ **N'EXISTE PAS**
- **Chemin** : Home → Classements
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Classement global (score fiabilité)
- Classement par jeu
- Classement squads
- Top 100 / Top 1000
- Position personnelle
- Filtres période (semaine, mois, all-time)

---

#### 2. Achievements ❌
- **Écran** : `AchievementsScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'achievements'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Profile → "Trophées" → ❌ **N'EXISTE PAS**
- **Chemin** : Profil → Trophées
- **Status** : 🟡 **PARTIELLEMENT** (Badges existent dans ReliabilityProfile mais pas d'écran dédié)

**Ce qui devrait exister :**
- Grille d'achievements
- Progression par achievement
- Achievements débloqués/verrouillés
- Détails (comment débloquer)
- Partage social
- Rareté (commun, rare, légendaire)

**Note :** Des badges existent dans :
- `ReliabilityBadge.tsx` ✅
- `ReliabilityProfile.tsx` ✅

Mais PAS d'écran dédié pour naviguer tous les achievements.

---

#### 3. Badges System ❌
- **Écran** : `BadgesScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'badges'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Profile → "Badges" → ❌ **N'EXISTE PAS**
- **Chemin** : Profil → Badges
- **Status** : 🟡 **PARTIELLEMENT** (Badge component existe)

**Ce qui devrait exister :**
- Collection complète de badges
- Badges équipés (affichés sur profil)
- Badges à débloquer
- Progression par badge
- Badge showcase (top 3)

---

#### 4. Tournaments ❌
- **Écran** : `TournamentsScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'tournaments'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Home → "Tournois" → ❌ **N'EXISTE PAS**
- **Chemin** : Home → Tournois
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Liste tournois actifs
- Inscription squad
- Bracket/arbre du tournoi
- Règles
- Récompenses
- Historique résultats

---

#### 5. Challenges ❌
- **Écran** : `ChallengesScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'challenges'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Home → Card "Défis" → ❌ **N'EXISTE PAS**
- **Chemin** : Home → Défis
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Challenges hebdomadaires
- Challenges mensuels
- Progression en temps réel
- Récompenses
- Leaderboard par challenge

---

#### 6. Ranking System ❌
- **Écran** : `RankingScreen.tsx` → ❌ **N'EXISTE PAS**
- **Route** : `'ranking'` → ❌ **N'EXISTE PAS**
- **Bouton d'accès** : Profile → "Mon rang" → ❌ **N'EXISTE PAS**
- **Chemin** : Profil → Mon rang
- **Status** : 🔴 **NON IMPLÉMENTÉ**

**Ce qui devrait exister :**
- Rang actuel (Bronze, Silver, Gold, etc.)
- Points ELO/MMR
- Progression vers prochain rang
- Historique des rangs
- Récompenses par rang

---

## 📊 RÉSUMÉ EXÉCUTIF

| Catégorie | Total | Implémenté | Partiellement | Manquant | Score |
|-----------|-------|------------|---------------|----------|-------|
| **SOCIAL** | 6 | 0 | 1 | 5 | **0%** ❌ |
| **COMPÉTITION** | 6 | 0 | 2 | 4 | **0%** ❌ |
| **TOTAL ROADMAP #2** | **12** | **0** | **3** | **9** | **0%** ❌ |

---

## 🎯 CE QUI EXISTE DÉJÀ (Composants réutilisables)

### Composants UI existants :
- ✅ `ReliabilityBadge.tsx` - Badges de fiabilité
- ✅ `ReliabilityProfile.tsx` - Profil avec badges
- ✅ `Badge.tsx` - Component badge générique
- ✅ `PulseBadge.tsx` - Badge animé
- ✅ `Celebration.tsx` - Animations achievements
- ✅ `AvatarStack.tsx` - Pour afficher groupes

### Icons Trophy/Award :
- ✅ Trophy icon utilisé dans plusieurs écrans
- ✅ Award icon existe
- ✅ Crown icon pour premium

### Data/Logic :
- ✅ Score de fiabilité calculé (ProfileScreen)
- ✅ Historique sessions (SquadDetailScreen)
- ✅ Stats joueur (AdvancedStatsScreen)

---

## 🔧 ÉCRANS À CRÉER (ROADMAP #2)

### PRIORITÉ P0 (Core Social + Compétition) :

1. **FriendsScreen.tsx** 
   - Liste amis
   - Invitations
   - Bouton depuis ProfileScreen

2. **ActivityFeedScreen.tsx**
   - Feed activités
   - Bottom Nav (nouveau tab)

3. **LeaderboardScreen.tsx**
   - Classements
   - Card depuis HomeScreen

4. **AchievementsScreen.tsx**
   - Grille achievements
   - Bouton depuis ProfileScreen

### PRIORITÉ P1 (Social avancé + Compétition) :

5. **PublicProfileScreen.tsx**
   - Profil public consultable
   - Navigation depuis avatars

6. **BadgesScreen.tsx**
   - Collection badges
   - Bouton depuis ProfileScreen

7. **TournamentsScreen.tsx**
   - Liste tournois
   - Card depuis HomeScreen

### PRIORITÉ P2 (Nice to have) :

8. **SearchPlayersScreen.tsx**
   - Recherche joueurs
   - Command Palette integration

9. **DiscoverSquadsScreen.tsx**
   - Découverte squads
   - Card depuis HomeScreen

10. **ChallengesScreen.tsx**
    - Défis hebdo/mensuels
    - Card depuis HomeScreen

11. **RankingScreen.tsx**
    - Système de rangs
    - Bouton depuis ProfileScreen

12. **ShareModal.tsx** (ou screen)
    - Partage social
    - Modal depuis achievements

---

## 🎯 MODIFICATIONS NÉCESSAIRES

### App.tsx :
- Ajouter 12 nouveaux imports lazy
- Ajouter 12 nouvelles routes
- Modifier Bottom Nav (ajouter "Activité" ?)

### ProfileScreen.tsx :
- Ajouter bouton "Mes amis"
- Ajouter bouton "Trophées"
- Ajouter bouton "Badges"
- Ajouter bouton "Mon rang"

### HomeScreen.tsx :
- Ajouter Card "Classements"
- Ajouter Card "Tournois"
- Ajouter Card "Défis"
- Ajouter Card "Découvrir"

### BottomNav.tsx (optionnel) :
- Ajouter tab "Activité" (entre Sessions et Profil ?)

---

## ✅ CHECKLIST DE CRÉATION

Pour chaque écran à créer :

1. [ ] Créer fichier `/src/app/screens/XxxScreen.tsx`
2. [ ] Ajouter import lazy dans `App.tsx`
3. [ ] Ajouter route dans le motion.div
4. [ ] Créer bouton d'accès dans écran parent
5. [ ] Tester navigation complète
6. [ ] Documenter dans audit

---

## 🚀 PROCHAINES ÉTAPES

### Option 1 : Créer TOUS les écrans (12 écrans)
Temps estimé : 2-3 heures
Résultat : ROADMAP #2 à 100%

### Option 2 : Créer seulement P0 (4 écrans)
Temps estimé : 45 minutes
Résultat : ROADMAP #2 à 33% (MVP Social + Compétition)

### Option 3 : Créer P0 + P1 (7 écrans)
Temps estimé : 1h30
Résultat : ROADMAP #2 à 58% (Complet sans nice-to-have)

---

**Quelle option choisir ?**

Attente de confirmation pour créer les écrans manquants.

---

Date : 24 janvier 2026  
Status : **AUDIT TERMINÉ - EN ATTENTE DE CRÉATION**
