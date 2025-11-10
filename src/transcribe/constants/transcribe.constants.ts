export const transcribeResponseCodes = {
  TranscribeSuccess: 'TranscribeSuccess',
  TranscribeError: 'TranscribeError',
  XPlatformSidMismatch: 'XPlatformSidMismatch',
  InternalServerError: 'InternalServerError',
} as const;

export const transcribeResponseMessages = {
  TranscriptionStarted: 'Transcription started',
  TranscriptionSuccess: 'Transcription completed successfully',
  TranscriptionFailed: 'Transcription failed',
  CachedResult: 'Transcription result served from cache',
  InternalError: 'Internal Server Error',
} as const;

export const transcribeRequestLog = '[Transcribe Request]';