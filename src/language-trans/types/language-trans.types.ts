export enum LanguageTransPlatformSID {
  LanguageTranslation = 'LanguageTranslation',
}

export interface TranslationSessionEntry {
  Token: string;
  TenantCode: string;
  ProcessCode: string;
  UXID: string;
  MessageID: string;
  Response: { TranslatedMessage: string; From?: string; To: string };
}

export interface TranslationDispatchOptions {
  message: string;
  to: string;
  from?: string;
  platform: string;
  creds: GoogleCloudCredentials;
}

// Credentials used for translation providers (Google Cloud Translate, OpenAI)
export interface GoogleCloudCredentials {
  APIKey?: string;
  ClientEmail?: string;
  ProjectId?: string;
}

// Standard handler signature to keep ai-handler methods consistent
export type TranslationHandlerFn = (
  prompt: string,
  message: string,
  to: string,
  creds: GoogleCloudCredentials,
) => Promise<string | null>;