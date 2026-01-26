# 📖 API Documentation - Squad Planner

Documentation complète de l'API backend Squad Planner.

## 🔗 Base URL

```
https://{project-id}.supabase.co/functions/v1/make-server-e884809f
```

## 🔐 Authentication

Toutes les routes protégées nécessitent un header Authorization :

```
Authorization: Bearer {access_token}
```

Le `access_token` est obtenu via Supabase Auth après login.

---

## 🏥 Health Check

### GET /health

Vérifie que le serveur est opérationnel.

**Auth** : ❌ Non requise

**Response** :
```json
{
  "status": "ok",
  "timestamp": "2026-01-24T20:00:00.000Z"
}
```

---

## 👤 Authentication

### POST /auth/signup

Créer un nouveau compte utilisateur.

**Auth** : ❌ Non requise

**Body** :
```json
{
  "email": "player@example.com",
  "password": "securePassword123",
  "name": "Player One",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response 200** :
```json
{
  "user": {
    "id": "uuid-...",
    "email": "player@example.com",
    "user_metadata": {
      "name": "Player One",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  "message": "Compte créé avec succès !"
}
```

**Error 400** :
```json
{
  "error": "Email, password et nom requis"
}
```

---

### GET /auth/profile

Récupérer le profil de l'utilisateur connecté.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "profile": {
    "id": "uuid-...",
    "email": "player@example.com",
    "name": "Player One",
    "avatar": "https://example.com/avatar.jpg",
    "reliabilityScore": 95,
    "totalSessions": 42,
    "attendedSessions": 40,
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
}
```

---

### PUT /auth/profile

Mettre à jour le profil utilisateur.

**Auth** : ✅ Requise

**Body** :
```json
{
  "name": "New Name",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response 200** :
```json
{
  "profile": {
    "id": "uuid-...",
    "name": "New Name",
    "avatar": "https://example.com/new-avatar.jpg",
    ...
  }
}
```

---

## 👥 Squads

### GET /squads

Récupérer tous les squads de l'utilisateur.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "squads": [
    {
      "id": "squad-123",
      "name": "STR Fragsters",
      "game": "Valorant",
      "description": "Team compétitive FR",
      "avatar": "https://...",
      "ownerId": "uuid-...",
      "members": [
        {
          "id": "uuid-...",
          "name": "Player One",
          "avatar": "https://...",
          "role": "owner",
          "reliabilityScore": 95
        }
      ],
      "stats": {
        "totalSessions": 15,
        "activePlayers": 5,
        "avgReliability": 92
      },
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-24T18:00:00.000Z"
    }
  ]
}
```

---

### GET /squads/:id

Récupérer un squad spécifique.

**Auth** : ✅ Requise  
**Permissions** : Membre du squad

**Response 200** :
```json
{
  "squad": {
    "id": "squad-123",
    "name": "STR Fragsters",
    ...
  }
}
```

**Error 403** :
```json
{
  "error": "Accès refusé"
}
```

**Error 404** :
```json
{
  "error": "Squad non trouvé"
}
```

---

### POST /squads

Créer un nouveau squad.

**Auth** : ✅ Requise

**Body** :
```json
{
  "name": "STR Fragsters",
  "game": "Valorant",
  "description": "Team compétitive FR",
  "avatar": "https://...",
  "members": [
    {
      "id": "uuid-...",
      "name": "Player Two",
      "avatar": "https://...",
      "role": "member",
      "reliabilityScore": 88
    }
  ]
}
```

**Response 200** :
```json
{
  "squad": {
    "id": "squad-456",
    "name": "STR Fragsters",
    ...
  },
  "message": "Squad créé avec succès !"
}
```

**Webhook triggered** : `squad.created`

---

### PUT /squads/:id

Modifier un squad existant.

**Auth** : ✅ Requise  
**Permissions** : Owner uniquement

**Body** :
```json
{
  "name": "STR Fragsters Pro",
  "description": "Nouvelle description"
}
```

**Response 200** :
```json
{
  "squad": {
    "id": "squad-123",
    "name": "STR Fragsters Pro",
    ...
  }
}
```

**Error 403** :
```json
{
  "error": "Seul le propriétaire peut modifier le squad"
}
```

**Webhook triggered** : `squad.updated`

---

### DELETE /squads/:id

Supprimer un squad.

**Auth** : ✅ Requise  
**Permissions** : Owner uniquement

**Response 200** :
```json
{
  "message": "Squad supprimé avec succès"
}
```

---

## 🎮 Sessions

### GET /sessions

Récupérer toutes les sessions de l'utilisateur.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "sessions": [
    {
      "id": "session-789",
      "squadId": "squad-123",
      "squadName": "STR Fragsters",
      "title": "Ranked Push",
      "game": "Valorant",
      "proposedBy": "uuid-...",
      "proposedByName": "Player One",
      "proposedByAvatar": "https://...",
      "playersNeeded": 5,
      "slots": [
        {
          "id": "slot-1",
          "date": "2026-01-25",
          "time": "21:00",
          "responses": [
            {
              "playerId": "uuid-...",
              "playerName": "Player One",
              "playerAvatar": "https://...",
              "response": "yes",
              "timestamp": "2026-01-24T18:00:00.000Z"
            }
          ]
        }
      ],
      "status": "pending",
      "createdAt": "2026-01-24T17:00:00.000Z"
    }
  ]
}
```

---

### GET /squads/:squadId/sessions

Récupérer les sessions d'un squad spécifique.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "sessions": [...]
}
```

---

### POST /squads/:squadId/sessions

Créer une nouvelle session.

**Auth** : ✅ Requise

**Body** :
```json
{
  "title": "Ranked Push",
  "game": "Valorant",
  "playersNeeded": 5,
  "slots": [
    {
      "id": "slot-1",
      "date": "2026-01-25",
      "time": "21:00"
    },
    {
      "id": "slot-2",
      "date": "2026-01-26",
      "time": "20:00"
    }
  ]
}
```

**Response 200** :
```json
{
  "session": {
    "id": "session-890",
    ...
  },
  "message": "Session créée avec succès !"
}
```

**Webhook triggered** : `session.created`  
**Push notifications scheduled** : T-24h, T-1h, T-0

---

### POST /sessions/:sessionId/rsvp

Répondre à une session (RSVP).

**Auth** : ✅ Requise

**Body** :
```json
{
  "slotId": "slot-1",
  "response": "yes"
}
```

**Valid responses** : `"yes"`, `"no"`, `"maybe"`

**Response 200** :
```json
{
  "session": {
    "id": "session-890",
    "status": "confirmed",
    ...
  },
  "message": "RSVP enregistré !"
}
```

**Webhook triggered** : `player.rsvp`

**Note** : Si assez de "yes" sont enregistrés, le statut passe automatiquement à `confirmed`.

---

### PUT /sessions/:sessionId/status

Changer le statut d'une session.

**Auth** : ✅ Requise  
**Permissions** : Créateur de la session uniquement

**Body** :
```json
{
  "status": "cancelled"
}
```

**Valid statuses** :
- `"pending"` : En attente de réponses
- `"confirmed"` : Confirmée (assez de joueurs)
- `"in-progress"` : En cours
- `"completed"` : Terminée
- `"cancelled"` : Annulée

**Response 200** :
```json
{
  "session": {
    "id": "session-890",
    "status": "cancelled",
    ...
  }
}
```

**Webhooks triggered** :
- `status: "cancelled"` → `session.cancelled`
- `status: "in-progress"` → `session.starting`
- `status: "completed"` → Updates reliability scores

---

## 🔗 Webhooks

### GET /webhooks

Récupérer tous les webhooks de l'utilisateur.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "webhooks": [
    {
      "id": "webhook-123",
      "userId": "uuid-...",
      "name": "Discord Notifications",
      "url": "https://discord.com/api/webhooks/...",
      "events": [
        "session.created",
        "session.starting",
        "player.rsvp"
      ],
      "isActive": true,
      "totalCalls": 127,
      "lastTriggered": "2026-01-24T18:00:00.000Z",
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### POST /webhooks

Créer un nouveau webhook.

**Auth** : ✅ Requise

**Body** :
```json
{
  "name": "Discord Notifications",
  "url": "https://discord.com/api/webhooks/...",
  "events": [
    "session.created",
    "session.starting"
  ]
}
```

**Available events** :
- `session.created`
- `session.updated`
- `session.cancelled`
- `session.starting`
- `player.rsvp`
- `player.joined`
- `player.left`
- `squad.created`
- `squad.updated`

**Response 200** :
```json
{
  "webhook": {
    "id": "webhook-456",
    ...
  },
  "message": "Webhook créé avec succès !"
}
```

---

### PUT /webhooks/:id

Modifier un webhook existant.

**Auth** : ✅ Requise

**Body** :
```json
{
  "isActive": false,
  "events": ["session.created"]
}
```

**Response 200** :
```json
{
  "webhook": {
    "id": "webhook-123",
    "isActive": false,
    ...
  }
}
```

---

### DELETE /webhooks/:id

Supprimer un webhook.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "message": "Webhook supprimé avec succès"
}
```

---

## 🔔 Notifications

### GET /notifications/settings

Récupérer les paramètres de notifications.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "settings": {
    "enabled": true,
    "beforeSession24h": true,
    "beforeSession1h": true,
    "onSessionStart": true,
    "onRsvpUpdate": true
  }
}
```

---

### PUT /notifications/settings

Mettre à jour les paramètres de notifications.

**Auth** : ✅ Requise

**Body** :
```json
{
  "enabled": true,
  "beforeSession24h": true,
  "beforeSession1h": false,
  "onSessionStart": true,
  "onRsvpUpdate": false
}
```

**Response 200** :
```json
{
  "settings": {...},
  "message": "Paramètres enregistrés !"
}
```

---

## 💬 Discord Integration

### POST /discord/connect

Connecter un serveur Discord.

**Auth** : ✅ Requise

**Body** :
```json
{
  "serverId": "123456789",
  "channelId": "987654321"
}
```

**Response 200** :
```json
{
  "config": {
    "userId": "uuid-...",
    "serverId": "123456789",
    "channelId": "987654321",
    "isConnected": true,
    "connectedAt": "2026-01-24T20:00:00.000Z"
  },
  "message": "Discord connecté !"
}
```

---

### GET /discord/config

Récupérer la configuration Discord.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "config": {
    "isConnected": true,
    "serverId": "123456789",
    "channelId": "987654321"
  }
}
```

**Response 200 (not connected)** :
```json
{
  "config": {
    "isConnected": false
  }
}
```

---

### DELETE /discord/disconnect

Déconnecter Discord.

**Auth** : ✅ Requise

**Response 200** :
```json
{
  "message": "Discord déconnecté"
}
```

---

## 🔔 Webhook Payload Examples

### session.created
```json
{
  "event": "session.created",
  "timestamp": "2026-01-24T20:00:00.000Z",
  "data": {
    "session": {
      "id": "session-123",
      "squadName": "STR Fragsters",
      "title": "Ranked Push",
      "game": "Valorant",
      "playersNeeded": 5,
      "slots": [...]
    }
  }
}
```

### player.rsvp
```json
{
  "event": "player.rsvp",
  "timestamp": "2026-01-24T20:00:00.000Z",
  "data": {
    "session": {...},
    "response": "yes"
  }
}
```

### squad.created
```json
{
  "event": "squad.created",
  "timestamp": "2026-01-24T20:00:00.000Z",
  "data": {
    "squad": {
      "id": "squad-123",
      "name": "STR Fragsters",
      "game": "Valorant"
    }
  }
}
```

---

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Paramètres manquants ou invalides |
| 401 | Unauthorized - Token manquant ou invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error |

---

## 📝 Notes

- Tous les timestamps sont en format ISO 8601 UTC
- Les IDs sont générés automatiquement par le serveur
- Les webhooks sont appelés de manière asynchrone
- Les reliability scores sont mis à jour automatiquement
- Les notifications push sont schedulées automatiquement

---

**Version** : 1.0.0  
**Dernière mise à jour** : 24 janvier 2026
