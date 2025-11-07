import type { Request } from 'express';

export interface UserPlatformInfo {
  APISecretKey?: string;
  ClientEmail?: string;
  ProjectId?: string;
}

export interface CustomJwtRequest extends Request {
  XPlatformID?: string;
  XPlatformSID?: string;
  XPlatformUA?: UserPlatformInfo;
  TenantCode?: string;
}