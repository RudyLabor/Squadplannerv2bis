# 🎯 ROADMAP #3 - AUTOMATISATION & INTELLIGENCE

**Date** : 25 Janvier 2026  
**Status** : 🚧 EN COURS  
**Objectif** : Transformer Squad Planner en machine à habitudes avec intelligence et automatisation

---

## 🎯 VISION

**Problème actuel** :
- Créer une session = tâche manuelle répétitive
- Trouver le bon créneau = devinette
- Rappels = inexistants
- Données d'historique = sous-exploitées

**Solution Roadmap #3** :
- ✅ L'app suggère automatiquement les meilleurs créneaux
- ✅ Sessions récurrentes créées automatiquement
- ✅ Notifications automatiques (rappels, nouveaux votes)
- ✅ Heatmap de disponibilité visuelle
- ✅ Optimisations performance (stats en batch)

---

## 📦 FONCTIONNALITÉS

### 1️⃣ Suggestions de Créneaux Intelligentes 🧠

**Backend** :
```
GET /make-server-e884809f/squads/:squadId/smart-suggestions
```

**Algorithme** :
```typescript
function getSmartSuggestions(squadId) {
  // 1. Charger toutes les sessions passées de la squad
  const sessions = await getAllPastSessions(squadId);
  
  // 2. Calculer le taux de participation par jour de semaine
  const dayStats = {};
  sessions.forEach(session => {
    const day = getDayOfWeek(session.date); // 0 = dimanche, 6 = samedi
    const hour = getHour(session.time);
    
    if (!dayStats[day]) dayStats[day] = { total: 0, attended: 0, hours: {} };
    dayStats[day].total++;
    dayStats[day].attended += session.attendanceRate;
    
    if (!dayStats[day].hours[hour]) dayStats[day].hours[hour] = 0;
    dayStats[day].hours[hour]++;
  });
  
  // 3. Identifier les 3 meilleurs créneaux (jour + heure)
  const suggestions = [];
  Object.entries(dayStats).forEach(([day, stats]) => {
    Object.entries(stats.hours).forEach(([hour, count]) => {
      suggestions.push({
        day: parseInt(day),
        hour: parseInt(hour),
        score: (stats.attended / stats.total) * count,
      });
    });
  });
  
  // 4. Trier par score et retourner top 3
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 3);
}
```

**Frontend** :
- Écran : `SmartSuggestionsScreen.tsx`
- Affichage : 3 cartes de suggestions avec score de confiance
- Action : Cliquer pour pré-remplir le formulaire de création de session

---

### 2️⃣ Sessions Récurrentes 🔄

**Backend** :
```
POST /make-server-e884809f/squads/:squadId/recurring-session
```

**Payload** :
```json
{
  "dayOfWeek": 2, // 0 = dimanche, 6 = samedi
  "time": "21:00",
  "duration": 120,
  "game": "Valorant",
  "recurrence": "weekly"
}
```

**Logique** :
```typescript
async function createRecurringSession(squadId, config) {
  // 1. Créer la session pour cette semaine
  const nextDate = getNextDateForDay(config.dayOfWeek);
  const session = await createSession({
    squadId,
    date: nextDate,
    time: config.time,
    duration: config.duration,
    game: config.game,
    isRecurring: true,
  });
  
  // 2. Stocker la config de récurrence
  await kv.set(`recurring:${squadId}`, config);
  
  // 3. Scheduler : Chaque lundi, créer les sessions de la semaine
  // (Implémenté via un cron job ou fonction déclenchée manuellement)
  
  return session;
}
```

**Frontend** :
- Écran : `RecurringSessionScreen.tsx`
- Toggle "Session récurrente" dans CreateSessionScreen
- Affichage : Badge "🔄 Récurrente" sur les sessions

---

### 3️⃣ Système de Notifications 🔔

**Backend** :
```
GET /make-server-e884809f/users/:userId/notifications
POST /make-server-e884809f/notifications/mark-read
```

**Types de notifications** :
1. **Session confirmée** : "Votre session Valorant est confirmée pour demain 21h"
2. **Rappel 24h** : "Session dans 24h - Confirme ta présence"
3. **Rappel 1h** : "Session dans 1h - Prépare-toi !"
4. **Nouveau vote** : "Alex a voté OUI pour la session de demain"
5. **Badge débloqué** : "🏆 Nouveau badge : Fiable"
6. **No-show détecté** : "Tu as manqué la session d'hier - Check-in manqué"

**Structure notification** :
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'session_confirmed' | 'reminder_24h' | 'reminder_1h' | 'new_vote' | 'badge_unlocked' | 'no_show';
  title: string;
  message: string;
  metadata: {
    sessionId?: string;
    squadId?: string;
    badgeId?: string;
  };
  read: boolean;
  createdAt: string;
}
```

**Frontend** :
- Écran : `NotificationsScreen.tsx`
- Badge sur icône notifications dans navbar
- Liste avec swipe-to-delete

---

### 4️⃣ Heatmap de Disponibilité 📊

**Backend** :
```
GET /make-server-e884809f/squads/:squadId/availability-heatmap
```

**Algorithme** :
```typescript
function getAvailabilityHeatmap(squadId) {
  // 1. Charger toutes les sessions passées
  const sessions = await getAllPastSessions(squadId);
  
  // 2. Créer une matrice 7 jours x 24 heures
  const heatmap = Array(7).fill(null).map(() => Array(24).fill(0));
  
  sessions.forEach(session => {
    const day = getDayOfWeek(session.date);
    const hour = getHour(session.time);
    
    // Incrémenter si bon taux de participation (> 80%)
    if (session.attendanceRate > 0.8) {
      heatmap[day][hour]++;
    }
  });
  
  // 3. Normaliser les valeurs (0-100)
  const max = Math.max(...heatmap.flat());
  return heatmap.map(row => row.map(val => (val / max) * 100));
}
```

**Frontend** :
- Écran : `AvailabilityHeatmapScreen.tsx`
- Affichage : Grille 7x24 avec couleurs (vert = bon, rouge = mauvais)
- Interaction : Cliquer sur une case pour créer session à ce moment

---

### 5️⃣ Optimisation : Stats de Membres en Batch ⚡

**Backend** :
```
GET /make-server-e884809f/squads/:squadId/members-stats
```

**Réponse** :
```json
{
  "members": [
    {
      "userId": "user123",
      "name": "Alex",
      "avatar": "...",
      "reliabilityScore": 95,
      "totalSessions": 20,
      "attendanceRate": 95,
      "lastSession": "2026-01-24T21:00:00Z"
    }
  ]
}
```

**Frontend** :
- Utiliser dans SquadDetailScreen pour afficher vrais scores
- Remplacer les données mockées

---

## 🏗️ ARCHITECTURE

### Backend (Supabase Edge Functions)

**Nouvelles routes** :
1. `GET /squads/:squadId/smart-suggestions`
2. `POST /squads/:squadId/recurring-session`
3. `GET /users/:userId/notifications`
4. `POST /notifications/mark-read`
5. `GET /squads/:squadId/availability-heatmap`
6. `GET /squads/:squadId/members-stats`

**Nouvelles fonctions** :
1. `getSmartSuggestions(squadId)`
2. `createRecurringSession(squadId, config)`
3. `generateNotifications(userId, type, metadata)`
4. `getAvailabilityHeatmap(squadId)`
5. `getMembersStats(squadId)`

### Frontend (React + TypeScript)

**Nouveaux écrans** :
1. `SmartSuggestionsScreen.tsx`
2. `RecurringSessionScreen.tsx`
3. `NotificationsScreen.tsx`
4. `AvailabilityHeatmapScreen.tsx`

**Modifications** :
1. `CreateSessionScreen.tsx` - Ajouter toggle "Session récurrente"
2. `SquadDetailScreen.tsx` - Utiliser `getMembersStats()` au lieu de données mockées
3. `HomeScreen.tsx` - Afficher badge notifications

---

## 📊 SUCCESS METRICS

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Taux d'adoption suggestions | > 50% | Sessions créées depuis suggestions / Total sessions |
| Taux de sessions récurrentes | > 30% | Sessions récurrentes / Total sessions |
| Taux de lecture notifications | > 80% | Notifications lues / Total notifications |
| Réduction temps création session | > 40% | Temps moyen avant/après suggestions |
| Précision suggestions | > 70% | Sessions confirmées depuis suggestions / Total suggestions |

---

## 🧪 TESTS À EFFECTUER

### Tests Backend
- [ ] Route suggestions retourne top 3 créneaux
- [ ] Route recurring-session crée session + config
- [ ] Route notifications retourne liste triée par date
- [ ] Route heatmap retourne matrice 7x24
- [ ] Route members-stats retourne tous les membres avec scores

### Tests Frontend
- [ ] SmartSuggestionsScreen affiche 3 suggestions
- [ ] Cliquer suggestion pré-remplit formulaire
- [ ] Toggle récurrence dans CreateSessionScreen
- [ ] NotificationsScreen affiche badge count
- [ ] Heatmap affichage couleurs correctes
- [ ] SquadDetailScreen affiche vrais scores membres

### Tests E2E
- [ ] Créer 5 sessions → Suggérer créneaux → Vérifier top 3
- [ ] Créer session récurrente → Vérifier création automatique
- [ ] Recevoir notification → Lire → Badge disparaît
- [ ] Visualiser heatmap → Cliquer case → Créer session

---

## ⏱️ TIMELINE

- **Jour 1** : Backend routes + fonctions
- **Jour 2** : Frontend écrans + connexion API
- **Jour 3** : Tests + bugfixes
- **Jour 4** : QA complète + documentation

---

## 🚀 PRÊT À DÉMARRER

**Next steps** :
1. Implémenter backend (6 routes)
2. Implémenter frontend (4 écrans + modifications)
3. Tests complets
4. QA professionnelle
5. Documentation

**Let's build!** 🎮
