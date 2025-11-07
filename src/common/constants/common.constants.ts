// Constants with direct values (no enum imports)
export const commonResponseCodes = {
  VersionInfoFetch: 'VersionInfoFetch',
  HealthCheck: 'HealthCheck',
  EncryptSuccess: 'EncryptSuccess',
  EncryptFailed: 'EncryptFailed',
} as const;

export const commonResponseMessages = {
  VersionFetched: 'Version fetched successfully',
  HealthOk: 'Health check OK',
  EncryptSuccess: 'Data encrypted successfully',
  EncryptFailed: 'Data encryption failed',
} as const;

// Other hard-coded values used in responses
export const commonHealthOkText = 'OK';

// Default messages used across common error handling
export const validationFailedMessage = 'Request validation failed';