import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { ConfigModule } from '@nestjs/config';

import { SessionController } from './session.controller';
import { TokenUtilityService } from '../common/utils/token.util';
import { LoggingService } from '../common/utils/logging.util';
import { ResponseHelperService } from '../common/helpers/response.helper';

@Module({
  imports: [ConfigModule],
  controllers: [SessionController],
  providers: [
    SessionService,
    TokenUtilityService,
    LoggingService,
    ResponseHelperService,
  ],
})
export class SessionModule {}