// Constants for KB module
export const kbResponseMessages = {
  // Init
  kbInitRequestBody: 'KB init request received',
  kbInitStarted: 'KB init started',
  kbInitSuccess: 'KB Init successfully',
  kbInitFailed: 'KB init failed',
  tenantDbUnavailable: 'Tenant database is not available',
  kbNotFound: 'KB not found',
  // Store listing
  storeListRequestBody: 'KB store list request received',
  storeListStarted: 'KB store list started',
  storeListSuccess: 'KB fetched successfully',
  storeListFailed: 'KB fetch failed',
  // File listing
  fileListRequestBody: 'KB file list request received',
  fileListStarted: 'KB file list started',
  fileListSuccess: 'KB file list success',
  fileListFailed: 'KB file list failed',
  // File upload
  fileUploadStarted: 'KB file upload started',
  fileUploadSuccess: 'KB file uploaded successfully',
  fileUploadFailed: 'KB File Upload Error:',
  // Delete
  deleteKbStarted: 'KB delete started',
  deleteKbSuccess: 'KB deleted successfully',
  deleteKbFailed: 'KB delete failed',
  fileDeleteSuccess: 'KB file deleted',
  fileDeleteFailed: 'KB file delete failed',
  vectorStoreDeleteSuccess: 'KB vector store deleted',
  vectorStoreDeleteFailed: 'KB vector store delete failed',
  assistantDeleteSuccess: 'KB assistant deleted',
  assistantDeleteFailed: 'KB assistant delete failed',
} as const;

export const kbResponseCodes = {
  kbInitSuccess: 'KBInitSuccess',
  storeListSuccess: 'GetKbSuccess',
  fileListSuccess: 'KBFileListSuccess',
  fileUploadSuccess: 'KbFileUploadSuccess',
  deleteKbSuccess: 'DeleteKbSuccess',
  internalServerError: 'InternalServerError',
} as const;