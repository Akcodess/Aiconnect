import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import type { CustomJwtRequest } from '../common/types/request.types';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { ValkeyConfigService } from '../valkey/valkey.service';
import { InsightAIHandlerService } from './ai-handler.service';
import { InsightDto, InsightResponseDto, InsightResponseEnvelopeDto } from './dto/insight.dto';
import { InsightPlatformSID } from './types/insight.types';
import { insightResponseCodes, insightResponseMessages } from './constants/insight.constants';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';
import { PromptHelper } from '../common/helpers/prompt.helper';

@Injectable()
export class InsightService {
  constructor(
    private readonly responseHelper: ResponseHelperService,
    private readonly logger: LoggingService,
    private readonly valkey: ValkeyConfigService,
    private readonly aiHandler: InsightAIHandlerService,
  ) { }

  async generate(req: CustomJwtRequest, body: InsightDto): Promise<InsightResponseEnvelopeDto> {
    const token = req?.headers['sessionid'] as string;
    const xplatform = req?.XPlatformID as string;
    const apikey = req?.XPlatformUA?.APISecretKey;
    const clientEmail = req?.XPlatformUA?.ClientEmail;
    const projectId = req?.XPlatformUA?.ProjectId;
    const xplatformSID = req?.XPlatformSID;

    const { ReqId, ReqCode, UXID, ProcessCode, MessageID, Message, AllowedInsights = [], DispositionList, QuestionAnswer } = body;

    this.logger.info(insightResponseMessages?.InsightRequestBody, JSON.stringify(body));

    if (xplatformSID !== InsightPlatformSID?.Summarization) {
      return this.responseHelper?.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const normalizedAllowedInsights = (AllowedInsights || []).slice().sort().join(',');
      const cacheKey = this.valkey?.createShortKey('insight', ProcessCode!, UXID!, MessageID!, [normalizedAllowedInsights, req?.TenantCode!]);
      const cachedRaw = await this.valkey?.GetInsight(cacheKey);
      const matchedEntry = cachedRaw ? JSON.parse(cachedRaw) : null;

      if (matchedEntry) {
        this.logger.info(insightResponseMessages?.CachedResult);
        return plainToInstance(
          InsightResponseEnvelopeDto, this.responseHelper?.successNest(insightResponseMessages?.InsightSuccess, insightResponseCodes?.InsightSuccess, matchedEntry.Response as InsightResponseDto,
            ReqId, ReqCode
          )
        );
      }

      this.logger.info(insightResponseMessages?.InsightStarted, xplatform);

      const parsedMessage: string = Array.isArray(Message) || typeof Message === 'object' ? JSON.stringify(Message) : (Message as string);
      const prompt = PromptHelper?.BuildInsightPrompt(parsedMessage, AllowedInsights || [], DispositionList, QuestionAnswer);

      const responseResult: string | null = await this.aiHandler.dispatch({ prompt, platform: xplatform, creds: { APIKey: apikey, ClientEmail: clientEmail, ProjectId: projectId } });

      const responseEntry = {
        Token: token, TenantCode: req?.TenantCode!, ProcessCode, UXID, MessageID, AllowedInsights,
        Response: { Insight: (responseResult ? JSON.parse(responseResult) : {}) } as InsightResponseDto,
      };

      await this.valkey?.SetInsight(cacheKey, responseEntry);

      this.logger.info(insightResponseMessages?.InsightSuccess);
      return plainToInstance(
        InsightResponseEnvelopeDto, this.responseHelper?.successNest(insightResponseMessages?.InsightSuccess, insightResponseCodes?.InsightSuccess, responseEntry.Response, ReqId, ReqCode)
      );
    } catch (error: any) {
      this.logger.error(insightResponseMessages?.InsightFailed, error);
      return this.responseHelper.failNest(InternalServerErrorException, insightResponseMessages?.InsightFailed, insightResponseCodes?.InternalServerError, ReqId, ReqCode);
    }
  }
}