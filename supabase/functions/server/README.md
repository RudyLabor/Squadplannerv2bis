# Squad Planner Server - Architecture Modulaire

## 📦 Structure

Le serveur a été refactorisé en modules séparés pour réduire la taille du bundle et améliorer la maintenabilité.

### Fichiers

- **index.tsx** (100 lignes) - Point d'entrée principal, charge les modules de routes
- **routes-auth.ts** - Toutes les routes d'authentification (signup, login, profile)
- **routes-squads.ts** - Gestion des squads (CRUD, invitations, messages)
- **routes-sessions.ts** - Gestion des sessions (création, RSVP, check-in)
- **routes-analytics.ts** - Analytics et statistiques (leaderboard, heatmaps, suggestions)
- **routes-integrations.ts** - Intégrations tierces (webhooks, Discord, OAuth, push, calendar)
- **route-helpers.ts** - Fonctions utilitaires partagées
- **auth-helper.tsx** - Authentification JWT (protégé)
- **kv_store.tsx** - Accès au KV store (protégé)
- **supabase-info.ts** - Configuration Supabase
- **oauth-config.ts** - Configuration OAuth
- **google-calendar.ts** - Intégration Google Calendar

## 🎯 Avantages

### Avant
- 1 fichier monolithique : **3148 lignes**
- Difficile à maintenir
- Temps de déploiement lent
- Risque d'erreurs de publication

### Après
- 6 fichiers modulaires : **~100 lignes chacun**
- Code organisé par domaine fonctionnel
- **Réduction de 97% du fichier principal**
- Chargement lazy des routes
- Déploiement plus rapide et fiable

## 🔧 Comment ajouter une nouvelle route

1. Identifie le module approprié (auth, squads, sessions, analytics, integrations)
2. Ajoute ta route dans le fichier correspondant
3. La route sera automatiquement chargée au démarrage du serveur

Exemple dans `routes-squads.ts` :

```typescript
export function registerSquadRoutes(app: Hono, supabase: SupabaseClient) {
  app.get("/make-server-e884809f/squads/:id/custom", async (c) => {
    // Ta logique ici
  });
}
```

## 📊 Routes disponibles

### Auth (routes-auth.ts)
- POST `/auth/signup` - Créer un compte
- POST `/auth/verify-token` - Vérifier un token JWT
- GET `/auth/profile` - Récupérer le profil
- PUT `/auth/profile` - Mettre à jour le profil
- POST `/auth/check-user` - Vérifier si un utilisateur existe
- POST `/auth/reset-password-admin` - Réinitialiser un mot de passe

### Squads (routes-squads.ts)
- GET `/squads` - Liste des squads
- GET `/squads/:id` - Détails d'une squad
- POST `/squads` - Créer une squad
- POST `/squads/join` - Rejoindre une squad
- PUT `/squads/:id` - Modifier une squad
- DELETE `/squads/:id` - Supprimer une squad
- GET `/squads/:id/cohesion` - Métriques de cohésion
- GET `/squads/:id/members-stats` - Stats des membres
- GET `/squads/:id/messages` - Messages de la squad
- POST `/squads/:id/messages` - Envoyer un message

### Sessions (routes-sessions.ts)
- GET `/squads/:squadId/sessions` - Sessions d'une squad
- GET `/sessions` - Toutes les sessions de l'utilisateur
- POST `/squads/:squadId/sessions` - Créer une session
- POST `/sessions/:id/rsvp` - Répondre à une session
- PUT `/sessions/:id/status` - Mettre à jour le statut
- POST `/sessions/:id/check-in` - Check-in
- GET `/sessions/:id/check-ins` - Liste des check-ins
- GET `/users/:id/stats` - Stats de fiabilité

### Analytics (routes-analytics.ts)
- GET `/leaderboard` - Classement
- GET `/analytics/heatmap` - Heatmap de disponibilité
- GET `/analytics/suggestions` - Suggestions IA
- GET `/analytics/weekly-recap` - Récapitulatif hebdomadaire
- GET `/squads/:id/availability-heatmap` - Heatmap d'une squad
- GET `/squads/:id/smart-suggestions` - Suggestions intelligentes

### Integrations (routes-integrations.ts)
- GET/POST `/webhooks` - Gestion des webhooks
- GET/PUT `/notifications/settings` - Paramètres de notifications
- GET `/users/:id/notifications` - Notifications
- POST `/notifications/mark-read` - Marquer comme lu
- POST `/discord/connect` - Connecter Discord
- GET/POST `/user/integrations` - Gestion des intégrations
- POST `/user/integrations/:platform/connect` - Connecter une plateforme
- POST `/user/integrations/:platform/disconnect` - Déconnecter une plateforme
- GET `/oauth/:platform/authorize` - Initier OAuth
- GET `/oauth/:platform/callback` - Callback OAuth
- POST `/push/subscribe` - S'abonner aux push
- POST `/calendar/sync` - Synchroniser avec le calendrier
- POST `/demo/generate-ecosystem` - Générer des données de démo

## ⚙️ Configuration

Le serveur utilise les variables d'environnement suivantes :
- `SUPABASE_URL` - URL Supabase (auto-détectée)
- `SUPABASE_SERVICE_ROLE_KEY` - Clé service role (requise)
- `SUPABASE_ANON_KEY` - Clé anonyme publique

## 🚀 Déploiement

La nouvelle architecture modulaire devrait résoudre les problèmes de publication sur Figma Make en :
1. Réduisant la taille du fichier principal
2. Permettant un chargement lazy des routes
3. Améliorant la performance de compilation

## 📝 Notes

- Tous les préfixes de routes commencent par `/make-server-e884809f/`
- L'authentification JWT est gérée via `getAuthenticatedUser()` dans `auth-helper.tsx`
- Le stockage utilise le KV store via `kv_store.tsx`
- Les fichiers protégés (auth-helper, kv_store) ne doivent PAS être modifiés

## 🐛 Debugging

Si le serveur ne démarre pas :
1. Vérifie les logs avec `console.log()`
2. Assure-toi que toutes les variables d'environnement sont définies
3. Vérifie que les imports dans `index.tsx` sont corrects
4. Teste la route `/health` pour vérifier que le serveur répond
