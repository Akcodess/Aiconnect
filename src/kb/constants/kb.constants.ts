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
  fileListSuccess: 'KB File fetched successfully',
  fileListFailed: 'KB File fetch failed',
  kbFileNotFound: 'No KB File found for KBUID:',
  // File upload
  fileUploadStarted: 'KB file upload started',
  fileUploadSuccess: 'KB file uploaded successfully',
  fileUploadFailed: 'KB File Upload Error:',
  // Delete
  deleteKbStarted: 'KB delete started',
  deleteKbSuccess: 'KB deleted successfully',
  deleteKbFailed: 'KB delete failed',
  fileDeleteSuccess: 'KB File deleted successfully',
  fileDeleteFailed: 'KB File delete failed',
  vectorStoreDeleteSuccess: 'KB vector store deleted',
  vectorStoreDeleteFailed: 'KB vector store delete failed',
  assistantDeleteSuccess: 'KB assistant deleted',
  assistantDeleteFailed: 'KB assistant delete failed',
  // Vector store file linking
  vectorStoreFileSuccess: 'KB VectorStore file mapped successfully',
  vectorStoreFileFailed: 'KB VectorStore file mapping failed',
  // Vector store file delete
  vectorStoreFileDeleteSuccess: 'KB VectorStore file mapping deleted successfully',
  vectorStoreFileDeleteFailed: 'KB VectorStore file mapping delete failed',
  // Assistant creation
  assistantCreateSuccess: 'KB Assistant created successfully',
  assistantCreateFailed: 'KB Assistant creation failed',
} as const;

export const kbResponseCodes = {
  kbInitSuccess: 'KBInitSuccess',
  storeListSuccess: 'GetKbSuccess',
  fileListSuccess: 'KbFileGetSuccess',
  fileUploadSuccess: 'KbFileUploadSuccess',
  fileDeleteSuccess: 'KbFileDeleteSuccess',
  deleteKbSuccess: 'DeleteKbSuccess',
  vectorStoreFileSuccess: 'VectorStoreFileSuccess',
  vectorStoreFileDeleteSuccess: 'VectorstoreFileDeleteSuccess',
  internalServerError: 'InternalServerError',
  // Assistant creation
  assistantCreateSuccess: 'AssistantCreationSuccess',
} as const;