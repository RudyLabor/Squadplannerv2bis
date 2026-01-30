**Réponds toujours en français.**

# Squad Planner - Contexte Projet

## Stack Technique
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (Auth, Database, RLS)
- **Styling**: Tailwind CSS + Framer Motion
- **Déploiement**: Vercel (auto-deploy on git push)

## URLs
- **Production**: https://squadplanner.vercel.app
- **Local**: http://localhost:5173
- **Supabase**: https://ecvuakmbjxwqhobkntnw.supabase.co

## État Actuel du Projet

### Performance (RÉSOLU - 30 Jan 2026)
- **Problème**: Pages chargeaient en 3-5s, fallait vider le cache
- **Cause**: 100+ animations Framer Motion avec `repeat: Infinity` permanentes
- **Fix**: `src/app/components/AnimatedBackground.tsx` remplacé par CSS statique
- **Résultat**: Pages chargent en ~400ms, navigation en ~165ms

### Commits Récents
1. `perf: Fix critical performance issue - remove infinite animations`
2. `perf: Optimize bundle size (-78%) and add intelligent prefetching`
3. `feat: Premium UI redesign for 17 screens`

## Fichiers Importants

### Configuration
- `vite.config.ts` - Build config avec code splitting optimisé
- `tailwind.config.js` - Theme et design tokens
- `supabase/config.toml` - Config Supabase locale

### Composants Clés
- `src/app/components/AnimatedBackground.tsx` - Background statique (CSS only)
- `src/app/components/BottomNav.tsx` - Navigation mobile avec prefetch
- `src/app/components/DesktopSidebar.tsx` - Navigation desktop avec prefetch

### Écrans Principaux
- `src/app/screens/HomeScreen.tsx`
- `src/app/screens/LoginScreen.tsx`
- `src/app/screens/SquadsScreen.tsx`
- `src/app/screens/SquadDetailScreen.tsx`
- `src/app/screens/SessionsScreen.tsx`

### Base de Données
- `FULL_DB_SETUP.sql` - Script complet de la BDD
- `supabase/migrations/` - Migrations Supabase

## Roadmaps
- `ROADMAP_CLAUDE.md` - Plan général du projet
- `ROADMAP_UI_REDESIGN.md` - Plan redesign UI (en cours)

## Commandes Utiles

```bash
# Démarrer le serveur de dev
npm run dev

# Build production
npm run build

# Lancer les tests E2E
npx playwright test

# Pousser vers Vercel (auto-deploy)
git push origin main
```

## Règles de Développement

1. **Animations**: JAMAIS de `repeat: Infinity` sur les backgrounds ou éléments permanents
2. **Performance**: Toujours tester le temps de chargement après modifications
3. **Commits**: Format conventionnel (feat:, fix:, perf:, etc.)
4. **Tests**: Utiliser Playwright pour les tests E2E

## Prochaines Étapes (Roadmap UI Redesign)

1. ✅ Phase 0: Audit et Performance
2. ✅ Phase 1: Premium UI Redesign (17 écrans)
3. 🔄 Phase 2: APIs et Intégrations
4. ⏳ Phase 3: Tests E2E complets
5. ⏳ Phase 4: Déploiement final

## Notes pour Claude

- Toujours lire `ROADMAP_UI_REDESIGN.md` pour connaître l'état du redesign
- Le serveur de dev tourne généralement sur `localhost:5173`
- Utiliser Chrome integration (`claude --chrome`) pour tester visuellement
- Les RLS policies sont déjà déployées sur Supabase
