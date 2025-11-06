import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { AIHandlerService } from './ai-handler.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { TokenUtilityService } from '../common/utils/token.util';
import { SentimentUtilityService } from '../common/utils/sentiment.util';

@Module({
  imports: [ConfigModule],
  controllers: [SentimentController],
  providers: [
    SentimentService,
    AIHandlerService,
    AuthGuard,
    ResponseHelperService,
    LoggingService,
    TokenUtilityService,
    SentimentUtilityService,
  ],
  exports: [SentimentService]
})
export class SentimentModule {}
