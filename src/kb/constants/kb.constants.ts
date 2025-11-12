// Constants for KB module
export const kbResponseMessages = {
  storeListRequestBody: 'KB store list request received',
  storeListStarted: 'KB store list started',
  storeListSuccess: 'KB store list success',
  storeListFailed: 'KB store list failed',
  fileListRequestBody: 'KB file list request received',
  fileListStarted: 'KB file list started',
  fileListSuccess: 'KB file list success',
  fileListFailed: 'KB file list failed',
} as const;

export const kbResponseCodes = {
  storeListSuccess: 'KBStoreListSuccess',
  fileListSuccess: 'KBFileListSuccess',
  internalServerError: 'InternalServerError',
} as const;