# PROGRESSION CLAUDE - Squad Planner

> **IMPORTANT**: Copier ce fichier au début de chaque nouvelle conversation avec Claude pour maintenir le contexte.

---

## CREDENTIALS (A GARDER CONFIDENTIEL)

### Application - Compte Test
- **Email**: rudylabor@hotmail.fr
- **Mot de passe**: SquadPlanner2026!

### Supabase
- **Project ID**: cwtoprbowdqcemdjrtir
- **URL**: https://cwtoprbowdqcemdjrtir.supabase.co
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE
- **Database Password**: Ruudboy92600*

### URLs
- **Production**: https://squadplanner.vercel.app
- **Local**: http://localhost:5173

---

## 🔴 BUG CRITIQUE BLOQUANT - DÉCONNEXION SUR F5

### Description du problème
**L'utilisateur est déconnecté à chaque actualisation de page (F5) ou navigation directe vers une URL.**

### Comportement observé
1. L'utilisateur se connecte avec succès
2. Il navigue normalement dans l'application (Squads, Sessions, Profil)
3. Il actualise la page (F5) ou entre une URL directement
4. **RÉSULTAT**: Redirection vers la page de Login (déconnecté)

### Diagnostic effectué (30 Jan 2026)

#### ✅ Ce qui fonctionne
- Le token EST stocké dans localStorage après connexion
- Le token n'est PAS expiré
- La clé utilisée : `sb-cwtoprbowdqcemdjrtir-auth-token`
- Structure du token : `{ access_token, refresh_token, expires_at, ... }`

#### ❌ Ce qui ne fonctionne pas
- `supabase.auth.getSession()` ne récupère pas la session au chargement
- `supabase.auth.setSession()` avec les tokens du localStorage ne fonctionne pas
- La session n'est pas restaurée malgré un token valide

### Test Puppeteer (30 Jan 2026 - 20h00)

#### Scénario testé
1. Navigation vers http://localhost:5174
2. Connexion avec rudylabor@hotmail.fr / SquadPlanner2026!
3. Connexion réussie → Dashboard affiché "Bienvenue, Ruuddaams"
4. **F5 (refresh de la page)**
5. **RÉSULTAT**: Page bloquée sur "Chargement..." indéfiniment (>25 secondes)

#### Observations
- Le token reste présent dans localStorage après le refresh
- Le token n'est pas expiré (expires_at dans le futur)
- L'application ne redirige PAS vers login, elle reste bloquée sur "Chargement..."
- Le timeout de 20s défini dans AuthContext.tsx ne semble pas se déclencher correctement

#### Cause probable identifiée
L'option `lock: false` dans la config Supabase n'est PAS une option valide du SDK.
Le SDK utilise la Web Locks API en interne qui peut causer des deadlocks lors de l'appel à `getSession()`.

### Fichiers concernés
1. **`src/lib/supabase.ts`** - Configuration du client Supabase
2. **`src/app/contexts/AuthContext.tsx`** - Logique d'initialisation auth

### Configuration actuelle de Supabase (src/lib/supabase.ts)
```typescript
export const supabase = createClient<Database>(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: customStorage,  // Custom localStorage adapter
    storageKey: `sb-${projectId}-auth-token`,
    flowType: 'implicit',
    // @ts-ignore
    lock: false,  // Tentative de désactiver Web Locks
  },
});
```

### Flux d'initialisation dans AuthContext.tsx
1. `checkAuthTokenSync()` - Vérifie si token présent dans localStorage
2. Si token trouvé et non expiré → tente `setSession()` avec les tokens
3. Puis appelle `getSession()` pour vérifier la session
4. **PROBLÈME**: getSession() retourne null ou timeout

### Tentatives de fix déjà essayées
| # | Fix tenté | Résultat |
|---|-----------|----------|
| 1 | `lock: { enabled: false }` | ❌ Ne fonctionne pas |
| 2 | `lock: false` | ❌ Ne fonctionne pas |
| 3 | `flowType: 'implicit'` | ❌ Pas suffisant |
| 4 | `detectSessionInUrl: false` | ❌ Pas suffisant |
| 5 | Custom storage adapter | ❌ Pas suffisant |
| 6 | setSession() avant getSession() | ❌ Ne fonctionne pas |

### ✅ FIX APPLIQUÉ (30 Jan 2026 - 20h30)

**Cause racine identifiée**: Le SDK Supabase (v2.93.2) ne restaure pas correctement la session depuis localStorage au chargement. Les appels à `getSession()`, `getUser()`, et même l'événement `INITIAL_SESSION` de `onAuthStateChange` retournent `null` malgré un token valide stocké.

**Solution implémentée**: Workaround qui lit manuellement le token depuis localStorage et crée l'utilisateur directement sans dépendre du SDK pour la restauration.

**Fichiers modifiés**:
1. `src/lib/supabase.ts` - Configuration simplifiée (suppression de lock, customStorage, etc.)
2. `src/app/contexts/AuthContext.tsx` - Ajout de `restoreFromLocalStorage()` qui:
   - Lit le token depuis `sb-cwtoprbowdqcemdjrtir-auth-token`
   - Vérifie que le token n'est pas expiré
   - Crée l'utilisateur depuis les données du token (`tokenData.user`)
   - Charge le profil complet en arrière-plan

**Test Puppeteer**:
- ✅ Connexion fonctionne
- ✅ F5 (refresh) conserve la session
- ✅ Multiple F5 fonctionnent

### Logs attendus vs observés
```
ATTENDU:
[Auth] ✅ Token valide trouvé, vérification de la session...
[Auth] ✅ Session trouvée, chargement du profil...
[Auth] ✅ Profil chargé: rudylabor@hotmail.fr

OBSERVÉ:
[Auth] ✅ Token valide trouvé, vérification de la session...
[Auth] ⚠️ Timeout/erreur sur getSession...
[Auth] ℹ️ Pas de session après refresh - utilisateur non connecté
→ Redirection vers /login
```

### Version des dépendances
- `@supabase/supabase-js`: ^2.93.2
- `react`: ^18.x
- `vite`: ^5.x

---

## Autres bugs identifiés (à traiter après le fix F5)

### Bug création de squad
- Erreur lors de la création (message non capturé)
- Policies RLS vérifiées et OK

---

## Tests Phase 0 - Résultats (sans compter le bug F5)

| Test | Résultat |
|------|----------|
| 0.1.1 Page login s'affiche | ✅ |
| 0.1.2 Connexion fonctionne | ✅ |
| 0.1.3 Redirection vers Home | ✅ |
| 0.2.1 Page Home s'affiche | ✅ |
| 0.2.2 Nom utilisateur affiché | ✅ |
| 0.2.3 Stats affichées | ✅ |
| 0.3.1 Menu latéral visible | ✅ |
| 0.3.2 Navigation Squads | ✅ |
| 0.3.3 Navigation Sessions | ✅ |
| 0.3.4 Navigation Profil | ✅ |
| **F5 / Refresh** | ✅ CORRIGÉ |

---

## Commandes utiles

```bash
# Dev local
npm run dev

# Build
npm run build

# Deploy
git push origin main

# Voir les logs Vercel
vercel logs
```

---

## Liens

- **Vercel**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir
- **GitHub Issues Supabase**: https://github.com/supabase/supabase-js/issues

---

*Dernière mise à jour: 30 Janvier 2026 - 20h30*
*Statut: 🟢 Bug F5 CORRIGÉ*
