# ⚡ Quick Fix Summary - Invalid JWT

## Problème
```
❌ Load squads error: Invalid JWT
```

## Cause
Le backend utilisait **SERVICE_ROLE_KEY** pour valider les JWT utilisateurs (signés avec **ANON_KEY**).

## Solution
Créer deux clients Supabase distincts :

```typescript
// Client admin (SERVICE_ROLE) - pour opérations admin
const supabase = createClient(url, serviceRoleKey);

// Client auth (ANON) - pour valider JWT utilisateurs
const supabaseAnon = createClient(url, publicAnonKey);

// Utiliser le bon client
async function getAuthenticatedUser(authHeader: string | null) {
  const token = authHeader.replace('Bearer ', '');
  
  // ✅ Utiliser supabaseAnon (pas supabase)
  const { data, error } = await supabaseAnon.auth.getUser(token);
  
  return data?.user || null;
}
```

## Fichier Modifié
- `/supabase/functions/server/index.tsx`

## Changements

### Avant
```typescript
// ❌ Un seul client pour tout
const supabase = createClient(url, serviceRoleKey);

// ❌ Valide avec mauvaise clé
const { data, error } = await supabase.auth.getUser(token);
```

### Après
```typescript
// ✅ Deux clients distincts
const supabase = createClient(url, serviceRoleKey);
const supabaseAnon = createClient(url, publicAnonKey);

// ✅ Valide avec la bonne clé
const { data, error } = await supabaseAnon.auth.getUser(token);
```

## Test
```bash
1. Login: shadow.ninja@squadplanner.demo / Demo1234!
2. Aller sur "Mes Squads"
3. ✅ Les squads se chargent (plus d'erreur JWT)
```

## Documentation Complète
Voir `BUGFIX_INVALID_JWT.md` pour détails techniques.

---

**Status:** ✅ Fixed
**Impact:** Débloque toutes les routes protégées
**Temps:** 15 min
