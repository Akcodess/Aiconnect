import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TranscribeController } from './transcribe.controller';
import { TranscribeService } from './transcribe.service';
import { TranscribeAIHandlerService } from './ai-handler.service';
import { AuthGuard } from '../common/guards/session.guard';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { TokenUtilityService } from '../common/utils/token.util';

@Module({
  imports: [ConfigModule],
  controllers: [TranscribeController],
  providers: [
    TranscribeService,
    TranscribeAIHandlerService,
    AuthGuard,
    ResponseHelperService,
    LoggingService,
    TokenUtilityService,
  ],
  exports: [TranscribeService],
})
export class TranscribeModule {}