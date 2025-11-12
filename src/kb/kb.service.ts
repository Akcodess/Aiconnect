import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import type { CustomJwtRequest } from '../common/types/request.types';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';
import { kbResponseCodes, kbResponseMessages } from './constants/kb.constants';
import { KbPlatformSID } from './types/kb.types';
import type { KbStoreSummary, KbFileSummary } from './types/kb.types';
import { TenantDbService } from '../db/tenant-db.service';
import KBStore from '../db/entities/kb-store.entity';
import KBFile from '../db/entities/kb-file.entity';
import { KbStoreListDto, KbStoreListResponseEnvelopeDto, KbFileListDto, KbFileListResponseEnvelopeDto } from './dto/kb.dto';

@Injectable()
export class KbService {
  constructor(
    private readonly responseHelper: ResponseHelperService,
    private readonly logger: LoggingService,
    private readonly tenantDb: TenantDbService,
  ) {}

  async listStores(req: CustomJwtRequest, body: KbStoreListDto): Promise<KbStoreListResponseEnvelopeDto> {
    const xplatformSID = req?.XPlatformSID;
    const { ReqId, ReqCode, XPlatformID } = body;

    this.logger.info(kbResponseMessages.storeListRequestBody, JSON.stringify(body));

    // SID validation to follow existing flow
    if (xplatformSID !== KbPlatformSID.KBStores) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const dataSource = this.tenantDb.getTenantDataSource(req.TenantCode!);
      if (!dataSource) {
        return this.responseHelper.failNest(InternalServerErrorException, commonResponseMessages?.InternalError, commonResponseCodes?.InternalServerError, ReqId, ReqCode);
      }

      const repo = dataSource.getRepository(KBStore);
      const whereClause = XPlatformID ? { XPlatformID } : {};
      const stores = await repo.find({ where: whereClause });

      const summaries: KbStoreSummary[] = stores.map(s => ({
        Id: s.Id,
        KBUID: s.KBUID,
        XPlatformID: s.XPlatformID,
        XPRef: s.XPRef,
        CreatedOn: s.CreatedOn,
        EditedOn: s.EditedOn,
      }));

      this.logger.info(kbResponseMessages.storeListSuccess);
      return plainToInstance(
        KbStoreListResponseEnvelopeDto,
        this.responseHelper.successNest(kbResponseMessages.storeListSuccess, kbResponseCodes.storeListSuccess, summaries, ReqId, ReqCode)
      );
    } catch (err: any) {
      this.logger.error(kbResponseMessages.storeListFailed, err);
      return this.responseHelper.failNest(InternalServerErrorException, kbResponseMessages.storeListFailed, kbResponseCodes.internalServerError, ReqId, ReqCode);
    }
  }

  async listFiles(req: CustomJwtRequest, body: KbFileListDto): Promise<KbFileListResponseEnvelopeDto> {
    const xplatformSID = req?.XPlatformSID;
    const { ReqId, ReqCode, KBUID } = body;

    this.logger.info(kbResponseMessages.fileListRequestBody, JSON.stringify(body));

    if (xplatformSID !== KbPlatformSID.KBFiles) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const dataSource = this.tenantDb.getTenantDataSource(req.TenantCode!);
      if (!dataSource) {
        return this.responseHelper.failNest(InternalServerErrorException, commonResponseMessages?.InternalError, commonResponseCodes?.InternalServerError, ReqId, ReqCode);
      }

      const repo = dataSource.getRepository(KBFile);
      const files = await repo.find({ where: { KBUID } });

      const summaries: KbFileSummary[] = files.map(f => ({
        Id: f.Id,
        KBUID: f.KBUID,
        FileName: f.FileName,
        FileURL: f.FileURL,
        XPRef: f.XPRef,
        CreatedOn: f.CreatedOn,
        EditedOn: f.EditedOn,
      }));

      this.logger.info(kbResponseMessages.fileListSuccess);
      return plainToInstance(
        KbFileListResponseEnvelopeDto,
        this.responseHelper.successNest(kbResponseMessages.fileListSuccess, kbResponseCodes.fileListSuccess, summaries, ReqId, ReqCode)
      );
    } catch (err: any) {
      this.logger.error(kbResponseMessages.fileListFailed, err);
      return this.responseHelper.failNest(InternalServerErrorException, kbResponseMessages.fileListFailed, kbResponseCodes.internalServerError, ReqId, ReqCode);
    }
  }
}