import api from './api';

const CACHE_TTL_MS = 30_000;

type CacheEntry = {
  expiresAt: number;
  request?: Promise<unknown>;
  value?: unknown;
};

const resourceCache = new Map<string, CacheEntry>();

/**
 * Shares in-flight reads and keeps successful Member 3 API payloads briefly.
 * This prevents profile and dashboard hooks from requesting the same resource twice.
 */
export const getMember3Resource = async <T>(path: string): Promise<T> => {
  const now = Date.now();
  const cached = resourceCache.get(path);

  if (cached?.value !== undefined && cached.expiresAt > now) {
    return cached.value as T;
  }

  if (cached?.request) {
    return cached.request as Promise<T>;
  }

  const request = api
    .get(path)
    .then((response) => response.data?.data ?? response.data)
    .then((value) => {
      resourceCache.set(path, { value, expiresAt: Date.now() + CACHE_TTL_MS });
      return value;
    })
    .catch((error) => {
      resourceCache.delete(path);
      throw error;
    });

  resourceCache.set(path, { expiresAt: 0, request });
  return request as Promise<T>;
};

export const clearMember3Cache = () => resourceCache.clear();
