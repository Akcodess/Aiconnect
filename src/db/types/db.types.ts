import type { DataSource } from 'typeorm';

// Tenant metadata from Nucleus
export type TenantInfo = { Name: string; Id: string; Code: string };

// Connect result for each tenant
export type TenantConnectResult = | { tenantCode: string; dataSource: DataSource; success: true } | { tenantCode: string; dataSource: null; success: false };

// Registry types for tenant connections
export interface TenantRecord { dataSource: DataSource; tenant: TenantInfo }
export interface DBRegistry {
  [tenantCodeLower: string]: TenantRecord;
}

// Nucleus API response types
export interface NucleusSignInResponse {
  AccessToken: string;
}

export interface authenticateWithNucleusResponse {
  tenantsList: TenantInfo[];
  accessToken: string;
}
export interface NucleusListTenantsResponse {
  Objects?: Array<{ Name: string; Id: string; Code: string }>;
}