// Constants with direct values (no enum imports)
export const sessionResponseCodes = {
  // Guard/Middleware
  MissingToken: 'MissingToken',
  TokenInvalid: 'TOKEN_INVALID',
  JwtSecretMissing: 'JWT_SECRET_MISSING',
  XPlatformIdMismatch: 'XPLATFORM_ID_MISMATCH',
  Unauthorized: 'UNAUTHORIZED',

  // Session service events
  SessionInitSuccess: 'SessionInitSuccess',
  SessionInitFailed: 'SessionInitFailed',
  InvalidTenant: 'invalidUAKey',
  InvalidUser: 'invalidUser',
  SessionEndSuccess: 'SessionEndSuccess',
  VersionInfoFetch: 'VersionInfoFetch',
  HealthCheck: 'HealthCheck',
  EncryptSuccess: 'EncryptSuccess',
  EncryptFailed: 'EncryptFailed',
  // Renewal
  SessionRenewSuccess: 'SessionRenewSuccess',
  SessionRenewFailed: 'SessionRenewFailed',
} as const;

export const sessionResponseMessages = {
  // Guard/Middleware
  MissingToken: 'Missing authentication token',
  TokenInvalid: 'Token is invalid or expired',
  JwtSecret: 'JWT secret is not configured',
  IdMismatch: 'Platform ID mismatch',
  Unauthorized: 'Unauthorized access',

  // Session service messages
  SessionInitSuccess: 'Session initialized successfully',
  SessionInitFailed: 'Session initialization failed',
  InvalidTenant: 'Invalid Tenant',
  InvalidUser: 'Invalid User',
  SessionEndSuccess: 'Session ended and token expired successfully',
  VersionFetched: 'Version fetched successfully',
  HealthOk: 'Health check OK',
  EncryptSuccess: 'Data encrypted successfully',
  EncryptFailed: 'Data encryption failed',
  // Renewal
  SessionRenewSuccess: 'Session renewed successfully',
  SessionRenewFailed: 'Session renewal failed',
} as const;

// Other hard-coded texts
export const sessionLogRequestBody = 'Request Body:';