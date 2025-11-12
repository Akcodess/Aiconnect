import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import type { CustomJwtRequest } from '../common/types/request.types';
import { TenantDbService } from '../db/tenant-db.service';
import KBStore from '../db/entities/kb-store.entity';
import { KbAIHandlerService } from './ai-handler.service';
import { KbPlatformSID } from './types/kb.types';
import { kbResponseMessages, kbResponseCodes } from './constants/kb.constants';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';
import type { KbInitResult } from './types/kb.types';
import { KbInitResponseEnvelopeDto } from './dto/kb.dto';
import type { KbInitDto } from './dto/kb.dto';

@Injectable()
export class KbService {
  constructor(
    private readonly responseHelper: ResponseHelperService,
    private readonly logger: LoggingService,
    private readonly tenantDb: TenantDbService,
    private readonly kbHandler: KbAIHandlerService,
  ) { }

  // Common execution wrapper for KB endpoints: validates SID, logs, and standardizes response handling
  private async execute<T>(
    req: CustomJwtRequest,
    handlerFn: (ctx: { req: CustomJwtRequest; xplatform: string; apikey?: string; tenantCode: string }) => Promise<T>,
    envelopeCtor: new (...args: any[]) => any,
    successMsg: string, successCode: string, failureMsg: string, failureCode: string, dto?: { ReqId?: string; ReqCode?: string },
  ) {
    const { ReqId, ReqCode } = dto ?? (req.method !== 'POST' ? (req.query as Record<string, string>) : (req.body as Record<string, string>));

    const xplatform = req.XPlatformID as string;
    const apikey = req.XPlatformUA?.APISecretKey;
    const tenantCode = req.TenantCode!;
    const xplatformSID = req.XPlatformSID;

    this.logger.info('Request Query:', JSON.stringify(req.query));
    this.logger.info('Request Body:', JSON.stringify(req.body));

    // SID validation for KB endpoints
    if (xplatformSID !== KbPlatformSID.KB) {
      this.logger.warn(commonResponseMessages?.SidMismatch);
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages.SidMismatch, commonResponseCodes.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const result = await handlerFn({ req, xplatform, apikey, tenantCode });
      this.logger.info(successMsg);
      return plainToInstance(envelopeCtor, this.responseHelper.successNest(successMsg, successCode, result, ReqId, ReqCode));
    } catch (error: any) {
      this.logger.error(failureMsg, error?.message || error);
      return this.responseHelper.failNest(InternalServerErrorException, failureMsg, failureCode, ReqId, ReqCode);
    }
  }

  async init(req: CustomJwtRequest, dto: KbInitDto) {
    return this.execute<KbInitResult | null>(
      req,
      async ({ xplatform, apikey, tenantCode }) => {
        // Dispatch to platform-specific KB init via handler
        const initResult = await this.kbHandler.dispatch({ platform: xplatform, creds: { APIKey: apikey } });

        const ds: any = this.tenantDb?.getTenantDataSource(tenantCode);
        const tenantInfo = this.tenantDb?.getTenantInfo(tenantCode);

        const repo = ds?.getRepository(KBStore);
        const toSave = repo?.create({
          KBUID: initResult?.KBUID,
          XPlatformID: initResult?.XPlatformID,
          XPRef: initResult?.XPRef,
          CreatedBy: Number(tenantInfo?.Id)
        });
        await repo?.save(toSave);

        return initResult;
      },
      KbInitResponseEnvelopeDto,
      kbResponseMessages.kbInitSuccess,
      kbResponseCodes.kbInitSuccess,
      kbResponseMessages.kbInitFailed,
      commonResponseCodes.InternalServerError,
      dto,
    );
  }
}