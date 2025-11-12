// Platform SID values used to validate requests hitting KB endpoints
export enum KbPlatformSID { KB = 'KB' }

export interface KbInitResult {
  KBUID: string;
  XPlatformID: string;
  XPRef: Record<string, any>;
}

// Credentials container used by KB AI handler
export interface KbHandlerCreds {
  APIKey?: string;
  ClientEmail?: string;
  ProjectId?: string;
}

// Dispatch options for KB init AI handler
export interface KbInitDispatchOptions {
  platform: string;
  creds: KbHandlerCreds;
}

// Interface for per-platform KB operations implemented by handler service
export interface KbHandlerOps {
  KbInit: (platform: string, creds: KbHandlerCreds) => Promise<KbInitResult | null>;
  KbFileDelete?: (platform: string, creds: KbHandlerCreds, fileId: string) => Promise<boolean>;
  VectorStoreDelete?: (platform: string, creds: KbHandlerCreds, vectorStoreId: string) => Promise<boolean>;
  AssistantDelete?: (platform: string, creds: KbHandlerCreds, assistantId: string) => Promise<boolean>;
}

export interface KbStoreSummary {
  Id: number;
  KBUID: string;
  XPlatformID: string;
  XPRef: Record<string, any>;
  CreatedOn: Date;
  EditedOn: Date;
}

export interface KbFileSummary {
  Id: number;
  KBUID: string;
  FileName: string;
  FileURL: string;
  XPRef: Record<string, any>;
  CreatedOn: Date;
  EditedOn: Date;
}

export interface KbDeleteResult {
  KBUID: string;
}