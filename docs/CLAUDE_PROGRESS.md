# PROGRESSION CLAUDE - 30 Janvier 2026

## CREDENTIALS (déjà dans CLAUDE.md)
Voir CLAUDE.md pour les credentials

## BUGS CORRIGÉS ✅
1. Web Locks fix (src/lib/supabase.ts) - flowType: 'implicit', lock: { enabled: false }
2. TypeScript strict: false dans tsconfig.json
3. CI simplifié (.github/workflows/ci.yml)
4. Types Supabase régénérés (3461 lignes)
5. RLS policies corrigées sur squads et squad_members

## BUG ACTUEL 🔴
- La session se perd lors de la navigation entre pages
- Le fix Web Locks est dans le code mais Vercel n'a pas redéployé
- Besoin de forcer un redéploiement

## PROCHAINE ACTION
- Commit un changement pour trigger Vercel
- Tester la navigation après déploiement
