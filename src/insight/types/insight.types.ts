export const InsightPlatformSID = {
  Summarization: 'Summarization',
} as const;

export type InsightPlatformSIDType = typeof InsightPlatformSID[keyof typeof InsightPlatformSID];

export type InsightHandlerCreds = {
  APIKey?: string;
  ClientEmail?: string;
  ProjectId?: string;
};

export type InsightDispatchInput = {
  prompt: string;
  platform: string;
  creds: InsightHandlerCreds;
};