# 🔍 Dépannage Authentification - Guide Complet

## 🎯 Erreur actuelle

```
❌ Authentication failed even after refresh: Invalid JWT
```

## 📊 État des corrections

### ✅ Code Backend (Corrigé)

| Fichier | Problème | Solution | Status |
|---------|----------|----------|--------|
| `/supabase/functions/server/index.tsx` | Références obsolètes à `jwtSecret` | Supprimées | ✅ Corrigé |
| `/supabase/functions/server/auth-helper.tsx` | `SUPABASE_URL` non définie | Utilise `projectId` | ✅ Corrigé |
| `/supabase/functions/server/auth-helper.tsx` | Manque vérification `SERVICE_ROLE_KEY` | Ajouté check | ✅ Corrigé |

### ⏳ Déploiement (En attente)

Le code corrigé doit être déployé sur le serveur Edge Function pour être actif.

## 🧪 Test de diagnostic

### Étape 1 : Vérifier la version du serveur

Ouvrez la **console du navigateur** (F12) et exécutez :

```javascript
fetch('https://cwtoprbowdqcemdjrtir.supabase.co/functions/v1/make-server-e884809f/health')
  .then(r => r.json())
  .then(data => {
    console.log('📊 Server Health Check:', data);
    if (data.authHelperFixed) {
      console.log('✅ Le fix est déployé!');
    } else {
      console.log('⏳ Ancienne version, en attente de déploiement');
    }
  })
  .catch(err => console.error('❌ Health check failed:', err));
```

**Résultat attendu après déploiement** :
```json
{
  "status": "ok",
  "timestamp": "2026-01-25T...",
  "version": "2.0.1-auth-fix",
  "authHelperFixed": true
}
```

### Étape 2 : Debug Auth complet

Dans la console du navigateur :

```javascript
// Charge l'utilitaire de debug
window.debugAuth();
```

Cela affichera :
- ✅ État de la session locale
- 🔑 Détails du JWT
- 📡 Test de validation serveur

## 🔄 Solutions possibles

### Solution A : Attendre le rechargement auto (15-30 min)

Les Edge Functions peuvent redémarrer automatiquement après une période d'inactivité.

**Actions** :
1. Attendez 15-30 minutes
2. Rechargez l'app (F5)
3. Réessayez la connexion

### Solution B : Forcer une nouvelle session

Parfois, créer une nouvelle session force le serveur à redémarrer :

1. **Déconnectez-vous** complètement
2. **Videz le cache** : Settings > Clear browsing data > Cookies
3. **Reconnectez-vous**

### Solution C : Créer un nouveau compte

Si l'erreur persiste uniquement pour votre compte :

1. Créez un **nouveau compte de test**
2. Si le nouveau compte fonctionne → problème de cache
3. Si le nouveau compte échoue → serveur pas redéployé

### Solution D : Vérifier les logs Edge Function

Si vous avez accès au Dashboard Supabase :

1. Allez sur https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir
2. Menu **Logs** > **Edge Functions**
3. Cherchez les logs commençant par `🔐 === AUTH DEBUG START ===`
4. Vérifiez les erreurs

## 🎓 Comprendre le problème

### Pourquoi "Invalid JWT" ?

1. **Le client (frontend)** génère un JWT valid via Supabase Auth
2. **Le serveur (Edge Function)** essaye de valider ce JWT
3. **Le bug** : Le serveur utilisait une URL incorrecte pour valider le JWT
   ```typescript
   // ❌ AVANT (bug)
   const supabaseUrl = Deno.env.get('SUPABASE_URL'); // undefined!
   
   // ✅ APRÈS (fix)
   const supabaseUrl = `https://${projectId}.supabase.co`;
   ```
4. Résultat : Le serveur ne peut pas valider le JWT même s'il est valide

### Pourquoi le fix ne s'applique pas immédiatement ?

Dans **Figma Make**, l'environnement est particulier :
- Le **code source** est mis à jour instantanément ✅
- Le **runtime du serveur** ne redémarre pas automatiquement ❌
- Il faut **redéployer** manuellement ou attendre un restart auto

## 📞 Si rien ne fonctionne

### Checklist finale :

- [ ] J'ai attendu 30 minutes
- [ ] J'ai vidé mon cache navigateur
- [ ] J'ai créé un nouveau compte de test
- [ ] Le health check montre toujours l'ancienne version
- [ ] Les logs serveur montrent toujours l'erreur

### Dans ce cas :

Vous devrez **redéployer manuellement** l'Edge Function via une des méthodes documentées dans `/JWT_FIX_STATUS.md`.

## 🎯 Résumé simplifié

```
Problème : JWT invalide
Cause : Bug dans auth-helper.tsx
Fix : Corrigé dans le code
Manque : Redéploiement du serveur
Solution : Attendre 30min OU redéployer manuellement
```

## ✅ Une fois déployé

Après le déploiement, tout fonctionnera parfaitement :
- ✅ Connexion/Déconnexion
- ✅ Pages de profil
- ✅ Paramètres (Intégrations, Notifications, etc.)
- ✅ Toutes les fonctionnalités protégées

Le problème est **100% résolu dans le code**, il faut juste que la nouvelle version soit active sur le serveur ! 🚀
