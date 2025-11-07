import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { SessionInitDto, SessionInitResponseDto, SessionEndResponseDto } from './dto/session.dto';
import { plainToInstance } from 'class-transformer';
import { TokenUtilityService } from '../common/utils/token.util';
import { LoggingService } from '../common/utils/logging.util';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { sessionResponseCodes, sessionResponseMessages, sessionLogRequestBody } from './constants/session.constants';

@Injectable()
export class SessionService {
  private readonly tenantList: any[];

  constructor(private readonly tokenUtil: TokenUtilityService, private readonly logger: LoggingService, private readonly responseHelper: ResponseHelperService) {
    const filePath = path.join(__dirname, '../', 'tenants-ua.json');
    this.tenantList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  // Initializes a session: validates tenant/user context, issues JWT, and
  // returns a standardized DTO response via ResponseHelper.
  async sessionInit(body: SessionInitDto): Promise<SessionInitResponseDto> {
    this.logger.info(sessionLogRequestBody, JSON.stringify(body));

    const { ReqId, ReqCode, XPlatformID, XPlatformSID, XPlatformUA, TenantCode } = body;

    let resolvedXPlatformID = XPlatformID;
    let encryptedUA = XPlatformUA;

    if (XPlatformID === process.env.FORCEAIPLATFORM) {
      const matchedUA = this.tenantList.find((entry: any) => entry?.XPUAKey === XPlatformUA);

      if (!matchedUA) {
        this.logger.error(sessionResponseMessages.InvalidTenant);
        this.responseHelper.failNest(BadRequestException, sessionResponseMessages.InvalidTenant, sessionResponseCodes.InvalidTenant, ReqId, ReqCode);
      }

      encryptedUA = this.tokenUtil.EncryptData(JSON.stringify(matchedUA?.XPUAProps));
      resolvedXPlatformID = matchedUA?.AIPlatform;
    }

    try {
      if (!this.tokenUtil.DecryptData(encryptedUA)) {
        this.logger.error(sessionResponseMessages.InvalidUser);
        this.responseHelper.failNest(BadRequestException, sessionResponseMessages.InvalidUser, sessionResponseCodes.InvalidUser, ReqId, ReqCode);
      }

      const payload = {
        platform: resolvedXPlatformID,
        services: XPlatformSID,
        user: this.tokenUtil.DecryptData(encryptedUA),
        tenant: TenantCode?.toLowerCase(),
      };

      const tokenResult = await this.tokenUtil.GenerateToken(payload);

      if (!tokenResult) {
        this.responseHelper.failNest(InternalServerErrorException, sessionResponseMessages.SessionInitFailed, sessionResponseCodes.SessionInitFailed, ReqId, ReqCode);
      }

      const { token, expTime } = tokenResult;
      this.logger.info(sessionResponseMessages.SessionInitSuccess);

      // Wrap with class-transformer to apply @Expose/@Transform on the DTO
      return plainToInstance(
        SessionInitResponseDto, this.responseHelper.successNest(sessionResponseMessages.SessionInitSuccess, sessionResponseCodes.SessionInitSuccess, { Token: token, ExpiresIn: expTime },
          ReqId, ReqCode), { excludeExtraneousValues: true }
      );
    } catch (error: any) {
      this.logger.error(sessionResponseMessages.SessionInitFailed, JSON.stringify(error?.response?.data) || error.message);
      return this.responseHelper.failNest(InternalServerErrorException, sessionResponseMessages.SessionInitFailed, sessionResponseCodes.SessionInitFailed, ReqId, ReqCode);
    }
  }

  // Ends a session: verifies JWT, blacklists token, and returns the
  // session-end response. Success shape includes Message, TimeStamp, EvCode, EvType.
  async sessionEnd(token: string, reqId?: string, reqCode?: string): Promise<SessionEndResponseDto> {
    if (!token) {
      this.logger.error(sessionResponseMessages.MissingToken);
      this.responseHelper.failNest(BadRequestException, sessionResponseMessages.MissingToken, sessionResponseCodes.MissingToken, reqId, reqCode);
    }

    try {
      const decoded = this.tokenUtil.VerifyToken(token);
      if (!decoded) {
        this.logger.error(sessionResponseMessages.TokenInvalid);
        this.responseHelper.failNest(UnauthorizedException, sessionResponseMessages.TokenInvalid, sessionResponseCodes.TokenInvalid, reqId, reqCode);
      }

      this.logger.info(sessionResponseMessages.SessionEndSuccess, JSON.stringify(decoded));
      this.tokenUtil.AddExpiredToken(token);
      this.logger.info(sessionResponseMessages.SessionEndSuccess);

      return plainToInstance(SessionEndResponseDto, this.responseHelper.successNest(sessionResponseMessages.SessionEndSuccess, sessionResponseCodes.SessionEndSuccess, {}, reqId, reqCode), { excludeExtraneousValues: true });
    } catch (error: any) {
      this.logger.error(sessionResponseMessages.TokenInvalid, JSON.stringify(error?.response?.data) || error.message);
      return this.responseHelper.failNest(UnauthorizedException, sessionResponseMessages.TokenInvalid, sessionResponseCodes.TokenInvalid, reqId, reqCode);
    }
  }
}