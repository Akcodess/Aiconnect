// Platform SID values used to validate requests hitting KB endpoints
export enum KbPlatformSID { KB = 'KB' }

// Standard status for KB resources
export enum KbStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

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
  KbFileUpload?: (platform: string, creds: KbHandlerCreds, input: KbFileUploadInput) => Promise<KbFileUploadResult | null>;
  KbFileDelete?: (platform: string, creds: KbHandlerCreds, fileId: string) => Promise<boolean>;
  VectorStoreDelete?: (platform: string, creds: KbHandlerCreds, vectorStoreId: string) => Promise<boolean>;
  AssistantDelete?: (platform: string, creds: KbHandlerCreds, assistantId: string) => Promise<boolean>;
  AssistantCreate?: (platform: string, creds: KbHandlerCreds, input: KbAssistantCreateInput) => Promise<KbAssistantCreateResult | null>;
  AssistantUpdate?: (platform: string, creds: KbHandlerCreds, input: KbAssistantUpdateInput) => Promise<KbAssistantUpdateResult | null>;
  VectorStoreFileCreate?: (platform: string, creds: KbHandlerCreds, input: KbVectorStoreFileInput) => Promise<KbVectorStoreFileResult | null>;
  VectorStoreFileDelete?: (platform: string, creds: KbHandlerCreds, input: KbVectorStoreFileInput) => Promise<KbVectorStoreFileResult | null>;
  ThreadCreate?: (platform: string, creds: KbHandlerCreds) => Promise<KbThreadCreateResult | null>;
  RunMessage?: (platform: string, creds: KbHandlerCreds, input: KbRunMessageInput) => Promise<KbRunMessageResult | null>;
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

export interface KbAssistantSummary {
  Id: number;
  KBUID: string;
  Name: string;
  Instructions: string;
  XPRef: Record<string, any>;
  CreatedOn: Date;
  EditedOn: Date;
}

export interface KbDeleteResult {
  KBUID: string;
}

// Input for KB file upload
export interface KbFileUploadInput {
  KBUID: string;
  FileName: string;
  FileURL: string;
}

// Result for KB file upload
export interface KbFileUploadResult {
  KBUID: string;
  FileName: string;
  FileURL: string;
  XPRef: Record<string, any>;
}

// Params for OpenAI KB file upload (includes APIKey)
export interface KbFileUploadOpenAIParams extends KbFileUploadInput {
  APIKey: string;
}

// Result for KB file delete
export interface KbFileDeleteResult {
  FileId: string;
  Deleted: boolean;
}

// Input for KB assistant creation
export interface KbAssistantCreateInput {
  KBUID: string;
  Name: string;
  Instructions: string;
  VectorStoreId: string;
}

// Result for KB assistant creation
export interface KbAssistantCreateResult {
  Code: string;
  KBUID: string;
  Name: string;
  Instructions: string;
  XPRef: Record<string, any>;
}

// Input for KB assistant update
export interface KbAssistantUpdateInput {
  AssistantId: string;
  Instructions: string;
}

// Result for KB assistant update
export interface KbAssistantUpdateResult {
  AssistantId: string;
  Instructions: string;
}

// Result for KB assistant delete
export interface KbAssistantDeleteResult {
  AssistantId: string;
  Deleted: boolean;
}

// Input for linking files to a vector store
export interface KbVectorStoreFileInput {
  VectorStoreId: string;
  FileIds: string[];
}

// Result of linking files to a vector store
export interface KbVectorStoreFileResult {
  VectorStoreId: string;
  FileIds: string[];
}

// Result for KB Thread creation
export interface KbThreadCreateResult {
  threadId: string;
}

// Input for running a message on a thread with an assistant
export interface KbRunMessageInput {
  Message: string;
  ThreadId: string;
  AssistantId: string;
}

// Result for running a message
export interface KbRunMessageResult {
  ThreadId: string;
  RunId: string;
}