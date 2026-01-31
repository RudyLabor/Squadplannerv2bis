# BUGS REPORT - Squad Planner

> **Date**: 31 Janvier 2026 - Session 7
> **Méthode**: Analyse statique du code + Build test

---

## Résumé

| Catégorie       | Nombre        |
| --------------- | ------------- |
| Bugs critiques  | 0             |
| Bugs majeurs    | 1             |
| Issues mineures | 12            |
| Build status    | ✅ OK (6.36s) |

---

## 🔴 BUG MAJEUR

### BUG-001: Données mockées au lieu d'appels API

**Sévérité**: Majeur  
**Impact**: Les données affichées sont statiques et ne reflètent pas les vraies données utilisateur

**Écrans affectés** (12):

| Écran                  | Fichier                         | Données mockées                            |
| ---------------------- | ------------------------------- | ------------------------------------------ |
| FriendsScreen          | `FriendsScreen.tsx:57`          | friends[], pendingInvites[], suggestions[] |
| SearchPlayersScreen    | `SearchPlayersScreen.tsx:251`   | mockPlayers[]                              |
| LeaderboardScreen      | `LeaderboardScreen.tsx:55`      | mockLeaderboardData[]                      |
| TournamentsScreen      | `TournamentsScreen.tsx:54`      | tournaments[]                              |
| DiscoverSquadsScreen   | `DiscoverSquadsScreen.tsx:59`   | mockSquads[]                               |
| ChallengesScreen       | `ChallengesScreen.tsx:172-208`  | weeklyChallenges[], monthlyChallenges[]    |
| AchievementsScreen     | `AchievementsScreen.tsx:79`     | achievements[]                             |
| ActivityFeedScreen     | `ActivityFeedScreen.tsx:42`     | activities[]                               |
| RecurringSessionScreen | `RecurringSessionScreen.tsx:55` | recurringSessions[]                        |
| RankingScreen          | `RankingScreen.tsx:54`          | ranks[]                                    |
| IntegrationsScreen     | `IntegrationsScreen.tsx:254`    | allIntegrations[]                          |
| ShareScreen            | `ShareScreen.tsx:72`            | shareOptions[]                             |

**Correction recommandée**:

- Remplacer les données mockées par des appels API Supabase
- Utiliser useEffect + useState pour charger les données
- Ajouter des états de chargement (loading)
- Gérer les erreurs avec try/catch

---

## 🟡 ISSUES MINEURES

### ISSUE-001: Pas de console.log/error dans les écrans ✅

Les écrans n'ont pas de logs de debug oubliés.

### ISSUE-002: Pas de TODO/FIXME dans le code ✅

Le code est propre et sans annotations de dette technique.

### ISSUE-003: Accents manquants dans les textes

- `NotificationsScreen.tsx:200` - "marquee" devrait être "marquée"
- `NotificationsScreen.tsx:206` - "marquees" devrait être "marquées"
- `NotificationsScreen.tsx:349` - "Gerer" devrait être "Gérer"
- `FriendsScreen.tsx:274` - "commencer a" devrait être "commencer à"

---

## ✅ POINTS POSITIFS

- Build réussi sans erreurs TypeScript
- Design system Linear appliqué uniformément
- Animations Framer Motion cohérentes
- Structure de code propre et maintenable
- Gestion des états loading dans les écrans avec API

---

## Prochaines Actions

1. [ ] Décider si on connecte les écrans mockés à l'API maintenant
2. [ ] Corriger les accents manquants (mineur)
3. [ ] Tester manuellement sur squadplanner.fr

---

_Rapport généré le 31 Janvier 2026_
