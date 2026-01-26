# 🧪 ROADMAP #2 - SCÉNARIOS DE TEST

## Test End-to-End : Check-in & Scores

### Scénario 1 : Check-in Présent (Score +)
**Objectif** : Vérifier que le check-in "présent" augmente le score de fiabilité

#### Étapes :
1. ✅ Créer un compte avec email `test@squad.app`
2. ✅ Rejoindre ou créer une squad
3. ✅ Créer une session (Proposer un créneau)
4. ✅ RSVP "Je suis partant" sur la session
5. ✅ Aller sur CheckInScreen via la session
6. ✅ Cliquer sur "Je suis là"
7. ✅ Vérifier que le toast affiche "+1 fiabilité"
8. ✅ Aller sur ProfileScreen
9. ✅ Vérifier que le score de fiabilité est mis à jour

#### Résultat attendu :
- ✅ Check-in enregistré avec status "present"
- ✅ `totalSessions` incrémenté de 1
- ✅ `attendedSessions` incrémenté de 1
- ✅ `reliabilityScore` = `(attendedSessions / totalSessions) * 100`

---

### Scénario 2 : Check-in En Retard (Score ~)
**Objectif** : Vérifier que le retard compte partiellement (0.8x)

#### Étapes :
1. ✅ Suivre étapes 1-4 du Scénario 1
2. ✅ Aller sur CheckInScreen
3. ✅ Remplir le champ "Minutes de retard" : 15
4. ✅ Cliquer sur "Confirmer" le retard
5. ✅ Vérifier le calcul du score

#### Résultat attendu :
- ✅ Check-in avec status "late"
- ✅ `totalSessions` +1
- ✅ `attendedSessions` +0.8 (pénalité retard)
- ✅ Score légèrement réduit

---

### Scénario 3 : Check-in Absent (Score -)
**Objectif** : Vérifier que l'absence réduit fortement le score

#### Étapes :
1. ✅ Suivre étapes 1-4 du Scénario 1
2. ✅ Aller sur CheckInScreen
3. ✅ Cliquer sur "Je ne viens pas"
4. ✅ Vérifier le toast d'avertissement "score impacté"
5. ✅ Vérifier ProfileScreen

#### Résultat attendu :
- ✅ Check-in avec status "absent"
- ✅ `totalSessions` +1
- ✅ `attendedSessions` +0 (pas d'incrémentation)
- ✅ Score de fiabilité réduit

---

### Scénario 4 : Déblocage de Badges
**Objectif** : Vérifier que les badges se débloquent automatiquement

#### Badge "Fiable" (Score ≥ 95%) :
1. ✅ Faire 20 check-ins "présent"
2. ✅ Vérifier score ≥ 95%
3. ✅ Aller sur BadgesScreen
4. ✅ Vérifier que le badge "Fiable" 🏆 est débloqué

#### Badge "Régulier" (10+ sessions, 90%+ présence) :
1. ✅ Faire 10 sessions avec 9+ présents
2. ✅ Aller sur BadgesScreen
3. ✅ Vérifier badge "Régulier" ⭐ débloqué

#### Badge "Présence Parfaite" (0% no-show sur 5+ sessions) :
1. ✅ Faire 5 sessions 100% présent
2. ✅ Vérifier badge "Présence Parfaite" 💎

#### Badge "Joueur Actif" (20+ sessions) :
1. ✅ Participer à 20 sessions
2. ✅ Vérifier badge "Joueur Actif" 🎮

#### Badge "Leader de Squad" (95% + 30+ sessions) :
1. ✅ Faire 30 sessions avec 95%+ présence
2. ✅ Vérifier badge "Leader" 👑

---

### Scénario 5 : Leaderboard
**Objectif** : Vérifier le classement par score de fiabilité

#### Étapes :
1. ✅ Créer 3 comptes utilisateurs
2. ✅ User A : 10 sessions, 10 présents → 100%
3. ✅ User B : 10 sessions, 9 présents → 90%
4. ✅ User C : 10 sessions, 8 présents → 80%
5. ✅ Aller sur LeaderboardScreen avec User A
6. ✅ Vérifier l'ordre :
   - Rank 1 : User A (100%)
   - Rank 2 : User B (90%)
   - Rank 3 : User C (80%)

#### Résultat attendu :
- ✅ Classement correct par score
- ✅ Avatars et noms affichés
- ✅ "Toi" marqué pour l'utilisateur actuel

---

## 🔧 Tests API Backend

### Test 1 : POST /sessions/:sessionId/check-in

```bash
curl -X POST \
  https://<project-id>.supabase.co/functions/v1/make-server-e884809f/sessions/session-123/check-in \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "present",
    "note": ""
  }'
```

**Réponse attendue** :
```json
{
  "checkIn": {
    "userId": "user-123",
    "userName": "Alex",
    "status": "present",
    "note": "",
    "timestamp": "2026-01-25T12:00:00Z"
  },
  "message": "Check-in enregistré : present"
}
```

---

### Test 2 : GET /users/:userId/stats

```bash
curl -X GET \
  https://<project-id>.supabase.co/functions/v1/make-server-e884809f/users/user-123/stats \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Réponse attendue** :
```json
{
  "stats": {
    "userId": "user-123",
    "totalSessions": 20,
    "attendedSessions": 19,
    "reliabilityScore": 95,
    "attendanceRate": 95,
    "noShowCount": 1,
    "noShowRate": 5,
    "badges": [
      {
        "id": "reliable",
        "name": "Fiable",
        "description": "Score de fiabilité ≥ 95%",
        "icon": "🏆",
        "rarity": "legendary",
        "unlockedAt": "2026-01-25T12:00:00Z"
      }
    ]
  }
}
```

---

### Test 3 : GET /leaderboard

```bash
curl -X GET \
  https://<project-id>.supabase.co/functions/v1/make-server-e884809f/leaderboard \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Réponse attendue** :
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user-A",
      "name": "ProGamer",
      "avatar": "...",
      "reliabilityScore": 100,
      "totalSessions": 50,
      "attendedSessions": 50,
      "isPremium": true
    },
    ...
  ]
}
```

---

## 🐛 Tests de Gestion d'Erreurs

### Erreur 1 : Check-in sans session
**Action** : Appeler `/check-in` avec sessionId inexistant
**Résultat attendu** : 404 "Session non trouvée"

### Erreur 2 : Stats utilisateur inexistant
**Action** : Appeler `/users/fake-id/stats`
**Résultat attendu** : 404 "Utilisateur non trouvé"

### Erreur 3 : Check-in sans auth
**Action** : Appeler `/check-in` sans JWT
**Résultat attendu** : 401 "Non autorisé"

### Erreur 4 : Check-in non membre de squad
**Action** : User A tente check-in sur session de Squad B
**Résultat attendu** : 403 "Vous n'êtes pas membre de cette squad"

---

## ✅ Checklist de Validation Finale

- [x] Backend : Routes créées et fonctionnelles
- [x] Backend : Calculs de scores corrects
- [x] Backend : Attribution automatique des badges
- [x] Frontend : CheckInScreen connecté et fonctionnel
- [x] Frontend : BadgesScreen affiche vrais badges
- [x] Frontend : ProfileScreen affiche vrai score
- [x] Frontend : LeaderboardScreen affiche classement réel
- [x] UX : Loading states présents
- [x] UX : Gestion d'erreurs avec messages clairs
- [x] UX : Toasts de confirmation
- [x] Sécurité : JWT requis sur toutes les routes
- [x] Sécurité : Vérification membre de squad
- [x] Performance : Calculs optimisés côté backend
- [x] Documentation : README, rapport QA, scénarios de test

---

**Date de validation** : 25 Janvier 2026  
**Status** : ✅ TOUS LES TESTS PASSENT  
**Roadmap #2** : 🎉 VALIDÉE ET TERMINÉE 🎉
