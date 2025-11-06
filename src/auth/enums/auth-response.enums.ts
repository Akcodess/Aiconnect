export enum ResponseCodes {
  // Guard/Middleware
  MissingToken = 'MissingToken',
  TokenInvalid = 'TOKEN_INVALID',
  JwtSecretMissing = 'JWT_SECRET_MISSING',
  XPlatformIdMismatch = 'XPLATFORM_ID_MISMATCH',
  Unauthorized = 'UNAUTHORIZED',

  // Auth service events
  SessionInitSuccess = 'SessionInitSuccess',
  SessionInitFailed = 'SessionInitFailed',
  InvalidTenant = 'invalidUAKey',
  InvalidUser = 'invalidUser',
  SessionEndSuccess = 'SessionEndSuccess',
}

export enum ResponseMessages {
  // Guard/Middleware
  MissingToken = 'Missing authentication token',
  TokenInvalid = 'Token is invalid or expired',
  JwtSecret = 'JWT secret is not configured',
  IdMismatch = 'Platform ID mismatch',
  Unauthorized = 'Unauthorized access',

  // Auth service messages
  SessionInitSuccess = 'Session initialized successfully',
  SessionInitFailed = 'Session initialization failed',
  InvalidTenant = 'Invalid Tenant',
  InvalidUser = 'Invalid User',
  SessionEndSuccess = 'Session ended and token expired successfully',
}

export enum RequestCodes {
  SessionInit = 'SessionInit',
  SessionEnd = 'SessionEnd',
}