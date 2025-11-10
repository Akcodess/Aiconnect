import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { ValkeyConfigService } from '../valkey/valkey.service';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AutoDispositionDto } from './dto/auto-disposition.dto';
import { AutoDispositionResponseEnvelopeDto } from './dto/auto-disposition-response.dto';
import { AutoDispositionResponseDto } from './dto/auto-disposition-response.dto';
import { DispositionAIHandlerService } from './ai-handler.service';
import { DispositionPlatformSID } from './types/disposition.types';
import { dispositionResponseCodes, dispositionResponseMessages, dispositionRequestLog } from './constants/disposition.constants';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';

@Injectable()
export class DispositionService {
  constructor(private readonly responseHelper: ResponseHelperService, private readonly logger: LoggingService, private readonly valkey: ValkeyConfigService,
    private readonly aiHandler: DispositionAIHandlerService
  ) { }

  async classifyDisposition(req: CustomJwtRequest, body: AutoDispositionDto): Promise<AutoDispositionResponseEnvelopeDto> {
    const token = req.headers['sessionid'] as string;
    const xplatform = req.XPlatformID as string;
    const apikey = req.XPlatformUA?.APISecretKey;
    const clientEmail = req.XPlatformUA?.ClientEmail;
    const projectId = req.XPlatformUA?.ProjectId;
    const xplatformSID = req.XPlatformSID;

    const { ReqId, ReqCode, UXID, ProcessCode, ConversationID, Conversation, DispositionList } = body;

    this.logger.info(dispositionRequestLog, JSON.stringify(body));

    // SID validation
    if (xplatformSID !== DispositionPlatformSID?.AutoDisposition) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const cacheKey = this.valkey.createShortKey('autodisposition', ProcessCode!, UXID!, '', [req?.TenantCode!]);
      const cachedRaw = await this.valkey.GetAutoDisposition(cacheKey);
      const cachedEntry = cachedRaw ? JSON.parse(cachedRaw) : null;

      if (cachedEntry) {
        this.logger.info(dispositionResponseMessages?.CachedResult);
        return plainToInstance(AutoDispositionResponseEnvelopeDto, this.responseHelper?.successNest(dispositionResponseMessages?.DispositionSuccess, dispositionResponseCodes?.AutoDispositionSuccess,
          cachedEntry?.Response as AutoDispositionResponseDto, ReqId, ReqCode)
        );
      }

      this.logger.info(dispositionResponseMessages?.DispositionStarted, xplatform);

      const disposition = await this.aiHandler?.dispatch({ conversation: Conversation, dispositionList: DispositionList, platform: xplatform, creds: { APIKey: apikey, ClientEmail: clientEmail, ProjectId: projectId }, });
      const responseEntry = {
        Token: token, TenantCode: req?.TenantCode!, ProcessCode, UXID, ConversationID, Response: { Disposition: disposition } as AutoDispositionResponseDto,
      };

      await this.valkey?.SetAutoDisposition(cacheKey, responseEntry);

      return plainToInstance(AutoDispositionResponseEnvelopeDto, this.responseHelper.successNest(dispositionResponseMessages?.DispositionSuccess,
        dispositionResponseCodes?.AutoDispositionSuccess, responseEntry?.Response as AutoDispositionResponseDto, ReqId, ReqCode)
      );
    } catch (err: any) {
      this.logger.error(dispositionResponseMessages?.DispositionFailed, err);
      return this.responseHelper.failNest(InternalServerErrorException, dispositionResponseMessages?.InternalError, dispositionResponseCodes?.InternalServerError, ReqId, ReqCode);
    }
  }
}