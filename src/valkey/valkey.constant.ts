// Constants (camelCase variable) replacing enum for Valkey messages
export const valkeyMessages = {
  CacheError: 'Valkey error',
  CacheListen: 'Valkey listening on port',
  CacheDisconnect: 'Valkey disconnected',
  CacheSet: 'Cache set',
  CacheHit: 'Cache hit',
  CacheReturn: 'Cache return',
  CacheNotFound: 'Cache key not found',
  CacheDelete: 'Cache delete',
  CacheFlush: 'Cache flush',
} as const;