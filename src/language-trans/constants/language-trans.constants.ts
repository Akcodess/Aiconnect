export const languageTransResponseCodes = {
  TranslationSuccess: 'LanguageTranslationSuccess',
  TranslationError: 'LanguageTranslationError',
  InternalServerError: 'InternalServerError',
} as const;

export const languageTransResponseMessages = {
  TranslationSuccess: 'Language translation completed successfully',
  TranslationStarted: 'Language translation started',
  TranslationFailed: 'Language translation failed',
  PlatformNotSupported: 'Platform not supported for language translation',
  InternalError: 'Internal server error',
  CachedResult: 'Returning cached language translation result',
} as const;

export const languageTransRequestLog = 'LanguageTranslation Request:';
export const languageTransLogPrefix = 'LanguageTranslation:';