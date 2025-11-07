import { Injectable, BadRequestException } from '@nestjs/common';

import { TokenUtilityService } from './utils/token.util';
import { LoggingService } from './utils/logging.util';
import { ResponseHelperService } from './helpers/response.helper';
import { commonResponseCodes, commonResponseMessages, commonHealthOkText } from './constants/common.constants';

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

    this.logger.info(commonResponseMessages.VersionFetched);
    return this.responseHelper.successNest(
      commonResponseMessages.VersionFetched,
      commonResponseCodes.VersionInfoFetch,
      versionInfo,
      reqId,
      reqCode,
    );
  }

  async health(): Promise<any> {
    const healthData = { Text: commonHealthOkText, Status: 200 };
    this.logger.info(commonResponseMessages.HealthOk);
    return healthData;
  }

  async encrypt(data: any, reqId?: string, reqCode?: string): Promise<any> {
    if (!data) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages.EncryptFailed, commonResponseCodes.EncryptFailed, reqId, reqCode);
    }
    try {
      const ciphertext = this.tokenUtil.EncryptData(JSON.stringify(data));
      this.logger.info(commonResponseMessages.EncryptSuccess);
      return this.responseHelper.successNest(commonResponseMessages.EncryptSuccess, commonResponseCodes.EncryptSuccess, { EncryptData: ciphertext }, reqId, reqCode);
    } catch (error: any) {
      this.logger.error(commonResponseMessages.EncryptFailed, error?.message || error);
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages.EncryptFailed, commonResponseCodes.EncryptFailed, reqId, reqCode);
    }
  }
}