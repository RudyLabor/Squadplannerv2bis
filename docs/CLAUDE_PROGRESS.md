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

## BUG CRITIQUE EN COURS - DÉCONNEXION SUR F5

### Problème
**L'utilisateur est déconnecté à chaque actualisation de page (F5)**

### Symptômes
1. Connexion réussie, redirection vers Home
2. L'utilisateur actualise la page (F5)
3. Redirection vers la page de Login
4. La session n'est pas persistée

### Cause identifiée
Le problème est lié aux **Web Locks API** de Supabase qui cause un deadlock lors du rechargement de page.

### Tentatives de fix déjà essayées
1. ❌ `lock: { enabled: false }` - Ne fonctionne pas (mauvaise syntaxe)
2. ⏳ `lock: false` - En cours de test (fix appliqué le 30 Jan 2026)
3. ✅ `flowType: 'implicit'` - Appliqué
4. ✅ `detectSessionInUrl: false` - Appliqué
5. ✅ Custom storage adapter - Appliqué

### Fichier concerné
`src/lib/supabase.ts` - Configuration du client Supabase

### Code actuel (après fix)
```typescript
export const supabase = createClient<Database>(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: customStorage,
    storageKey: `sb-${projectId}-auth-token`,
    flowType: 'implicit',
    // @ts-ignore
    lock: false,  // <-- FIX: était { enabled: false }
  },
});
```

### Prochaines actions si le fix ne marche pas
1. Mettre à jour `@supabase/supabase-js` vers la dernière version
2. Essayer avec `storageKey` différent
3. Implémenter un refresh token manuel au chargement
4. Contacter le support Supabase

---

## AUTRE BUG - CRÉATION DE SQUAD

### Problème
Erreur lors de la création d'une squad (message d'erreur non capturé)

### Policies RLS vérifiées
- ✅ "Authenticated users can create squads" - INSERT - public

### À investiguer
1. Vérifier les logs dans la console du navigateur
2. Vérifier les logs Supabase (Edge Functions logs)
3. Tester la création via l'API directement

---

## HISTORIQUE DES CORRECTIONS

### Performance (30 Jan 2026) ✅
- **Problème**: Pages chargeaient en 3-5s
- **Cause**: 100+ animations Framer Motion avec `repeat: Infinity`
- **Fix**: `src/app/components/AnimatedBackground.tsx` remplacé par CSS statique

### Policies RLS (30 Jan 2026) ✅
- **Problème**: Les squads ne s'affichaient pas pour les membres
- **Fix**: Policies RLS mises à jour via SQL Editor Supabase

### TypeScript (30 Jan 2026) ✅
- `strict: false` dans `tsconfig.json`

### CI/CD (30 Jan 2026) ✅
- Simplifié `.github/workflows/ci.yml` (lint + build only)

---

## FICHIERS CLÉS DU PROJET

### Configuration Auth (CRITIQUE)
- `src/lib/supabase.ts` - Client Supabase avec config auth
- `src/app/contexts/AuthContext.tsx` - Logique d'authentification
- `src/app/services/auth.ts` - Services auth

### Screens
- `src/app/screens/HomeScreen.tsx` - Page d'accueil
- `src/app/screens/LoginScreen.tsx` - Page de connexion
- `src/app/screens/SquadsScreen.tsx` - Liste des squads
- `src/app/screens/CreateSquadScreen.tsx` - Création de squad

---

## COMMANDES UTILES

```bash
# Dev local
npm run dev

# Build
npm run build

# Deploy (auto via git push)
git push origin main

# Supabase CLI
npx supabase projects list
npx supabase db push
```

---

## LIENS UTILES

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir
- **Checklist de test**: `docs/TEST_CHECKLIST.md`

---

*Dernière mise à jour: 30 Janvier 2026 - 16h30*
*Bug critique: Déconnexion sur F5 - EN COURS DE CORRECTION*
