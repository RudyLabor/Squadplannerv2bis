import { useState, useEffect, useCallback, useRef } from 'react';
import { cache, CacheTTL, createCachedFetch } from '@/app/utils/cache';
import { measureNetworkCall, perfMonitor } from '@/app/hooks/usePerformanceMonitor';

interface UseOptimizedFetchOptions<T> {
  /** Cache key for this request */
  cacheKey: string;
  
  /** Cache TTL in milliseconds */
  ttl?: number;
  
  /** Use stale-while-revalidate strategy */
  useStale?: boolean;
  
  /** Automatically fetch on mount */
  autoFetch?: boolean;
  
  /** Initial data */
  initialData?: T;
  
  /** Screen name for performance monitoring */
  screenName?: string;
  
  /** Dependencies to refetch when changed */
  deps?: any[];
}

interface UseOptimizedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

/**
 * Optimized fetch hook with caching, deduplication, and performance tracking
 */
export function useOptimizedFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseOptimizedFetchOptions<T>
): UseOptimizedFetchResult<T> {
  const {
    cacheKey,
    ttl = CacheTTL.MEDIUM,
    useStale = true,
    autoFetch = true,
    initialData = null,
    screenName,
    deps = [],
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const fetchCountRef = useRef(0);

  const fetch = useCallback(async () => {
    // Anti-double-call: prevent multiple simultaneous fetches
    if (loading) {
      return;
    }

    const fetchId = ++fetchCountRef.current;
    
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = cache.get<T>(cacheKey);
      if (cached !== null) {
        if (isMountedRef.current && fetchId === fetchCountRef.current) {
          setData(cached);
          setLoading(false);
        }
        return;
      }

      // If stale data available, use it while fetching
      if (useStale) {
        const stale = cache.getStale<T>(cacheKey);
        if (stale !== null) {
          if (isMountedRef.current && fetchId === fetchCountRef.current) {
            setData(stale);
          }
        }
      }

      // Fetch with deduplication and performance tracking
      const startTime = Date.now();
      
      const result = await cache.dedupeRequest(cacheKey, fetchFn);
      
      const duration = Date.now() - startTime;
      
      // Track performance if monitoring enabled and screen name provided
      if (screenName && perfMonitor.isEnabled()) {
        perfMonitor.trackNetworkCall(screenName, {
          url: cacheKey,
          duration,
          status: 'success',
        });
      }

      // Cache the result
      cache.set(cacheKey, result, ttl);

      // Only update state if this is still the latest fetch and component is mounted
      if (isMountedRef.current && fetchId === fetchCountRef.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      // Track error if monitoring enabled
      if (screenName && perfMonitor.isEnabled()) {
        perfMonitor.trackNetworkCall(screenName, {
          url: cacheKey,
          duration: 0,
          status: 'error',
        });
      }

      if (isMountedRef.current && fetchId === fetchCountRef.current) {
        setError(error);
        setLoading(false);
      }
    }
  }, [cacheKey, fetchFn, ttl, useStale, loading, screenName]);

  const clearCache = useCallback(() => {
    cache.delete(cacheKey);
  }, [cacheKey]);

  // Auto-fetch on mount and when deps change
  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetch,
    clearCache,
  };
}

/**
 * Hook for batched fetches - fetches multiple resources in parallel
 */
export function useBatchFetch<T extends Record<string, any>>(
  fetchers: { [K in keyof T]: () => Promise<T[K]> },
  options: {
    autoFetch?: boolean;
    screenName?: string;
  } = {}
): {
  data: Partial<T>;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { autoFetch = true, screenName } = options;
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const startTime = Date.now();
      const keys = Object.keys(fetchers) as (keyof T)[];
      
      // Fetch all in parallel
      const results = await Promise.all(
        keys.map(key => fetchers[key]())
      );

      const duration = Date.now() - startTime;

      // Track performance
      if (screenName && perfMonitor.isEnabled()) {
        perfMonitor.trackNetworkCall(screenName, {
          url: `batch:${keys.length} requests`,
          duration,
          status: 'success',
        });
      }

      // Combine results
      const combined = keys.reduce((acc, key, index) => {
        acc[key] = results[index];
        return acc;
      }, {} as Partial<T>);

      if (isMountedRef.current) {
        setData(combined);
        setLoading(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      if (isMountedRef.current) {
        setError(error);
        setLoading(false);
      }
    }
  }, [fetchers, loading, screenName]);

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { data, loading, error, refetch: fetch };
}

/**
 * Simple hook for optimistic updates
 */
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error, rollbackData: T) => void;
    screenName?: string;
  } = {}
) {
  const { onSuccess, onError, screenName } = options;
  const [data, setData] = useState<T>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(async (optimisticData: T) => {
    const previousData = data;
    
    // Optimistically update UI immediately
    setData(optimisticData);
    setIsUpdating(true);

    const startTime = Date.now();

    try {
      // Perform actual update
      const result = await updateFn(optimisticData);
      
      const duration = Date.now() - startTime;

      // Track performance
      if (screenName && perfMonitor.isEnabled()) {
        perfMonitor.trackNetworkCall(screenName, {
          url: 'optimistic-update',
          duration,
          status: 'success',
        });
      }

      setData(result);
      setIsUpdating(false);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      // Rollback on error
      setData(previousData);
      setIsUpdating(false);
      onError?.(error, previousData);
    }
  }, [data, updateFn, onSuccess, onError, screenName]);

  return { data, isUpdating, update };
}
