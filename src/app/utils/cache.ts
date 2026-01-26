/**
 * Cache system with TTL (Time To Live) for network request optimization
 * Implements stale-while-revalidate strategy
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private static instance: CacheManager;
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Get cached data if valid, otherwise return null
   */
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Return null if cache expired
    if (age > entry.ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Get cached data even if stale (for stale-while-revalidate)
   */
  getStale<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    return entry ? entry.data : null;
  }

  /**
   * Check if cache is stale but exists
   */
  isStale(key: string): boolean {
    const entry = this.memoryCache.get(key);
    if (!entry) return false;

    const now = Date.now();
    const age = now - entry.timestamp;
    return age > entry.ttl;
  }

  /**
   * Set cache data with TTL in milliseconds
   */
  set<T>(key: string, data: T, ttl: number = 60000): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    this.pendingRequests.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.memoryCache.entries());
    const now = Date.now();
    
    return {
      total: entries.length,
      fresh: entries.filter(([_, entry]) => (now - entry.timestamp) <= entry.ttl).length,
      stale: entries.filter(([_, entry]) => (now - entry.timestamp) > entry.ttl).length,
      pending: this.pendingRequests.size,
    };
  }

  /**
   * Deduplicate requests - if same request is in-flight, return existing promise
   */
  async dedupeRequest<T>(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    // Check if request is already in-flight
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending;
    }

    // Start new request and track it
    const promise = fetchFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

export const cache = CacheManager.getInstance();

/**
 * Cache TTL constants (in milliseconds)
 */
export const CacheTTL = {
  /** 30 seconds - for frequently changing data */
  SHORT: 30 * 1000,
  
  /** 60 seconds - default for most data */
  MEDIUM: 60 * 1000,
  
  /** 5 minutes - for semi-static data */
  LONG: 5 * 60 * 1000,
  
  /** 30 minutes - for static data (games list, etc.) */
  STATIC: 30 * 60 * 1000,
} as const;

/**
 * Helper to create cached fetch function with stale-while-revalidate
 */
export function createCachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    ttl?: number;
    useStale?: boolean;
  } = {}
): () => Promise<T> {
  const { ttl = CacheTTL.MEDIUM, useStale = true } = options;

  return async () => {
    // Check fresh cache first
    const cached = cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // If stale-while-revalidate enabled, return stale data while fetching fresh
    if (useStale) {
      const stale = cache.getStale<T>(key);
      if (stale !== null && cache.isStale(key)) {
        // Return stale data immediately, but trigger refresh in background
        cache.dedupeRequest(key, async () => {
          const fresh = await fetchFn();
          cache.set(key, fresh, ttl);
          return fresh;
        });
        return stale;
      }
    }

    // No cache, fetch fresh data with deduplication
    return cache.dedupeRequest(key, async () => {
      const data = await fetchFn();
      cache.set(key, data, ttl);
      return data;
    });
  };
}

/**
 * Helper to batch multiple promises and track timing
 */
export async function batchRequests<T extends readonly unknown[]>(
  requests: readonly [...{ [K in keyof T]: Promise<T[K]> }],
  options: {
    maxConcurrent?: number;
  } = {}
): Promise<T> {
  const { maxConcurrent } = options;

  // If no concurrency limit, run all in parallel
  if (!maxConcurrent) {
    return Promise.all(requests) as Promise<T>;
  }

  // Run with concurrency limit
  const results: any[] = [];
  const queue = [...requests];
  const running: Promise<any>[] = [];

  while (queue.length > 0 || running.length > 0) {
    // Fill up to maxConcurrent
    while (running.length < maxConcurrent && queue.length > 0) {
      const promise = queue.shift()!;
      const tracked = promise.finally(() => {
        const index = running.indexOf(tracked);
        if (index !== -1) {
          running.splice(index, 1);
        }
      });
      running.push(tracked);
      results.push(tracked);
    }

    // Wait for at least one to complete
    if (running.length > 0) {
      await Promise.race(running);
    }
  }

  return Promise.all(results) as Promise<T>;
}

/**
 * LocalStorage cache for persistent data
 */
export const persistentCache = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`cache:${key}`);
      if (!item) return null;
      
      const { data, timestamp, ttl } = JSON.parse(item);
      const age = Date.now() - timestamp;
      
      if (age > ttl) {
        localStorage.removeItem(`cache:${key}`);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  },

  set<T>(key: string, data: T, ttl: number = CacheTTL.LONG): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(`cache:${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set persistent cache:', error);
    }
  },

  delete(key: string): void {
    localStorage.removeItem(`cache:${key}`);
  },

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache:')) {
        localStorage.removeItem(key);
      }
    });
  },
};
