import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { SessionInitDto, SessionInitResponseDto, SessionEndResponseDto } from './dto/auth.dto';
import { plainToInstance } from 'class-transformer';
import { TokenUtilityService } from '../common/utils/token.util';
import { LoggingService } from '../common/utils/logging.util';
import { ResponseCodes, ResponseMessages } from './enums/auth-response.enums';
import { ResponseHelperService } from '../common/helpers/response.helper';

@Injectable()
export class AuthService {
  private readonly tenantList: any[];

  constructor(private readonly tokenUtil: TokenUtilityService, private readonly logger: LoggingService, private readonly responseHelper: ResponseHelperService) {
    const filePath = path.join(__dirname, '../', 'tenants-ua.json');
    this.tenantList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  // Initializes a session: validates tenant/user context, issues JWT, and
  // returns a standardized DTO response via ResponseHelper.
  async sessionInit(body: SessionInitDto): Promise<SessionInitResponseDto> {
    this.logger.info('Request Body:', JSON.stringify(body));

    const { ReqId, ReqCode, XPlatformID, XPlatformSID, XPlatformUA, TenantCode } = body;

    let resolvedXPlatformID = XPlatformID;
    let encryptedUA = XPlatformUA;

    if (XPlatformID === process.env.FORCEAIPLATFORM) {
      const matchedUA = this.tenantList.find((entry: any) => entry?.XPUAKey === XPlatformUA);

      if (!matchedUA) {
        this.logger.error(ResponseMessages.InvalidTenant);
        this.responseHelper.failNest(BadRequestException, ResponseMessages.InvalidTenant, ResponseCodes.InvalidTenant, ReqId, ReqCode);
      }

      encryptedUA = this.tokenUtil.EncryptData(JSON.stringify(matchedUA?.XPUAProps));
      resolvedXPlatformID = matchedUA?.AIPlatform;
    }

    try {
      if (!this.tokenUtil.DecryptData(encryptedUA)) {
        this.logger.error(ResponseMessages.InvalidUser);
        this.responseHelper.failNest(BadRequestException, ResponseMessages.InvalidUser, ResponseCodes.InvalidUser, ReqId, ReqCode);
      }

      const payload = {
        platform: resolvedXPlatformID,
        services: XPlatformSID,
        user: this.tokenUtil.DecryptData(encryptedUA),
        tenant: TenantCode?.toLowerCase(),
      };

      const tokenResult = await this.tokenUtil.GenerateToken(payload);

      if (!tokenResult) {
        this.responseHelper.failNest(InternalServerErrorException, ResponseMessages.SessionInitFailed, ResponseCodes.SessionInitFailed, ReqId, ReqCode);
      }

      const { token, expTime } = tokenResult;
      this.logger.info(ResponseMessages.SessionInitSuccess);

      // Wrap with class-transformer to apply @Expose/@Transform on the DTO
      return plainToInstance(
        SessionInitResponseDto,
        this.responseHelper.successNest(
          ResponseMessages.SessionInitSuccess,
          ResponseCodes.SessionInitSuccess,
          { Token: token, ExpiresIn: expTime },
          ReqId,
          ReqCode,
        ),
        { excludeExtraneousValues: true },
      );
    } catch (error: any) {
      this.logger.error(ResponseMessages.SessionInitFailed, JSON.stringify(error?.response?.data) || error.message);
      return this.responseHelper.failNest(InternalServerErrorException, ResponseMessages.SessionInitFailed, ResponseCodes.SessionInitFailed, ReqId, ReqCode);
    }
  }

  // Ends a session: verifies JWT, blacklists token, and returns the
  // session-end response. Success shape includes Message, TimeStamp, EvCode, EvType.
  async sessionEnd(token: string, reqId?: string, reqCode?: string): Promise<SessionEndResponseDto> {
    if (!token) {
      this.logger.error(ResponseMessages.MissingToken);
      this.responseHelper.failNest(BadRequestException, ResponseMessages.MissingToken, ResponseCodes.MissingToken, reqId, reqCode);
    }

    try {
      const decoded = this.tokenUtil.VerifyToken(token);
      if (!decoded) {
        this.logger.error(ResponseMessages.TokenInvalid);
        this.responseHelper.failNest(UnauthorizedException, ResponseMessages.TokenInvalid, ResponseCodes.TokenInvalid, reqId, reqCode);
      }

      this.logger.info(ResponseMessages.SessionEndSuccess, JSON.stringify(decoded));
      this.tokenUtil.AddExpiredToken(token);
      this.logger.info(ResponseMessages.SessionEndSuccess);

      return plainToInstance(SessionEndResponseDto, this.responseHelper.successNest(ResponseMessages.SessionEndSuccess, ResponseCodes.SessionEndSuccess, {}, reqId, reqCode), { excludeExtraneousValues: true });
    } catch (error: any) {
      this.logger.error(ResponseMessages.TokenInvalid, JSON.stringify(error?.response?.data) || error.message);
      return this.responseHelper.failNest(UnauthorizedException, ResponseMessages.TokenInvalid, ResponseCodes.TokenInvalid, reqId, reqCode);
    }
  }
}