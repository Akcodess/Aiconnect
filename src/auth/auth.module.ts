import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { TokenUtilityService } from '../common/utils/token.util';
import { LoggingService } from '../common/utils/logging.util';
import { ResponseHelperService } from '../common/helpers/response.helper';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenUtilityService,
    LoggingService,
    ResponseHelperService,
  ],
})
export class AuthModule {}