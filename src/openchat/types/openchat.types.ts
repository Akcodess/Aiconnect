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