export interface DispositionProviderCredentials {
  APIKey?: string;
  ProjectId?: string;
  ClientEmail?: string;
}

export interface DispositionDispatchOptions {
  conversation: string;
  dispositionList: string[];
  platform: string;
  creds: DispositionProviderCredentials;
}