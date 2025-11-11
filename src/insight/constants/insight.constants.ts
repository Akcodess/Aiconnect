export const insightResponseCodes = {
  InsightSuccess: 'InsightSuccess',
  InternalServerError: 'InternalServerError',
} as const;

export const insightResponseMessages = {
  InsightSuccess: 'Insight generated successfully',
  InsightStarted: 'Insight generation started',
  InsightFailed: 'Insight generation failed',
  CachedResult: 'Returning cached insight result',
  InvalidAllowedInsight: 'Invalid AllowedInsight',
  InsightRequestBody: 'Insight Request Body:',
  OpenaiHandlerError: 'OpenAI Insight handler error',
  GoogleCloudHandlerError: 'GoogleCloud Insight handler error'
} as const;

export const validInsights = [
  'Summary',
  'KeywordCount',
  'Takeaway',
  'NextAction',
  'Rating',
  'Sentiment',
  'Disposition',
] as const;