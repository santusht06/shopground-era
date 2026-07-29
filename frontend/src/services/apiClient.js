import axios from 'axios';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('shopgroundera.com')) {
    return 'https://api.shopgroundera.com/api/v1';
  }
  return 'http://localhost:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-LAYER MEMOIZATION CACHE
// Layer 1: In-memory Map (instant — zero latency, lives for the browser tab)
// Layer 2: sessionStorage (survives React Router navigations within the session)
// Layer 3: Deduplication map (collapses concurrent identical requests into one)
// TTL: 5 minutes for product data (configurable per call)
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TTL_MS = 5 * 60 * 1000;         // 5 minutes
const SESSION_KEY_PREFIX = 'sge_cache_';

/**
 * In-memory cache — holds { data, expiresAt } per cache key.
 * Lives for the lifetime of the browser tab.
 */
const memoryCache = new Map();

/**
 * In-flight deduplication map — holds a Promise per cache key.
 * If two components request the same URL before the first resolves,
 * both get the SAME promise — only one network request fires.
 */
const inFlightMap = new Map();

/**
 * Read from Layer 1 (memory) or Layer 2 (sessionStorage).
 * Returns the cached data if still valid, or null.
 */
function readCache(cacheKey) {
  // Layer 1: memory
  const mem = memoryCache.get(cacheKey);
  if (mem && Date.now() < mem.expiresAt) {
    return mem.data;
  }

  // Layer 2: sessionStorage
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_PREFIX + cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() < parsed.expiresAt) {
        // Re-warm memory cache from sessionStorage hit
        memoryCache.set(cacheKey, parsed);
        return parsed.data;
      }
      // Stale — clean up
      sessionStorage.removeItem(SESSION_KEY_PREFIX + cacheKey);
    }
  } catch (_) {
    // sessionStorage unavailable (private browsing restriction) — ignore
  }

  return null;
}

/**
 * Write to both Layer 1 (memory) and Layer 2 (sessionStorage).
 */
function writeCache(cacheKey, data, ttlMs = DEFAULT_TTL_MS) {
  const entry = { data, expiresAt: Date.now() + ttlMs };
  memoryCache.set(cacheKey, entry);
  try {
    sessionStorage.setItem(SESSION_KEY_PREFIX + cacheKey, JSON.stringify(entry));
  } catch (_) {
    // sessionStorage quota exceeded or unavailable — memory-only cache
  }
}

/**
 * Invalidate a specific cache key from all layers.
 */
export function invalidateCache(cacheKey) {
  memoryCache.delete(cacheKey);
  try { sessionStorage.removeItem(SESSION_KEY_PREFIX + cacheKey); } catch (_) {}
}

/**
 * Invalidate ALL cached entries (e.g. after a mutation / form submit).
 */
export function clearAllCache() {
  memoryCache.clear();
  try {
    Object.keys(sessionStorage)
      .filter(k => k.startsWith(SESSION_KEY_PREFIX))
      .forEach(k => sessionStorage.removeItem(k));
  } catch (_) {}
}

/**
 * cachedGet — memoized GET request.
 *
 * Usage: cachedGet('/products/66a87f12bc09a123456789ab')
 *        cachedGet('/products/66a87f12bc09a123456789ab', { ttl: 60000 })
 *
 * Returns cached data immediately if valid, otherwise fetches once
 * (deduplicating concurrent calls) and caches the result.
 *
 * @param {string} url - Relative API path (same as apiClient.get(url))
 * @param {Object} options
 * @param {number} [options.ttl=300000] - TTL in ms (default 5 min)
 * @returns {Promise<any>} - Resolves with response.data
 */
export async function cachedGet(url, { ttl = DEFAULT_TTL_MS } = {}) {
  const cacheKey = url;

  // ── Check all cache layers first ──────────────────────────────────────────
  const cached = readCache(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // ── Deduplicate in-flight requests ────────────────────────────────────────
  if (inFlightMap.has(cacheKey)) {
    return inFlightMap.get(cacheKey);
  }

  // ── Fire the real network request ─────────────────────────────────────────
  const promise = apiClient.get(url)
    .then(res => {
      writeCache(cacheKey, res.data, ttl);
      inFlightMap.delete(cacheKey);
      return res.data;
    })
    .catch(err => {
      inFlightMap.delete(cacheKey);
      throw err;
    });

  inFlightMap.set(cacheKey, promise);
  return promise;
}

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh or Auth Expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
          const newAccessToken = res.data.access_token;
          localStorage.setItem('access_token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
