import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CommonController } from './common.controller';
import { CommonService } from './common.service';

import { TokenUtilityService } from './utils/token.util';
import { LoggingService } from './utils/logging.util';
import { ResponseHelperService } from './helpers/response.helper';
import { AiUtilService } from './utils/ai.util';

@Module({
  imports: [ConfigModule],
  controllers: [CommonController],
  providers: [CommonService, TokenUtilityService, LoggingService, ResponseHelperService, AiUtilService],
  exports: [CommonService, LoggingService, ResponseHelperService, TokenUtilityService, AiUtilService],
})
export class CommonModule {}