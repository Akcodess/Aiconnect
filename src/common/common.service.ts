import { Injectable, BadRequestException } from '@nestjs/common';

import { TokenUtilityService } from './utils/token.util';
import { LoggingService } from './utils/logging.util';
import { ResponseHelperService } from './helpers/response.helper';
import { CommonResponseCodes, CommonResponseMessages } from './enums/common-response.enums';

@Injectable()
export class CommonService {
  constructor(
    private readonly tokenUtil: TokenUtilityService,
    private readonly logger: LoggingService,
    private readonly responseHelper: ResponseHelperService,
  ) {}

  async getVersion(reqId?: string, reqCode?: string): Promise<any> {
    const versionInfo = {
      Version: {
        ReleaseVersion: process.env.BUILD_NUMBER ?? '',
        ReleaseDate: process.env.RELEASE_DATE ?? '',
        Name: process.env.AICONNECT_V ?? '',
      },
    };

    this.logger.info(CommonResponseMessages.VersionFetched);
    return this.responseHelper.successNest(
      CommonResponseMessages.VersionFetched,
      CommonResponseCodes.VersionInfoFetch,
      versionInfo,
      reqId,
      reqCode,
    );
  }

  async health(): Promise<any> {
    const healthData = { Text: 'OK', Status: 200 };
    this.logger.info(CommonResponseMessages.HealthOk);
    return healthData;
  }

  async encrypt(data: any, reqId?: string, reqCode?: string): Promise<any> {
    if (!data) {
      return this.responseHelper.failNest(BadRequestException, CommonResponseMessages.EncryptFailed, CommonResponseCodes.EncryptFailed, reqId, reqCode);
    }
    try {
      const ciphertext = this.tokenUtil.EncryptData(JSON.stringify(data));
      this.logger.info(CommonResponseMessages.EncryptSuccess);
      return this.responseHelper.successNest(CommonResponseMessages.EncryptSuccess, CommonResponseCodes.EncryptSuccess, { EncryptData: ciphertext }, reqId, reqCode);
    } catch (error: any) {
      this.logger.error(CommonResponseMessages.EncryptFailed, error?.message || error);
      return this.responseHelper.failNest(BadRequestException, CommonResponseMessages.EncryptFailed, CommonResponseCodes.EncryptFailed, reqId, reqCode);
    }
  }
}