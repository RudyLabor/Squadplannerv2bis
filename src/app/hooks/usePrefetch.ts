/**
 * PREFETCH INTELLIGENT - Style Linear/Spotify
 * Précharge les pages au survol pour navigation instantanée
 */

import { useCallback, useRef } from 'react';

// Cache des modules déjà préchargés
const prefetchedRoutes = new Set<string>();

// Map des routes vers leurs imports dynamiques
const routeImports: Record<string, () => Promise<unknown>> = {
  '/home': () => import('@/app/screens/HomeScreen'),
  '/squads': () => import('@/app/screens/SquadsScreen'),
  '/sessions': () => import('@/app/screens/SessionsScreen'),
  '/profile': () => import('@/app/screens/ProfileScreen'),
  '/premium': () => import('@/app/screens/PremiumScreen'),
  '/ranking': () => import('@/app/screens/RankingScreen'),
  '/leaderboard': () => import('@/app/screens/LeaderboardScreen'),
  '/friends': () => import('@/app/screens/FriendsScreen'),
  '/notifications': () => import('@/app/screens/NotificationsScreen'),
  '/create-squad': () => import('@/app/screens/CreateSquadScreen'),
  '/join-squad': () => import('@/app/screens/JoinSquadScreen'),
  '/settings': () => import('@/app/screens/EditProfileScreen'),
};

/**
 * Hook pour précharger une route
 */
export function usePrefetch() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefetch = useCallback((route: string) => {
    // Déjà préchargé
    if (prefetchedRoutes.has(route)) return;

    const importFn = routeImports[route];
    if (!importFn) return;

    // Préchargement avec délai (évite les préchargements accidentels)
    timeoutRef.current = setTimeout(() => {
      importFn()
        .then(() => {
          prefetchedRoutes.add(route);
        })
        .catch(() => {
          // Silencieux en cas d'erreur
        });
    }, 100); // 100ms de délai avant préchargement
  }, []);

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { prefetch, cancelPrefetch };
}

/**
 * Précharge les routes critiques au démarrage de l'app
 * À appeler une fois après le premier rendu
 */
export function prefetchCriticalRoutes() {
  // Précharger après 2 secondes d'inactivité (idle)
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      // Routes les plus visitées
      const criticalRoutes = ['/home', '/squads', '/sessions', '/profile'];
      criticalRoutes.forEach((route) => {
        const importFn = routeImports[route];
        if (importFn && !prefetchedRoutes.has(route)) {
          importFn()
            .then(() => prefetchedRoutes.add(route))
            .catch(() => {});
        }
      });
    });
  }
}

/**
 * HOC pour ajouter le prefetch au survol d'un lien
 */
export function getPrefetchProps(route: string) {
  const importFn = routeImports[route];
  if (!importFn || prefetchedRoutes.has(route)) {
    return {};
  }

  return {
    onMouseEnter: () => {
      importFn()
        .then(() => prefetchedRoutes.add(route))
        .catch(() => {});
    },
    onFocus: () => {
      importFn()
        .then(() => prefetchedRoutes.add(route))
        .catch(() => {});
    },
  };
}
