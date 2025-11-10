import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ValkeyModule } from '../valkey/valkey.module';

import { DispositionController } from './disposition.controller';
import { DispositionService } from './disposition.service';
import { DispositionAIHandlerService } from './ai-handler.service';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { OpenAIService } from '../common/utils/openai.util';
import { TokenUtilityService } from '../common/utils/token.util';
import { AuthGuard } from '../common/guards/session.guard';

@Module({
  imports: [ConfigModule, ValkeyModule],
  controllers: [DispositionController],
  providers: [
    DispositionService,
    DispositionAIHandlerService,
    ResponseHelperService,
    LoggingService,
    OpenAIService,
    TokenUtilityService,
    AuthGuard,
  ],
})
export class DispositionModule {}