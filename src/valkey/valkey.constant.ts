// Constants (camelCase variable) replacing enum for Valkey messages
export const valkeyMessages = {
  CacheError: 'Valkey error',
  CacheListen: 'Valkey listening on port',
  CacheDisconnect: 'Valkey disconnected',
  CacheSet: 'Cache set: value stored successfully',
  CacheHit: 'Cache hit: returning cached result',
  CacheReturn: 'Returning cached result',
  CacheNotFound: 'Cache key not found',
  CacheDelete: 'Cache delete: key deleted successfully',
  CacheFlush: 'Cache flush: all keys deleted successfully',
} as const;