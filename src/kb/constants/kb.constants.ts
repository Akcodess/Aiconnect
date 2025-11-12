// Constants for KB module
export const kbResponseMessages = {
  // Init
  kbInitRequestBody: 'KB init request received',
  kbInitStarted: 'KB init started',
  kbInitSuccess: 'KB init success',
  kbInitFailed: 'KB init failed',
  // Store listing
  storeListRequestBody: 'KB store list request received',
  storeListStarted: 'KB store list started',
  storeListSuccess: 'KB store list success',
  storeListFailed: 'KB store list failed',
  // File listing
  fileListRequestBody: 'KB file list request received',
  fileListStarted: 'KB file list started',
  fileListSuccess: 'KB file list success',
  fileListFailed: 'KB file list failed',
} as const;

export const kbResponseCodes = {
  kbInitSuccess: 'KBInitSuccess',
  storeListSuccess: 'KBStoreListSuccess',
  fileListSuccess: 'KBFileListSuccess',
  internalServerError: 'InternalServerError',
} as const;