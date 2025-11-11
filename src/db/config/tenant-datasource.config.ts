import { DataSourceOptions } from 'typeorm';

export const baseTenantDataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  // Support both DB_PASSWORD and DB_PASS env names
  password: process.env.DB_PASS || '',
  // Entities are set explicitly in the service using class constructors
  synchronize: false,
  logging: false,
};