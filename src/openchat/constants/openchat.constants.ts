export const openChatResponseCodes = {
  OpenChatInitSuccess: 'OpenChatInitSuccess',
  OpenChatSuccess: 'OpenChatSuccess',
  InternalServerError: 'InternalServerError',
} as const;

export const openChatResponseMessages = {
  OpenChatInitSuccess: 'OpenChat initialization completed successfully',
  OpenChatInitStarted: 'OpenChat initialization started',
  OpenChatInitFailed: 'OpenChat initialization failed',
  OpenChatAssistantCreated: 'OpenChat assistant created:',
  OpenChatThreadCreated: 'OpenChat thread created:',
  OpenChatInitRequestBody: 'OpenChat Init Request Body:',
  OpenChatCreateAssistantError:'OpenChat createAssistantOpenAI error',
  OpenChatCreateThreadError:'OpenChat createThreadOpenAI error',
  OpenChatRequestBody: 'OpenChat Chat Request Body:',
  OpenChatSuccess: 'OpenChat message processed successfully',
  OpenChatFailed: 'OpenChat message processing failed',
  OpenChatHandlerError: 'OpenChat handler error',
} as const;

export const openChatInstructions = `You are SessionBot. Assist in managing multi-turn conversations, tracking context, and providing helpful responses. Keep replies concise and actionable.`;