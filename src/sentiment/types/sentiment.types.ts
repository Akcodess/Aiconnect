export interface SentimentResponse {
  OverallCategory?: string;
  OverallScore?: number;
  SentenceScore?: Record<string, any>;
  AverageScore?: number;
}

export interface SessionEntry {
  Token: string;
  TenantCode: string;
  ProcessCode: string;
  UXID: string;
  MessageID: string;
  SentenceScore?: 'T' | 'F';
  OverallScore?: 'T' | 'F';
  Response: SentimentResponse;
}

export interface AIHandlerParams {
  Message: string;
  APIKey?: string;
  ClientEmail?: string;
  ProjectId?: string;
  SentenceScore?: 'T' | 'F';
}

export interface AIHandlerParamsSentimenrtTextChat {
  // Accept either a single string or a map of speaker -> text
  Message: string | Record<string, string>;
  APIKey?: string;
  ClientEmail?: string;
  ProjectId?: string;
  SentenceScore?: 'T' | 'F';
}

export enum PlatformSID {
  SentimentDetection = 'SentimentDetection'
}

export interface TextChatSpeakerSentiment {
  OverallCategory: string;
  OverallScore: number;
  SentenceScore: Record<number, { Category: string; Score: number }>;
}

export interface SentimentTextChatResponse {
  Sentiment: Record<string, TextChatSpeakerSentiment>;
  AverageScore: number;
}

export interface SessionEntryTextChat {
  Token: string;
  TenantCode: string;
  ProcessCode: string;
  UXID: string;
  MessageID: string;
  Response: SentimentTextChatResponse;
}