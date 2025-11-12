import 'reflect-metadata';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import axios, { AxiosInstance } from 'axios';

import KBStore from './entities/kb-store.entity';
import KBFile from './entities/kb-file.entity';
import KBAssistant from './entities/kb-assistant.entity';
import { LoggingService } from '../common/utils/logging.util';
import { baseTenantDataSourceOptions } from './config/tenant-datasource.config';
import type { TenantInfo, TenantConnectResult, DBRegistry, NucleusSignInResponse, NucleusListTenantsResponse, authenticateWithNucleusResponse } from './types/db.types';
import { dbMessages } from './constants/db.constants';

// Centralized log message constants moved to constants/log.constants.ts

@Injectable()
export class TenantDbService implements OnModuleInit {
  private registry: DBRegistry = {};
  private axios: AxiosInstance;

  constructor(private readonly logger: LoggingService, private readonly config: ConfigService) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const baseURL = this.config.get<string>('NUCLEUS_URL');

    this.axios = axios.create({
      baseURL,
      timeout: 25000,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.ConnectDB();
  }

  public async ConnectDB(): Promise<TenantConnectResult[]> {
    const dbBaseName = this.config.get<string>('DB_DATABASE')!;

    try {
      const { tenantsList } = await this.authenticateWithNucleus();

      const results: TenantConnectResult[] = await Promise.all(
        (tenantsList || []).map(async (tenant) => {
          const tenantDbName = `${dbBaseName}_${tenant.Code}`;

          try {
            await this.createDatabaseIfNotExists(tenantDbName);

            const entities = await this.loadEntities();
            const dsOptions: DataSourceOptions = {
              ...baseTenantDataSourceOptions,
              database: tenantDbName,
              entities,
            } as DataSourceOptions;
            const dataSource = new DataSource(dsOptions);

            await dataSource.initialize();

            this.registry[tenant?.Code.toLowerCase()] = { dataSource, tenant };
            this.logger.info(`${dbMessages?.ConnectedTenant} ${tenant.Code}`);
            return { tenantCode: tenant.Code, dataSource, success: true } as TenantConnectResult;
          } catch (err: any) {
            this.logger.error(`${dbMessages?.TenantConnectionFailed} ${tenant.Code}:`, err?.message || err);
            return { tenantCode: tenant.Code, dataSource: null, success: false } as TenantConnectResult;
          }
        })
      );

      this.logger.info(`${dbMessages?.DbConnectSuccessFor} ${results.filter((r) => r.success).length} tenants.`);
      return results;
    } catch (error: any) {
      this.logger.error(dbMessages?.DbConnectError, error?.message || error);
      throw error;
    }
  }

  private async authenticateWithNucleus(): Promise<authenticateWithNucleusResponse> {
    try {
      const signInResp = await this.axios.post<NucleusSignInResponse>('/sys-admin/sign-in', {
        LoginId: this.config.get<string>('NUCLEUS_LOGINID'),
        Password: this.config.get<string>('NUCLEUS_PASS'),
      });
      const accessToken = signInResp.data?.AccessToken;

      const listResp = await this.axios.get<NucleusListTenantsResponse>('/tenants', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const tenantsList: TenantInfo[] = listResp.data?.Objects?.map((t) => ({ Name: t.Name, Id: t.Id, Code: t.Code })) ?? [];

      return { tenantsList, accessToken };
    } catch (error: any) {
      this.logger.error(dbMessages?.NucleusError, error?.message || error);
      return { tenantsList: [], accessToken: '' };
    }
  }

  private async createDatabaseIfNotExists(dbName: string): Promise<void> {
    const tempOptions: DataSourceOptions = {
      ...baseTenantDataSourceOptions,
      name: `admin_${Date.now()}`,
      entities: [],
      synchronize: true,
    } as DataSourceOptions;
    const admin = new DataSource(tempOptions);

    try {
      await admin.initialize();
      await admin.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    } finally {
      if (admin.isInitialized) {
        await admin.destroy();
      }
    }
  }

  private async loadEntities(): Promise<Array<Function>> {
    return [KBStore, KBFile, KBAssistant];
  }

  public getTenantDataSource(code: string): DataSource | null {
    return this.registry[code.toLowerCase()]?.dataSource ?? null;
  }

  public getTenantInfo(code: string) {
    return this.registry[code.toLowerCase()]?.tenant ?? null;
  }
}