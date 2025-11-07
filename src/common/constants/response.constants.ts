// Shared response constants with direct values (no enum imports)
export const responseCodes = {
  XPLATFORM_SID_MISMATCH: 'XPLATFORM_SID_MISMATCH',
  SENTIMENT_ANALYSIS_COMPLETED: 'SENTIMENT_ANALYSIS_COMPLETED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export const responseMessages = {
  SID_MISMATCH: 'SID mismatch',
  CACHED_RESULT: 'Cached result',
  ANALYSIS_SUCCESS: 'Sentiment analysis completed successfully',
  ANALYSIS_STARTED: 'Sentiment analysis started',
  ANALYSIS_FAILED: 'Sentiment analysis failed',
  INTERNAL_ERROR: 'Internal server error',
} as const;