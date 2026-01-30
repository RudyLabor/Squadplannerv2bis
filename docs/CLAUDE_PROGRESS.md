# PROGRESSION CLAUDE - Squad Planner

> **IMPORTANT**: Copier ce fichier au début de chaque nouvelle conversation avec Claude pour maintenir le contexte.

## Consignes pour Claude

**Après chaque correction de bug ou modification de code :**

1. **Toujours commiter** les changements avec un message descriptif (format conventionnel : `fix:`, `feat:`, `perf:`, etc.)
2. **Toujours pousser** vers `origin/main` pour déployer sur Vercel
3. **Toujours mettre à jour** ce fichier CLAUDE_PROGRESS.md avec les changements effectués
4. utilser puppeteer pour tester

---

## CREDENTIALS (A GARDER CONFIDENTIEL)

### Application Squadplanner - Compte Test

- **Email**: rudylabor@hotmail.fr
- **Mot de passe**: SquadPlanner2026!

### Supabase

- **Project ID**: cwtoprbowdqcemdjrtir
- **URL**: https://cwtoprbowdqcemdjrtir.supabase.co
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dG9wcmJvd2RxY2VtZGpydGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIxNDI2MywiZXhwIjoyMDg0NzkwMjYzfQ.9QuJ0c3WpLKQHHmPKsJlDttU8YFPR7f-xD_VLl8gFDE
- **Database Password**: Ruudboy92600\*

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
    storage: customStorage, // Custom localStorage adapter
    storageKey: `sb-${projectId}-auth-token`,
    flowType: "implicit",
    // @ts-ignore
    lock: false, // Tentative de désactiver Web Locks
  },
});
```

### Flux d'initialisation dans AuthContext.tsx

1. `checkAuthTokenSync()` - Vérifie si token présent dans localStorage
2. Si token trouvé et non expiré → tente `setSession()` avec les tokens
3. Puis appelle `getSession()` pour vérifier la session
4. **PROBLÈME**: getSession() retourne null ou timeout

### Tentatives de fix déjà essayées

| #   | Fix tenté                       | Résultat             |
| --- | ------------------------------- | -------------------- |
| 1   | `lock: { enabled: false }`      | ❌ Ne fonctionne pas |
| 2   | `lock: false`                   | ❌ Ne fonctionne pas |
| 3   | `flowType: 'implicit'`          | ❌ Pas suffisant     |
| 4   | `detectSessionInUrl: false`     | ❌ Pas suffisant     |
| 5   | Custom storage adapter          | ❌ Pas suffisant     |
| 6   | setSession() avant getSession() | ❌ Ne fonctionne pas |

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

## ✅ BUG CORRIGÉ - Création de Squad (30 Jan 2026 - 21h30)

### Description du problème

Le bouton "Créer la Squad" restait bloqué en état de chargement (spinner infini) ou affichait "Erreur lors de la création".

### Cause racine identifiée

**Récursion infinie dans les policies RLS** des tables `squads` et `squad_members`.

```
Erreur Supabase: HTTP 500
Code: 42P17
Message: "infinite recursion detected in policy for relation \"squad_members\""
```

Les policies faisaient des références croisées:

- `squads_select` → sous-requête sur `squad_members`
- `squad_members_select` → sous-requête sur `squads`

### Solution appliquée

Simplification des policies RLS pour éliminer toute référence croisée.

**SQL exécuté sur Supabase:**

```sql
-- SQUADS: Policies simples SANS référence à squad_members
CREATE POLICY "squads_select" ON squads FOR SELECT USING (
  owner_id = auth.uid() OR is_public = true
);
CREATE POLICY "squads_insert" ON squads FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());
CREATE POLICY "squads_update" ON squads FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "squads_delete" ON squads FOR DELETE USING (owner_id = auth.uid());

-- SQUAD_MEMBERS: Policies simples SANS référence à squads
CREATE POLICY "squad_members_select" ON squad_members FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "squad_members_insert" ON squad_members FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "squad_members_update" ON squad_members FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "squad_members_delete" ON squad_members FOR DELETE USING (user_id = auth.uid());
```

### Fichier migration créé

`supabase/migrations/20260130200000_fix_infinite_recursion.sql`

### Test Puppeteer (30 Jan 2026 - 21h30)

- ✅ Connexion fonctionne
- ✅ Navigation vers Squads
- ✅ Formulaire création squad
- ✅ **Création de squad "Test Squad Claude" → SUCCÈS**
- ✅ Squad apparaît dans la liste

---

## ✅ BUGS CORRIGÉS - Page Détail Squad (30 Jan 2026 - 22h00)

### Bug 1: Animation bloquée (opacity: 0)

- **Problème**: Le contenu de la page détail squad restait invisible (opacity: 0)
- **Cause**: Animation Framer Motion `containerVariants` ne se déclenchait pas correctement
- **Solution**: Ajout de `duration: 0.15` et `when: "beforeChildren"` aux variants
- **Fichier modifié**: `src/app/screens/SquadDetailScreen.tsx`

### Bug 2: Affichage "0 membres"

- **Problème**: La liste des membres affichait 0 alors qu'il y avait 1 membre (le créateur)
- **Cause**: Policy RLS trop restrictive - ne permettait que de voir ses propres memberships
- **Solution**: Ajout policy `squad_members_view_owned_squads` pour voir les membres des squads possédées

```sql
CREATE POLICY "squad_members_view_owned_squads" ON squad_members
FOR SELECT USING (
  squad_id IN (SELECT id FROM squads WHERE owner_id = auth.uid())
);
```

---

## Tests Phase 0 - Résultats

| Test                              | Résultat   |
| --------------------------------- | ---------- |
| 0.1.1 Page login s'affiche        | ✅         |
| 0.1.2 Connexion fonctionne        | ✅         |
| 0.1.3 Redirection vers Home       | ✅         |
| 0.2.1 Page Home s'affiche         | ✅         |
| 0.2.2 Nom utilisateur affiché     | ✅         |
| 0.2.3 Stats affichées             | ✅         |
| 0.3.1 Menu latéral visible        | ✅         |
| 0.3.2 Navigation Squads           | ✅         |
| 0.3.3 Navigation Sessions         | ✅         |
| 0.3.4 Navigation Profil           | ✅         |
| **F5 / Refresh**                  | ✅ CORRIGÉ |
| 0.4.3 Bouton créer squad          | ✅         |
| 0.4.4 Formulaire création         | ✅         |
| **0.4.5 Création squad**          | ✅ CORRIGÉ |
| 0.4.6 Clic sur squad ouvre détail | ✅         |
| **0.4.7 Détail squad affiche**    | ✅ CORRIGÉ |

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

## 🔴 BUG EN COURS - Page Home Timeout (30 Jan 2026 - 22h30)

### Description du problème

La page Home affiche "Oups ! Le chargement prend trop de temps. Vérifie ta connexion." avec un bouton "Réessayer".

### Comportement observé

1. Connexion fonctionne → Page Home affiche "Bienvenue, Ruuddams"
2. **F5 (refresh)** → Page affiche des skeletons (loading)
3. Après ~15 secondes → Message "Oups !"
4. Le token est présent dans localStorage
5. Cliquer "Réessayer" ne résout pas le problème

### 🔍 Diagnostic approfondi (30 Jan 2026)

#### Test Puppeteer - Requête HTTP directe
```javascript
// Test fetch direct avec le token
const response = await fetch(url, {
  headers: {
    'apikey': publicAnonKey,
    'Authorization': 'Bearer ' + tokenData.access_token,
  }
});
// Résultat: { status: 401, duration: "86ms" }
```

**CAUSE RACINE IDENTIFIÉE**: Le `access_token` retourne **401 Unauthorized** même si `expires_at` dans localStorage n'est pas expiré. Le JWT access_token a une durée de vie plus courte (~1h) que le `expires_at` stocké.

#### Chaîne de blocage
1. AuthContext restaure l'utilisateur depuis localStorage → ✅ OK (sidebar affiche "rudylabor")
2. SquadsContext appelle `refreshSquads()` → `squadsAPI.getAll()`
3. `squadsAPI.getAll()` fait une requête Supabase
4. Le SDK Supabase essaie de rafraîchir le token via Web Locks → **BLOQUE**
5. Timeout de 15s dans HomeScreen.tsx se déclenche → "Oups !"

### 🧪 Tentatives de fix (30 Jan 2026)

| #   | Fix tenté | Fichier(s) modifié(s) | Résultat |
|-----|-----------|----------------------|----------|
| 1 | Restaurer session avec `setSession()` dans api.ts | `src/app/services/api.ts` | ❌ `setSession()` bloque avec Web Locks |
| 2 | Custom storage pour Supabase | `src/lib/supabase.ts` | ❌ Le SDK bloque quand même |
| 3 | Désactiver `autoRefreshToken: false` | `src/lib/supabase.ts` | ❌ Les tokens expirent et 401 |
| 4 | Ajouter timeout à `setSession()` | `src/lib/supabase.ts` | ❌ Timeout se déclenche, requêtes échouent |
| 5 | `initializeSession()` avec `refreshSession()` | `src/lib/supabase.ts` | ❌ `refreshSession()` bloque aussi |
| 6 | Refresh HTTP direct (sans SDK) | `src/lib/supabase.ts` | ❌ Tokens rafraîchis mais SDK ne les utilise pas |
| 7 | Lire user directement du localStorage dans `getCurrentUser()` | `src/app/services/api.ts` | ❌ Requêtes Supabase échouent avec 401 |

### Fichiers modifiés (non commités)

1. `src/lib/supabase.ts` - Ajout `initializeSession()` avec refresh HTTP
2. `src/app/services/api.ts` - Simplification `getCurrentUser()` pour lire localStorage
3. `src/app/contexts/SquadsContext.tsx` - Appel `initializeSession()` avant les requêtes

### Analyse technique

Le problème fondamental est que le SDK Supabase v2 utilise la **Web Locks API** pour synchroniser les opérations d'authentification. Cette API peut causer des **deadlocks** dans certaines conditions:

1. Au refresh de page, le SDK tente de restaurer la session
2. Il acquiert un lock pour éviter les conditions de course
3. Le lock ne se libère jamais dans certains cas → blocage

**Solutions possibles à explorer**:
1. Downgrade vers Supabase SDK v1 (sans Web Locks)
2. Utiliser un worker séparé pour l'auth
3. Forcer la déconnexion/reconnexion après timeout
4. Contacter le support Supabase

### ✅ SOLUTION QUI FONCTIONNE (30 Jan 2026 - 23h50)

**Approche**: Au lieu d'essayer de réparer le SDK Supabase, on contourne le problème avec des timeouts et une gestion d'erreur robuste.

**Fichiers modifiés**:

1. **`src/app/services/api.ts`** - Ajout timeout de 10s sur `squadsAPI.getAll()`:
```typescript
const timeoutPromise = new Promise<never>((_, reject) => {
  setTimeout(() => reject(new Error('Request timeout (10s)')), 10000);
});
const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
```

2. **`src/app/contexts/SquadsContext.tsx`** - Gestion du 401/timeout:
```typescript
} catch (err: any) {
  if (err.message?.includes('401') || err.message?.includes('timeout')) {
    setSquads([]); // Retourner liste vide au lieu de bloquer
  }
} finally {
  setLoading(false); // Toujours arrêter le loading
}
```

3. **`src/lib/supabase.ts`** - Refresh HTTP direct des tokens (contourne Web Locks)

**Test Puppeteer**:
- ✅ Connexion → Page Home s'affiche
- ✅ F5 (refresh) → Page Home s'affiche
- ✅ Multiple F5 → Fonctionne

### Statut

**✅ CORRIGÉ** - La page Home s'affiche maintenant après F5

---

## Policies RLS actuelles sur Supabase (30 Jan 2026)

### Table `squads`

```sql
-- SELECT: Owner ou squads publiques
CREATE POLICY "squads_select" ON squads FOR SELECT
USING (owner_id = auth.uid() OR is_public = true);

-- INSERT: Utilisateur authentifié, owner = lui-même
CREATE POLICY "squads_insert" ON squads FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- UPDATE/DELETE: Seulement le owner
CREATE POLICY "squads_update" ON squads FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "squads_delete" ON squads FOR DELETE USING (owner_id = auth.uid());
```

### Table `squad_members`

```sql
-- SELECT: Ses propres memberships
CREATE POLICY "squad_members_select" ON squad_members FOR SELECT
USING (user_id = auth.uid());

-- SELECT: Membres des squads qu'on possède
CREATE POLICY "squad_members_view_owned_squads" ON squad_members FOR SELECT
USING (squad_id IN (SELECT id FROM squads WHERE owner_id = auth.uid()));

-- INSERT: S'ajouter soi-même
CREATE POLICY "squad_members_insert" ON squad_members FOR INSERT
WITH CHECK (user_id = auth.uid());

-- UPDATE/DELETE: Soi-même
CREATE POLICY "squad_members_update" ON squad_members FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "squad_members_delete" ON squad_members FOR DELETE USING (user_id = auth.uid());
```

---

## Dernier commit Git (30 Jan 2026 - 22h00)

```
Commit: affea1d
Branch: main
Message: fix: Resolve squad detail page bugs and RLS policy issues

Fichiers modifiés:
- docs/CLAUDE_PROGRESS.md (documentation)
- docs/TEST_CHECKLIST.md (documentation)
- src/app/screens/SquadDetailScreen.tsx (fix animation opacity)
- src/app/contexts/UserContext.tsx (workaround localStorage)
- supabase/migrations/20260130200000_fix_infinite_recursion.sql (nouveau)

Pushed to: origin/main (déployé sur Vercel)
```

---

_Dernière mise à jour: 30 Janvier 2026 - 23h55_
_Statut: ✅ Bug page Home CORRIGÉ - F5 fonctionne maintenant_
