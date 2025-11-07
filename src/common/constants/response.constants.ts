// Shared response constants with PascalCase names
export const commonResponseCodes = {
  XPlatformSidMismatch: 'XPlatformSidMismatch',
  SentimentAnalysisCompleted: 'SentimentAnalysisCompleted',
  InternalServerError: 'InternalServerError',
} as const;

export const commonResponseMessages = {
  SidMismatch: 'XPlatformSID does not match',
  CachedResult: 'Returning cached sentiment result',
  AnalysisSuccess: 'Sentiment analysis completed successfully',
  AnalysisStarted: 'Sentiment analysis started',
  AnalysisFailed: 'Sentiment analysis failed',
  InternalError: 'Internal server error',
} as const;