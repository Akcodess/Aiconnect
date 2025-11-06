export interface CustomJwtPayload {
  platform?: string;
  services?: string;
  user?: string;
  tenant?: string;
  iat?: number;
  exp?: number;
}

export interface CustomJwtRequest extends Request {
  XPlatformID?: string;
  XPlatformSID?: string;
  XPlatformUA?: UserPlatformInfo;
  TenantCode?: string;
}

export interface UserPlatformInfo {
  APISecretKey?: string;
  ClientEmail?: string;
  ProjectId?: string;
}

export interface SentimentQueryDto {
  Message?: string;
  MessageID?: string;
  ReqId?: string;
  ReqCode?: string;
  UXID?: string;
  ProcessCode?: string;
  SentenceScore?: 'T' | 'F';
  OverallScore?: 'T' | 'F';
}

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

export interface ResponsePayload {
  success: boolean;
  message: string;
  code: string;
  data?: any;
  reqId?: string;
  reqCode?: string;
}

export enum PlatformSID {
  SentimentDetection = 'sentiment-detection'
}