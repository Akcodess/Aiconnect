import { Module } from '@nestjs/common';

import { InsightController } from './insight.controller';
import { InsightService } from './insight.service';
import { InsightAIHandlerService } from './ai-handler.service';
import { CommonModule } from '../common/common.module';
import { ValkeyModule } from '../valkey/valkey.module';

@Module({
  imports: [CommonModule, ValkeyModule],
  controllers: [InsightController],
  providers: [InsightService, InsightAIHandlerService],
})
export class InsightModule {}