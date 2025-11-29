import { useState, useEffect, useCallback, useRef } from 'react';
import { apiCache } from '../utils/performanceHelpers';

/**
 * Custom hook for optimized data fetching with caching
 * @param {Function} fetchFn - Async function to fetch data
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Object} options - Options object
 * @param {boolean} options.cache - Enable caching (default: true)
 * @param {number} options.cacheTTL - Cache time-to-live in ms (default: 5min)
 * @param {string} options.cacheKey - Custom cache key
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFetch = (fetchFn, dependencies = [], options = {}) => {
  const {
    cache = true,
    cacheTTL = 5 * 60 * 1000,
    cacheKey = null,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const getCacheKey = useCallback(() => {
    return cacheKey || `${fetchFn.toString()}-${JSON.stringify(dependencies)}`;
  }, [fetchFn, dependencies, cacheKey]);

  const fetchData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cache && !skipCache) {
        const key = getCacheKey();
        const cachedData = apiCache.get(key);
        if (cachedData) {
          if (mountedRef.current) {
            setData(cachedData);
            setLoading(false);
          }
          return cachedData;
        }
      }

      // Fetch fresh data
      const result = await fetchFn();

      if (mountedRef.current) {
        setData(result);
        
        // Cache the result
        if (cache) {
          const key = getCacheKey();
          apiCache.set(key, result);
        }
      }

      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'An error occurred');
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, cache, getCacheKey]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, dependencies);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refetch };
};

/**
 * Custom hook for debounced search
 * @param {Function} searchFn - Search function to call
 * @param {number} delay - Debounce delay in ms (default: 500)
 * @returns {Function} Debounced search function
 */
export const useDebouncedSearch = (searchFn, delay = 500) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (searchTerm) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        searchFn(searchTerm);
      }, delay);
    },
    [searchFn, delay]
  );
};

/**
 * Custom hook to detect if component is mounted
 * @returns {React.MutableRefObject<boolean>} Mounted ref
 */
export const useIsMounted = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
};
