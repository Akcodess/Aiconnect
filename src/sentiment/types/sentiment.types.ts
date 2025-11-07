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

export enum PlatformSID {
  SentimentDetection = 'SentimentDetection'
}