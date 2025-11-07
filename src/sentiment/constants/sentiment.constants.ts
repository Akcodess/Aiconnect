export const responseCodes = {
  SentimentAnalysisCompleted: 'SentimentAnalysisCompleted',
  InternalServerError: 'InternalServerError',
} as const;

export const responseMessages = {
  AnalysisSuccess: 'Sentiment analysis completed successfully',
  AnalysisStarted: 'Sentiment analysis started',
  AnalysisFailed: 'Sentiment analysis failed',
  InternalError: 'Internal server error',
} as const;

// Hard-coded log messages used in SentimentService
export const sentimentRequestLog = 'Sentiment Request:';
export const sentimentLogPrefix = 'Sentiment:';

//OpenAi Constants
export const openaiMessages = {
    OpenaiHandlerError: "OpenAI handler error"
}

export const googleCloudMesssages = {
    GoogleCloudHandlerError: "GoogleCloud handler error"
}