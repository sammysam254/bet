// Vertex Betting - Upstash Redis Ultra-Fast Caching & Real-time State Layer
// Upstash Redis: vocal-wolf-203214.upstash.io
// Implements 3-tier instant loading: Memory (0ms) -> LocalStorage (0ms) -> Upstash Redis (<30ms) -> Background SWR

const STORAGE_KEY_REDIS_CONFIG = 'vertex_upstash_redis_config';
const CACHE_PREFIX = 'vertex_cache:';

// Production Hardcoded Upstash Redis configuration for instant speed
const DEFAULT_UPSTASH_URL = 'https://vocal-wolf-203214.upstash.io';
const DEFAULT_UPSTASH_TOKEN = 'gQAAAAAAAxnOAAIgcDJjNjIyZDRjZmFhMjA0MDJiODQ3ODU3OTc1N2ZkNGZkOA';

export const getRedisConfig = () => {
  const saved = localStorage.getItem(STORAGE_KEY_REDIS_CONFIG);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.token) return parsed;
    } catch (e) {
      /* ignore */
    }
  }

  const envUrl = import.meta.env?.VITE_UPSTASH_REDIS_REST_URL;
  const envToken = import.meta.env?.VITE_UPSTASH_REDIS_REST_TOKEN;

  return {
    url: (envUrl && !envUrl.includes('placeholder')) ? envUrl : DEFAULT_UPSTASH_URL,
    token: (envToken && !envToken.includes('placeholder')) ? envToken : DEFAULT_UPSTASH_TOKEN,
    isCustomConfigured: true,
    status: 'ACTIVE'
  };
};

export const saveRedisConfig = ({ url, token }) => {
  const config = {
    url: url?.trim() || DEFAULT_UPSTASH_URL,
    token: token?.trim() || DEFAULT_UPSTASH_TOKEN,
    isCustomConfigured: true,
    status: 'ACTIVE'
  };
  localStorage.setItem(STORAGE_KEY_REDIS_CONFIG, JSON.stringify(config));
  return config;
};

// Tier 0: In-Memory Cache (Instant 0ms lookup)
const memoryCache = new Map();

/**
 * Get cached data with instant 0ms return.
 * Checks Memory -> LocalStorage.
 */
export const getCachedDataSync = (key) => {
  const fullKey = `${CACHE_PREFIX}${key}`;

  // 1. Check in-memory Map (0.01ms)
  if (memoryCache.has(fullKey)) {
    const entry = memoryCache.get(fullKey);
    if (!entry.expiry || entry.expiry > Date.now()) {
      return entry.data;
    }
    memoryCache.delete(fullKey);
  }

  // 2. Check LocalStorage (0.2ms)
  try {
    const local = localStorage.getItem(fullKey);
    if (local) {
      const parsed = JSON.parse(local);
      if (!parsed.expiry || parsed.expiry > Date.now()) {
        memoryCache.set(fullKey, parsed);
        return parsed.data;
      }
      localStorage.removeItem(fullKey);
    }
  } catch (e) {
    /* ignore storage errors */
  }

  return null;
};

/**
 * Save data to Memory, LocalStorage, and Upstash Redis.
 */
export const setCachedData = async (key, data, ttlSeconds = 300) => {
  const fullKey = `${CACHE_PREFIX}${key}`;
  const expiry = Date.now() + ttlSeconds * 1000;
  const payload = { data, expiry, timestamp: Date.now() };

  // 1. Update In-Memory cache (0ms)
  memoryCache.set(fullKey, payload);

  // 2. Update LocalStorage (0ms)
  try {
    localStorage.setItem(fullKey, JSON.stringify(payload));
  } catch (e) {
    try {
      localStorage.removeItem(fullKey);
    } catch (_) {}
  }

  // 3. Asynchronously pipeline to Upstash Redis REST API
  const config = getRedisConfig();
  if (config.url && config.token) {
    try {
      const cleanUrl = config.url.replace(/\/+$/, '');
      const serialized = JSON.stringify(payload);
      
      // Upstash REST command: SET key value EX ttl
      fetch(`${cleanUrl}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', fullKey, serialized, 'EX', ttlSeconds])
      }).catch(() => {
        // Silent failover
      });
    } catch (err) {
      // Non-blocking
    }
  }
};

/**
 * Fetch from Upstash Redis remote REST endpoint
 */
export const fetchFromUpstashRedis = async (key) => {
  const config = getRedisConfig();
  if (!config.url || !config.token) return null;

  try {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const cleanUrl = config.url.replace(/\/+$/, '');
    
    // Upstash REST: GET key
    const res = await fetch(`${cleanUrl}/get/${encodeURIComponent(fullKey)}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/json'
      }
    });

    if (!res.ok) return null;
    const body = await res.json();
    if (!body?.result) return null;

    const parsed = typeof body.result === 'string' ? JSON.parse(body.result) : body.result;
    if (parsed && (!parsed.expiry || parsed.expiry > Date.now())) {
      // Sync to local memory
      memoryCache.set(fullKey, parsed);
      return parsed.data;
    }
  } catch (e) {
    // Graceful fallback to memory/localStorage
  }

  return null;
};

/**
 * Instant Stale-While-Revalidate Engine (SWR)
 */
export const fetchWithInstantRedisCache = async (cacheKey, fetcherFn, options = {}) => {
  const { ttl = 180, onUpdate = null, fallbackData = null } = options;

  // Step 1: Return instant cached data from memory or localStorage (0ms!)
  const instantData = getCachedDataSync(cacheKey);
  
  // Step 2: Background revalidation
  const backgroundRevalidate = async () => {
    try {
      // Also check Upstash Redis if local was missing
      if (!instantData) {
        const upstashData = await fetchFromUpstashRedis(cacheKey);
        if (upstashData) {
          if (onUpdate) onUpdate(upstashData);
          return upstashData;
        }
      }

      // Execute live provider fetch
      const freshResult = await fetcherFn();
      if (freshResult && freshResult.data && freshResult.data.length > 0) {
        await setCachedData(cacheKey, freshResult, ttl);
        if (onUpdate) {
          onUpdate(freshResult);
        }
        return freshResult;
      }
    } catch (err) {
      console.warn(`[RedisCache] Background revalidation failed for ${cacheKey}:`, err.message);
    }
    return null;
  };

  const bgPromise = backgroundRevalidate();

  if (instantData) {
    return { data: instantData, fromCache: true, bgPromise };
  }

  const fresh = await bgPromise;
  if (fresh) {
    return { data: fresh, fromCache: false };
  }

  return { data: fallbackData || { isLiveFeed: true, data: [] }, fromCache: false };
};
