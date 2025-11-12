import { DataSourceOptions } from 'typeorm';

// MySQL-only base options shared by tenant connections
export const baseTenantDataSourceOptions: DataSourceOptions = {
  type: process.env.DIALECT as any,
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER!,
  password: process.env.DB_PASS,
  synchronize: true,
};