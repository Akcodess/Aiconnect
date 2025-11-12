import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { DataSource } from 'typeorm';

import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import type { CustomJwtRequest } from '../common/types/request.types';
import { TenantDbService } from '../db/tenant-db.service';
import KBStore from '../db/entities/kb-store.entity';
import KBFile from '../db/entities/kb-file.entity';
import KBAssistant from '../db/entities/kb-assistant.entity';
import { KbAIHandlerService } from './ai-handler.service';
import { KbPlatformSID } from './types/kb.types';
import { kbResponseMessages, kbResponseCodes } from './constants/kb.constants';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';
import type { KbInitResult, KbStoreSummary, KbDeleteResult } from './types/kb.types';
import { KbInitResponseEnvelopeDto, KbStoreListResponseEnvelopeDto, KbDeleteResponseEnvelopeDto } from './dto/kb.dto';
import type { KbInitDto, KbStoreListDto, KbDeleteDto } from './dto/kb.dto';

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
        // Directly call platform-specific KB init via handler ops (no dispatch wrapper)
        const ops = this.kbHandler.getOps(xplatform);
        const initResult = await ops?.KbInit?.(xplatform, { APIKey: apikey }) ?? null;
        if (!initResult) {
          throw new Error(kbResponseMessages.kbInitFailed);
        }

        const ds: DataSource | null = this.tenantDb.getTenantDataSource(tenantCode);
        const tenantInfo = this.tenantDb?.getTenantInfo(tenantCode);

        if (!ds) {
          throw new Error(kbResponseMessages.tenantDbUnavailable);
        }

        const repo = ds.getRepository(KBStore);
        const toSave = repo.create({
          KBUID: initResult?.KBUID,
          XPlatformID: initResult?.XPlatformID,
          XPRef: initResult?.XPRef,
          CreatedBy: Number(tenantInfo?.Id)
        });
        await repo.save(toSave);

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

  async getKb(req: CustomJwtRequest, dto: KbStoreListDto) {
    return this.execute<KbStoreSummary[]>(
      req,
      async ({ tenantCode }) => {
        const ds: DataSource | null = this.tenantDb.getTenantDataSource(tenantCode);

        const repo = ds?.getRepository(KBStore);
        const rows: KBStore[] | undefined = await repo?.find();
        const result: KbStoreSummary[] = (rows || []).map((r) => ({
          Id: r.Id,
          KBUID: r.KBUID,
          XPlatformID: r.XPlatformID,
          XPRef: r.XPRef,
          CreatedOn: r.CreatedOn,
          EditedOn: r.EditedOn,
        }));
        return result;
      },
      KbStoreListResponseEnvelopeDto,
      kbResponseMessages.storeListSuccess,
      kbResponseCodes.storeListSuccess,
      kbResponseMessages.storeListFailed,
      commonResponseCodes.InternalServerError,
      dto,
    );
  }

  async deleteKb(req: CustomJwtRequest, dto: KbDeleteDto) {
    return this.execute<KbDeleteResult>(
      req,
      async ({ xplatform, apikey, tenantCode }) => {
        const ds: DataSource | null = this.tenantDb.getTenantDataSource(tenantCode);
        const { id } = req.params as { id: string };

        // Get KB details
        const kbRepo = ds?.getRepository(KBStore);
        const kb = await kbRepo?.findOne({ where: { KBUID: id } });
        if (!kb) {
          this.logger.warn(kbResponseMessages.kbNotFound, id);
          throw new Error(kbResponseMessages.kbNotFound);
        }
        const KBUID = kb.KBUID;
        const XPRef = kb?.XPRef ?? {};

        // Delete files from OpenAI
        const fileRepo = ds?.getRepository(KBFile);
        const files = await fileRepo?.find({ where: { KBUID } });
        const fileIds = (files || []).map((f) => (f?.XPRef ? (f?.XPRef as any)?.FileId : undefined))

        const ops = this.kbHandler?.getOps(xplatform);

        for (const fileId of fileIds) {
          try {
            const ok = await ops?.KbFileDelete?.(xplatform, { APIKey: apikey }, fileId);
            if (ok) this.logger.info(kbResponseMessages.fileDeleteSuccess, fileId);
          } catch (e: any) {
            this.logger.warn(kbResponseMessages.fileDeleteFailed, `${fileId}: ${e?.message || e}`);
          }
        }

        // Delete vectorstore from OpenAI
        const vectorStoreId: string | undefined = (XPRef as any)?.VectorStoreId;
        if (vectorStoreId) {
          try {
            const ok = await ops?.VectorStoreDelete?.(xplatform, { APIKey: apikey }, vectorStoreId);
            if (ok) this.logger.info(kbResponseMessages.vectorStoreDeleteSuccess, vectorStoreId);
          } catch (e: any) {
            this.logger.warn(kbResponseMessages.vectorStoreDeleteFailed, `${vectorStoreId}: ${e?.message || e}`);
          }
        }

        // Delete assistant from OpenAI
        const assistantId: string | undefined = (XPRef as any)?.AssistantId;
        if (assistantId) {
          try {
            const ok = await ops?.AssistantDelete?.(xplatform, { APIKey: apikey }, assistantId);
            if (ok) this.logger.info(kbResponseMessages.assistantDeleteSuccess, assistantId);
          } catch (e: any) {
            this.logger.warn(kbResponseMessages.assistantDeleteFailed, `${assistantId}: ${e?.message || e}`);
          }
        }

        // Delete files from DB
        await fileRepo?.delete({ KBUID });
        // Delete assistant from DB
        const assistantRepo = ds?.getRepository(KBAssistant);
        await assistantRepo?.delete({ KBUID });
        // Delete KB details from DB
        await kbRepo?.delete({ KBUID });

        return { KBUID };
      },
      KbDeleteResponseEnvelopeDto,
      kbResponseMessages.deleteKbSuccess,
      kbResponseCodes.deleteKbSuccess,
      kbResponseMessages.deleteKbFailed,
      commonResponseCodes.InternalServerError,
      dto,
    );
  }
}