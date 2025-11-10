export const dispositionResponseCodes = {
  AutoDispositionSuccess: 'AutoDispositionSuccess',
  AutoDispositionError: 'AutoDispositionError',
  InternalServerError: 'InternalServerError',
} as const;

export const dispositionResponseMessages = {
  DispositionSuccess: 'Auto-disposition completed successfully',
  DispositionStarted: 'Auto-disposition started',
  DispositionFailed: 'Auto-disposition failed',
  PlatformNotSupported: 'Platform not supported for auto-disposition',
  InternalError: 'Internal server error',
  CachedResult: "Returning cached auto disposition result"
} as const;

// Hard-coded log messages used in DispositionService
export const dispositionRequestLog = 'AutoDisposition Request:';
export const dispositionLogPrefix = 'AutoDisposition:';