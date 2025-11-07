export const responseCodes = {
  SentimentAnalysisCompleted: 'SentimentAnalysisCompleted',
  InternalServerError: 'InternalServerError',
  // Sentiment history endpoint codes
  SentimentHistoryCompleted: 'SentimentHistoryCompleted',
  SentimentHistoryFailed: 'SentimentHistoryFailed',
} as const;

export const responseMessages = {
  AnalysisSuccess: 'Sentiment analysis completed successfully',
  AnalysisStarted: 'Sentiment analysis started',
  AnalysisFailed: 'Sentiment analysis failed',
  InternalError: 'Internal server error',
  // Sentiment history endpoint messages
  HistorySuccess: 'Sentiment history fetched successfully',
  HistoryFailed: 'No sentiment history found',
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