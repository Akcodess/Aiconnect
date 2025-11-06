import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ValkeyConfigService } from './valkey.config';
import { LoggingService } from '../common/utils/logging.util';

@Module({
  imports: [ConfigModule],
  providers: [ValkeyConfigService, LoggingService],
  exports: [ValkeyConfigService],
})
export class ValkeyModule {}