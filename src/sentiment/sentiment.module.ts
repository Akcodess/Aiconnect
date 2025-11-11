import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { AIHandlerService } from './ai-handler.service';
import { AuthGuard } from '../common/guards/session.guard';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { TokenUtilityService } from '../common/utils/token.util';
import { SentimentUtilityService } from './utils/sentiment.util';
import { AiUtilService } from '../common/utils/ai.util';
import { ValkeyModule } from '../valkey/valkey.module';
// Removed CommonModule import to localize sentiment-specific utilities

@Module({
  imports: [ConfigModule, ValkeyModule],
  controllers: [SentimentController],
  providers: [
    SentimentService,
    AIHandlerService,
    AuthGuard,
    ResponseHelperService,
    LoggingService,
    TokenUtilityService,
    SentimentUtilityService,
    AiUtilService,
  ],
  exports: [SentimentService]
})
export class SentimentModule { }
