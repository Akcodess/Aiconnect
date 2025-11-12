// Platform SID values used to validate requests hitting KB endpoints
export enum KbPlatformSID {
  KBStores = 'KBStores',
  KBFiles = 'KBFiles',
}

export type KbStoreSummary = {
  Id: number;
  KBUID: string;
  XPlatformID: string;
  XPRef: Record<string, any>;
  CreatedOn: Date;
  EditedOn: Date;
};

export type KbFileSummary = {
  Id: number;
  KBUID: string;
  FileName: string;
  FileURL: string;
  XPRef: Record<string, any>;
  CreatedOn: Date;
  EditedOn: Date;
};