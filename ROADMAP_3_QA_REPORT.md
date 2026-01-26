# 🧪 ROADMAP #3 - RAPPORT QA PROFESSIONNEL

**Date** : 25 Janvier 2026  
**QA Engineer** : AI Assistant  
**Status** : 🔄 **EN COURS DE TESTS**

---

## 🎯 MÉTHODOLOGIE QA

### Stratégie de Test

1. **Tests Unitaires Backend** : Chaque route API testée individuellement
2. **Tests Frontend** : Chaque écran testé avec données réelles
3. **Tests Intégration** : Backend ↔ Frontend E2E
4. **Tests Edge Cases** : Scénarios limites et erreurs
5. **Tests Performance** : Temps de réponse et chargement
6. **Tests UX** : Usabilité et cohérence visuelle

---

## ✅ TESTS BACKEND - ROUTES API

### Test 1: GET /squads/:id/smart-suggestions

**Objectif** : Vérifier que l'algorithme retourne top 3 créneaux pertinents

#### Scénario 1.1: Squad avec historique

**Données test** :
- Squad ID: `test-squad-123`
- 10 sessions passées confirmées :
  - 5 sessions Mardi 21h (100% participation)
  - 3 sessions Jeudi 20h (90% participation)
  - 2 sessions Samedi 18h (80% participation)

**Requête** :
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://${PROJECT_ID}.supabase.co/functions/v1/make-server-e884809f/squads/test-squad-123/smart-suggestions
```

**Résultat attendu** :
```json
{
  "suggestions": [
    {
      "id": "2-21",
      "dayName": "Mardi",
      "hour": 21,
      "time": "21:00",
      "confidence": 100,
      "sessionsCount": 5
    },
    {
      "id": "4-20",
      "dayName": "Jeudi",
      "hour": 20,
      "time": "20:00",
      "confidence": 90,
      "sessionsCount": 3
    },
    {
      "id": "6-18",
      "dayName": "Samedi",
      "hour": 18,
      "time": "18:00",
      "confidence": 80,
      "sessionsCount": 2
    }
  ]
}
```

**Status** : ⏳ À TESTER

---

#### Scénario 1.2: Squad sans historique

**Données test** :
- Squad ID: `new-squad-456`
- 0 sessions passées

**Résultat attendu** :
```json
{
  "suggestions": []
}
```

**Status** : ⏳ À TESTER

---

#### Scénario 1.3: Squad inexistante

**Données test** :
- Squad ID: `invalid-squad`

**Résultat attendu** :
```json
{
  "error": "Squad introuvable"
}
```
**HTTP Status** : 404

**Status** : ⏳ À TESTER

---

#### Scénario 1.4: Non-membre tente d'accéder

**Données test** :
- User A tente d'accéder aux suggestions de Squad B (dont il n'est pas membre)

**Résultat attendu** :
```json
{
  "error": "Non autorisé - Vous n'êtes pas membre de cette squad"
}
```
**HTTP Status** : 403

**Status** : ⏳ À TESTER

---

### Test 2: POST /squads/:id/recurring-session

**Objectif** : Créer session récurrente avec config stockée

#### Scénario 2.1: Création valide

**Payload** :
```json
{
  "dayOfWeek": 2,
  "time": "21:00",
  "duration": 120,
  "game": "Valorant",
  "title": "Session Valorant hebdo"
}
```

**Résultat attendu** :
1. Session créée pour prochain mardi
2. Config stockée dans `recurring:test-squad-123`
3. `session.isRecurring = true`

**Status** : ⏳ À TESTER

---

#### Scénario 2.2: dayOfWeek manquant

**Payload** :
```json
{
  "time": "21:00",
  "duration": 120
}
```

**Résultat attendu** :
```json
{
  "error": "dayOfWeek et time sont requis"
}
```
**HTTP Status** : 400

**Status** : ⏳ À TESTER

---

### Test 3: GET /users/:id/notifications

**Objectif** : Récupérer notifications triées

#### Scénario 3.1: Utilisateur avec notifications

**Données test** :
- 5 notifications créées manuellement dans KV
- 2 non lues, 3 lues

**Résultat attendu** :
```json
{
  "notifications": [
    { "id": "notif-5", "read": false, "createdAt": "2026-01-25T14:00:00Z" },
    { "id": "notif-4", "read": true, "createdAt": "2026-01-25T12:00:00Z" },
    { "id": "notif-3", "read": false, "createdAt": "2026-01-25T10:00:00Z" },
    { "id": "notif-2", "read": true, "createdAt": "2026-01-24T20:00:00Z" },
    { "id": "notif-1", "read": true, "createdAt": "2026-01-24T18:00:00Z" }
  ],
  "unreadCount": 2
}
```

**Status** : ⏳ À TESTER

---

#### Scénario 3.2: User A tente de lire notifs de User B

**Résultat attendu** :
```json
{
  "error": "Non autorisé"
}
```
**HTTP Status** : 403

**Status** : ⏳ À TESTER

---

### Test 4: POST /notifications/mark-read

**Objectif** : Marquer notification comme lue

#### Scénario 4.1: Mark as read valide

**Payload** :
```json
{
  "notificationId": "notif-123"
}
```

**Résultat attendu** :
1. `notification.read = true`
2. `notification.readAt` défini
3. Notification mise à jour dans KV

**Status** : ⏳ À TESTER

---

### Test 5: GET /squads/:id/availability-heatmap

**Objectif** : Générer heatmap 7×24

#### Scénario 5.1: Squad avec historique varié

**Données test** :
- 15 sessions passées sur différents jours/heures
- Taux de participation variables

**Résultat attendu** :
```json
{
  "heatmap": [
    [0, 0, ..., 0],  // Dimanche (24 valeurs)
    [0, 0, ..., 0],  // Lundi
    [0, 0, ..., 100, 85, 60, 0],  // Mardi (pic à 21h)
    // ... 4 autres jours
  ],
  "maxValue": 5,
  "sessionsCount": 15
}
```

**Validations** :
- [ ] Heatmap a 7 lignes (jours)
- [ ] Chaque ligne a 24 colonnes (heures)
- [ ] Valeurs entre 0-100
- [ ] MaxValue cohérent

**Status** : ⏳ À TESTER

---

### Test 6: GET /squads/:id/members-stats

**Objectif** : Charger stats de tous les membres en 1 requête

#### Scénario 6.1: Squad avec 5 membres

**Résultat attendu** :
```json
{
  "members": [
    {
      "userId": "user1",
      "name": "Alex",
      "reliabilityScore": 95,
      "totalSessions": 20
    },
    {
      "userId": "user2",
      "name": "Ben",
      "reliabilityScore": 88,
      "totalSessions": 15
    },
    // ... 3 autres membres
  ]
}
```

**Validations** :
- [ ] 5 membres retournés
- [ ] Chaque membre a userId, name, reliabilityScore, totalSessions
- [ ] Scores cohérents avec `GET /users/:id/stats`

**Status** : ⏳ À TESTER

---

## ✅ TESTS FRONTEND - ÉCRANS

### Test 7: SmartSuggestionsScreen

#### Scénario 7.1: Affichage normal

**Steps** :
1. Naviguer vers `smart-suggestions`
2. Vérifier loading state s'affiche
3. Attendre réponse API
4. Vérifier 3 suggestions affichées

**Validations UI** :
- [ ] Loading spinner visible initialement
- [ ] 3 cartes de suggestions affichées
- [ ] Badge #1 = Or, #2 = Argent, #3 = Bronze
- [ ] Score de confiance entre 0-100%
- [ ] Bouton "Créer cette session" présent
- [ ] Cliquer bouton → Redirection vers formulaire

**Status** : ⏳ À TESTER

---

#### Scénario 7.2: Empty state

**Steps** :
1. Utiliser squad sans historique
2. Vérifier message "Pas encore de suggestions"

**Validations** :
- [ ] Icône Sparkles affichée
- [ ] Message explicatif clair
- [ ] Pas d'erreur console

**Status** : ⏳ À TESTER

---

### Test 8: NotificationsScreen

#### Scénario 8.1: Liste de notifications

**Steps** :
1. Créer 5 notifications dans KV
2. Naviguer vers `notifications`
3. Vérifier liste affichée

**Validations** :
- [ ] 5 notifications affichées
- [ ] Ordre : Plus récentes en haut
- [ ] Non-lues ont background coloré
- [ ] Badge unread count correct
- [ ] Icônes différentes selon type

**Status** : ⏳ À TESTER

---

#### Scénario 8.2: Mark as read

**Steps** :
1. Cliquer "Marquer comme lue"
2. Vérifier UI mise à jour
3. Vérifier badge count -1

**Validations** :
- [ ] Background devient gris
- [ ] Badge count décrémente
- [ ] Bouton "Marquer comme lue" disparaît
- [ ] Pas d'erreur console

**Status** : ⏳ À TESTER

---

### Test 9: AvailabilityHeatmapScreen

#### Scénario 9.1: Heatmap normale

**Steps** :
1. Naviguer vers `availability-heatmap`
2. Vérifier grille affichée

**Validations** :
- [ ] Grille 7 lignes × 24 colonnes
- [ ] Jours affichés en header (Dim, Lun, ...)
- [ ] Heures affichées en colonne gauche (00h, 01h, ...)
- [ ] Couleurs cohérentes (vert = fréquent, gris = jamais)
- [ ] Légende affichée

**Status** : ⏳ À TESTER

---

#### Scénario 9.2: Click sur case

**Steps** :
1. Cliquer sur case verte (ex: Mardi 21h)
2. Vérifier redirection

**Validations** :
- [ ] Redirection vers `create-session`
- [ ] Formulaire pré-rempli avec Mardi + 21h
- [ ] Data passée dans navigation

**Status** : ⏳ À TESTER

---

### Test 10: SquadDetailScreen (Optimisé)

#### Scénario 10.1: Chargement stats membres

**Steps** :
1. Ouvrir SquadDetailScreen
2. Vérifier section Membres
3. Inspecter scores de fiabilité

**Validations** :
- [ ] Scores réels affichés (pas 100% pour tous)
- [ ] 1 seul appel API `getMembersStats()` (pas N appels)
- [ ] Network tab : Voir requête `/members-stats`
- [ ] Pas d'erreur console

**Status** : ⏳ À TESTER

---

## 🔥 TESTS EDGE CASES

### Edge Case 1: Smart Suggestions avec 1 seule session

**Scenario** : Squad a 1 seule session passée

**Résultat attendu** : Retourne 1 suggestion au lieu de 3

**Status** : ⏳ À TESTER

---

### Edge Case 2: Heatmap avec toutes les heures à 0

**Scenario** : Aucune session n'a eu bon taux de participation

**Résultat attendu** : Heatmap toute grise, pas de crash

**Status** : ⏳ À TESTER

---

### Edge Case 3: Recurring session avec dayOfWeek = 7

**Scenario** : Payload invalide `dayOfWeek: 7` (max = 6)

**Résultat attendu** : Erreur 400 "dayOfWeek invalide"

**Status** : ⏳ À TESTER

---

### Edge Case 4: Notification sans userId

**Scenario** : KV contient notification cassée sans userId

**Résultat attendu** : Route skip cette notification, pas de crash

**Status** : ⏳ À TESTER

---

## ⚡ TESTS PERFORMANCE

### Perf 1: Smart Suggestions API

**Métrique** : Temps de réponse < 500ms

**Test** :
- Squad avec 50 sessions
- Mesurer temps API

**Résultat** : ⏳ À MESURER

---

### Perf 2: Heatmap API

**Métrique** : Temps de réponse < 800ms

**Test** :
- Squad avec 100 sessions
- Mesurer temps API + calcul matrice

**Résultat** : ⏳ À MESURER

---

### Perf 3: Members Stats API

**Métrique** : Temps de réponse < 500ms

**Test** :
- Squad avec 10 membres
- Mesurer temps chargement stats

**Résultat** : ⏳ À MESURER

---

## 🎨 TESTS UX

### UX 1: Responsive Design

**Test** : Tester chaque écran sur mobile (375px) et desktop (1920px)

**Validations** :
- [ ] SmartSuggestionsScreen responsive
- [ ] NotificationsScreen responsive
- [ ] AvailabilityHeatmapScreen scroll horizontal si nécessaire

**Status** : ⏳ À TESTER

---

### UX 2: Loading States

**Test** : Vérifier que chaque écran a un loading state

**Validations** :
- [ ] Spinner visible pendant chargement
- [ ] Pas de "flash of empty content"
- [ ] Skeleton loaders si applicable

**Status** : ⏳ À TESTER

---

### UX 3: Error States

**Test** : Simuler erreur API (timeout, 500, etc.)

**Validations** :
- [ ] Message d'erreur affiché
- [ ] Pas de crash
- [ ] Possibilité de retry

**Status** : ⏳ À TESTER

---

## 🐛 BUGS TROUVÉS

### Bug #1: [À REMPLIR SI TROUVÉ]

**Sévérité** :  
**Description** :  
**Steps to reproduce** :  
**Expected** :  
**Actual** :  
**Fix** :  
**Status** :  

---

## 📊 RÉSULTATS GLOBAUX

### Backend Routes

| Route | Tests Passés | Tests Échoués | Coverage |
|-------|--------------|---------------|----------|
| Smart Suggestions | 0/4 | 0/4 | 0% |
| Recurring Session | 0/2 | 0/2 | 0% |
| Notifications | 0/2 | 0/2 | 0% |
| Mark Read | 0/1 | 0/1 | 0% |
| Heatmap | 0/1 | 0/1 | 0% |
| Members Stats | 0/1 | 0/1 | 0% |

**Total** : 0/11 tests passés

---

### Frontend Screens

| Écran | Tests Passés | Tests Échoués | Coverage |
|-------|--------------|---------------|----------|
| SmartSuggestionsScreen | 0/2 | 0/2 | 0% |
| NotificationsScreen | 0/2 | 0/2 | 0% |
| AvailabilityHeatmapScreen | 0/2 | 0/2 | 0% |
| SquadDetailScreen (opt) | 0/1 | 0/1 | 0% |

**Total** : 0/7 tests passés

---

### Edge Cases

**Total** : 0/4 tests passés

---

### Performance

**Total** : 0/3 tests passés

---

### UX

**Total** : 0/3 tests passés

---

## 🎯 STATUT FINAL

**Total Tests** : 0/28 passés  
**Coverage** : 0%  
**Bugs Trouvés** : 0  
**Bugs Critiques** : 0  

**Décision** : ⏳ **TESTS EN COURS - RAPPORT À COMPLÉTER APRÈS EXÉCUTION RÉELLE**

---

## 📝 NOTES QA

### Limitations Environnement

- Tests backend nécessitent un environnement Supabase déployé
- Tests frontend nécessitent données mockées ou backend live
- Tests E2E nécessitent authentification fonctionnelle

### Recommandations

1. **Setup environnement de test** : Base de données dédiée avec données mockées
2. **Automatisation** : Scripts Cypress pour tests E2E
3. **CI/CD** : GitHub Actions pour run tests automatiquement
4. **Monitoring** : Sentry pour capturer erreurs en production

---

**Date rapport** : 25 Janvier 2026  
**QA Lead** : AI Assistant  
**Status** : 📋 **FRAMEWORK DE TESTS PRÊT - EXÉCUTION REQUISE**

**Next** : Exécuter les tests réels et compléter ce rapport avec résultats
