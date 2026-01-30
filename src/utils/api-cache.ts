/**
 * Global API Cache - Prevents redundant API calls
 * Like Spotify/Linear, we cache data aggressively for instant UX
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in ms (default 60s)
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh
}

const DEFAULT_TTL = 60000; // 60 seconds
const cache = new Map<string, CacheEntry<any>>();

// In-flight requests to prevent duplicate calls
const inFlight = new Map<string, Promise<any>>();

/**
 * Get cached data or fetch fresh
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = DEFAULT_TTL, staleWhileRevalidate = true } = options;
  const now = Date.now();

  // Check cache
  const cached = cache.get(key);
  if (cached) {
    // Fresh data - return immediately
    if (now < cached.expiresAt) {
      return cached.data;
    }

    // Stale data - return it but revalidate in background
    if (staleWhileRevalidate) {
      // Trigger background refresh
      revalidate(key, fetcher, ttl);
      return cached.data;
    }
  }

  // Check if request is already in flight
  const existing = inFlight.get(key);
  if (existing) {
    return existing;
  }

  // Make the request
  const promise = fetcher().then(data => {
    cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
    inFlight.delete(key);
    return data;
  }).catch(err => {
    inFlight.delete(key);
    throw err;
  });

  inFlight.set(key, promise);
  return promise;
}

/**
 * Background revalidation
 */
async function revalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<void> {
  // Don't revalidate if already in flight
  if (inFlight.has(key)) return;

  const promise = fetcher().then(data => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    });
    inFlight.delete(key);
  }).catch(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, promise);
}

/**
 * Invalidate specific cache key
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Invalidate cache keys matching a pattern
 */
export function invalidateCachePattern(pattern: string): void {
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cache.clear();
  inFlight.clear();
}

/**
 * Prefetch data into cache
 */
export async function prefetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<void> {
  const { ttl = DEFAULT_TTL } = options;

  // Don't prefetch if already cached and fresh
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return;
  }

  try {
    const data = await fetcher();
    cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    });
  } catch {
    // Silently fail prefetch
  }
}

/**
 * Get cache stats for debugging
 */
export function getCacheStats() {
  return {
    size: cache.size,
    inFlightCount: inFlight.size,
    keys: Array.from(cache.keys())
  };
}

// Cache keys for common resources
export const CACHE_KEYS = {
  USER_PROFILE: (id: string) => `user:${id}`,
  USER_SQUADS: (id: string) => `squads:user:${id}`,
  SQUAD_DETAIL: (id: string) => `squad:${id}`,
  SQUAD_MEMBERS: (id: string) => `squad:${id}:members`,
  SQUAD_SESSIONS: (id: string) => `squad:${id}:sessions`,
  USER_SESSIONS: (id: string) => `sessions:user:${id}`,
  USER_FRIENDS: (id: string) => `friends:${id}`,
  USER_NOTIFICATIONS: (id: string) => `notifications:${id}`,
  USER_ACHIEVEMENTS: (id: string) => `achievements:${id}`,
  LEADERBOARD: (type: string) => `leaderboard:${type}`,
  RANKING: (id: string) => `ranking:${id}`,
};
