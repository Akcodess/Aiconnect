import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LanguageTransController } from './language-trans.controller';
import { LanguageTransService } from './language-trans.service';
import { LanguageTransAIHandlerService } from './ai-handler.service';
import { AuthGuard } from '../common/guards/session.guard';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { TokenUtilityService } from '../common/utils/token.util';
import { AiUtilService } from '../common/utils/ai.util';
import { ValkeyModule } from '../valkey/valkey.module';

@Module({
  imports: [ConfigModule, ValkeyModule],
  controllers: [LanguageTransController],
  providers: [
    LanguageTransService,
    LanguageTransAIHandlerService,
    AuthGuard,
    ResponseHelperService,
    LoggingService,
    TokenUtilityService,
    AiUtilService,
  ],
  exports: [LanguageTransService],
})
export class LanguageTransModule {}