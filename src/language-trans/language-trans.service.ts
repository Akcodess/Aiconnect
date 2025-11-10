import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import type { CustomJwtRequest } from '../common/types/request.types';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { ValkeyConfigService } from '../valkey/valkey.service';
import { TranslationDto } from './dto/translation.dto';
import { TranslationResponseDto } from './dto/translation-response.dto';
import { TranslationResponseEnvelopeDto } from './dto/translation-envelope.dto';
import { LanguageTransAIHandlerService } from './ai-handler.service';
import { LanguageTransPlatformSID } from './types/language-trans.types';
import { languageTransResponseCodes, languageTransResponseMessages, languageTransRequestLog } from './constants/language-trans.constants';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';

@Injectable()
export class LanguageTransService {
  constructor(
    private readonly responseHelper: ResponseHelperService,
    private readonly logger: LoggingService,
    private readonly valkey: ValkeyConfigService,
    private readonly aiHandler: LanguageTransAIHandlerService,
  ) { }

  async translate(req: CustomJwtRequest, body: TranslationDto): Promise<TranslationResponseEnvelopeDto> {
    const token = req.headers['sessionid'] as string;
    const xplatform = req.XPlatformID as string;
    const apikey = req.XPlatformUA?.APISecretKey;
    const clientEmail = req.XPlatformUA?.ClientEmail;
    const projectId = req.XPlatformUA?.ProjectId;
    const xplatformSID = req.XPlatformSID;

    const { ReqId, ReqCode, UXID, ProcessCode, MessageID, Message, From, To } = body;

    this.logger.info(languageTransRequestLog, JSON.stringify(body));

    // SID validation
    if (xplatformSID !== LanguageTransPlatformSID?.LanguageTranslation) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const cacheKey = this.valkey.createShortKey('langtrans', ProcessCode!, MessageID!, UXID!, [From || '', To, req?.TenantCode!]);
      const cachedRaw = await this.valkey.GetLanguageTranslation(cacheKey);
      const cachedEntry = cachedRaw ? JSON.parse(cachedRaw) : null;

      if (cachedEntry) {
        this.logger.info(languageTransResponseMessages?.CachedResult);
        return plainToInstance(TranslationResponseEnvelopeDto, this.responseHelper?.successNest(languageTransResponseMessages?.TranslationSuccess, languageTransResponseCodes?.TranslationSuccess,
          cachedEntry?.Response as TranslationResponseDto, ReqId, ReqCode),
        );
      }

      this.logger.info(languageTransResponseMessages?.TranslationStarted, xplatform);

      const translated = await this.aiHandler?.dispatch({ message: Message, to: To, from: From, platform: xplatform, creds: { APIKey: apikey, ClientEmail: clientEmail, ProjectId: projectId } });

      if (!translated) {
        this.logger.error(languageTransResponseMessages?.TranslationFailed);
        return this.responseHelper.failNest(InternalServerErrorException, languageTransResponseMessages?.TranslationFailed, languageTransResponseCodes?.TranslationError, ReqId, ReqCode);
      }

      const responseEntry = { Token: token, TenantCode: req?.TenantCode!, ProcessCode, UXID, MessageID, Response: { TranslatedMessage: translated, From, To } as TranslationResponseDto };

      await this.valkey?.SetLanguageTranslation(cacheKey, responseEntry);

      return plainToInstance(TranslationResponseEnvelopeDto, this.responseHelper.successNest(languageTransResponseMessages?.TranslationSuccess, languageTransResponseCodes?.TranslationSuccess,
        responseEntry?.Response as TranslationResponseDto, ReqId, ReqCode), { excludeExtraneousValues: true },
      );
    } catch (err: any) {
      this.logger.error(languageTransResponseMessages?.TranslationFailed, err);
      return this.responseHelper.failNest(InternalServerErrorException, languageTransResponseMessages?.InternalError, languageTransResponseCodes?.InternalServerError, ReqId, ReqCode);
    }
  }
}