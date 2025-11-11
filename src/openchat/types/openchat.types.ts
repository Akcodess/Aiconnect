export const OpenChatPlatformSID = {
  OpenChat: 'OpenChat',
} as const;

export type OpenChatPlatformSIDType = typeof OpenChatPlatformSID[keyof typeof OpenChatPlatformSID];

export type OpenChatInitInput = {
  APIKey?: string;
  ReqCode: string;
  ProcessCode?: string;
  ContactId?: string;
  XPlatformID: string;
};

export type OpenChatChatInput = {
  APIKey?: string;
  Message: string;
  AssistantId: string;
  ThreadId: string;
  ReqCode: string;
  XPlatformID: string;
};

export type OpenChatChatResult = {
  ThreadId: string;
  AssistantId: string;
  reply?: any;
  messages?: Array<{ role: string; content: any }>;
};