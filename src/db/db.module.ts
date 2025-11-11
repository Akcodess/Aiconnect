import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { TenantDbService } from './tenant-db.service';

@Module({
  imports: [ConfigModule, CommonModule],
  providers: [TenantDbService],
  exports: [TenantDbService],
})
export class DBModule {}