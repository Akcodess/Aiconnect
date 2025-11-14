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
  assistantDeleteSuccess: 'Assistant deleted successfully',
  assistantDeleteFailed: 'KB Assistant delete failed',
  // Vector store file linking
  vectorStoreFileSuccess: 'KB VectorStore file mapped successfully',
  vectorStoreFileFailed: 'KB VectorStore file mapping failed',
  // Vector store file delete
  vectorStoreFileDeleteSuccess: 'KB VectorStore file mapping deleted successfully',
  vectorStoreFileDeleteFailed: 'KB VectorStore file mapping delete failed',
  // Assistant creation
  assistantCreateSuccess: 'KB Assistant created successfully',
  assistantCreateFailed: 'KB Assistant creation failed',
  // Assistant listing
  assistantListSuccess: 'KB Assistants fetched successfully',
  assistantListFailed: 'KB assistants fetch failed',
  assistantsNotFound: 'No assistants found for KBUID:',
  // Assistant update
  assistantUpdateSuccess: 'KB Assistant updated successfully',
  assistantUpdateFailed: 'KB Assistant update setting failed',
  // Thread creation
  threadCreateSuccess: 'KB Thread created successfully',
  threadCreateFailed: 'KB Thread creation failed',
  // Run message
  runMessageSuccess: 'KB Run message completed successfully',
  runMessageFailed: 'KB Run message failed',
  // Run status
  runStatusSuccess: 'KB Get run status completed successfully',
  runStatusFailed: 'KB Get run status failed',
  // Messages get
  messagesGetSuccess: 'KB Get messages completed successfully',
  messagesGetFailed: 'KB Get messages failed',
} as const;

export const kbResponseCodes = {
  kbInitSuccess: 'KBInitSuccess',
  storeListSuccess: 'GetKbSuccess',
  fileListSuccess: 'KbFileGetSuccess',
  fileUploadSuccess: 'KbFileUploadSuccess',
  fileDeleteSuccess: 'KbFileDeleteSuccess',
  deleteKbSuccess: 'DeleteKbSuccess',
  assistantDeleteSuccess: 'AssistantDeleteSuccess',
  vectorStoreFileSuccess: 'VectorStoreFileSuccess',
  vectorStoreFileDeleteSuccess: 'VectorstoreFileDeleteSuccess',
  internalServerError: 'InternalServerError',
  assistantCreateSuccess: 'AssistantCreationSuccess',
  assistantUpdateSuccess: 'AssistantUpdateSuccess',
  assistantListSuccess: 'GetAssistantsSuccess',
  threadCreateSuccess: 'KBThreadCreationSuccess',
  runMessageSuccess: 'KBRunMessageSuccess',
  runStatusSuccess: 'KBGetRunStatusSuccess',
  messagesGetSuccess: 'KBGetMessagesSuccess',
} as const;