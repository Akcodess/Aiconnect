import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CustomJwtRequest } from '../common/types/request.types';
import { SessionEntry, PlatformSID } from './types/sentiment.types';
import { SentimentAnalysisQueryDto } from './dto/sentiment.dto';
import { SentimentAnalysisResponseDto } from './dto/sentiment-response.dto';
import { SentimentAnalysisResponseEnvelopeDto } from './dto/sentiment-envelope.dto';
import { SentimentTextChatDto } from './dto/sentiment-text-chat.dto';
import { SentimentTextChatResponseDto } from './dto/sentiment-text-chat-response.dto';
import { SentimentTextChatResponseEnvelopeDto } from './dto/sentiment-text-chat-envelope.dto';
import { responseCodes, responseMessages } from '../sentiment/constants/sentiment.constants';
import { sentimentRequestLog, sentimentLogPrefix } from './constants/sentiment.constants';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { SentimentUtilityService } from './utils/sentiment.util';
import { AIHandlerService } from './ai-handler.service';
import { ValkeyConfigService } from '../valkey/valkey.service';
import { SentimentCategoryEnum } from './enums/sentiment.enum';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';

@Injectable()
export class SentimentService {
  constructor(private responseHelper: ResponseHelperService, private loggingService: LoggingService, private sentimentUtil: SentimentUtilityService, private aiHandler: AIHandlerService, private valkey: ValkeyConfigService) { }

  async analyzeSentiment(req: CustomJwtRequest, query: SentimentAnalysisQueryDto): Promise<SentimentAnalysisResponseEnvelopeDto> {
    const token = req.headers['sessionid'] as string;
    const xplatform = req.XPlatformID as string;
    const apikey = req.XPlatformUA?.APISecretKey;
    const clientEmail = req.XPlatformUA?.ClientEmail;
    const projectId = req.XPlatformUA?.ProjectId;
    const xplatformSID = req.XPlatformSID;

    const { Message, MessageID, ReqId, ReqCode, UXID, ProcessCode, SentenceScore, OverallScore } = query;

    this.loggingService.info(sentimentRequestLog, JSON.stringify(query));

    // Validate platform SID
    if (xplatformSID !== PlatformSID.SentimentDetection) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      // Create cache key
      const cacheKey = this.valkey.createShortKey('sentiment', ProcessCode!, MessageID!, UXID!, [req?.TenantCode!]);
      const cachedRaw = await this.valkey.GetSentiment(cacheKey);
      const cached = cachedRaw ? JSON.parse(cachedRaw) as SessionEntry : null;

      if (cached) {
        this.loggingService.info(commonResponseMessages?.CachedResult);
        const averageScore = await this.sentimentUtil.calculateAverageScore('sentiment', ProcessCode!, UXID!, req?.TenantCode!);
        const responseWithAvg: SentimentAnalysisResponseDto = { ...cached.Response, AverageScore: averageScore } as SentimentAnalysisResponseDto;

        return plainToInstance(SentimentAnalysisResponseEnvelopeDto, this.responseHelper.successNest(responseMessages?.AnalysisSuccess, responseCodes?.SentimentAnalysisCompleted, responseWithAvg,
          ReqId, ReqCode), { excludeExtraneousValues: true }
        );
      }

      this.loggingService.info(responseMessages.AnalysisStarted, xplatform);

      // Perform sentiment analysis
      let score: number | any = null;
      let sentenceScores: any = null;

      if (OverallScore === 'T') {
        score = await this.aiHandler?.handleSentimentAnalysis({ Message, APIKey: apikey, ClientEmail: clientEmail, ProjectId: projectId }, xplatform);
      }

      if (SentenceScore === 'T') {
        sentenceScores = await this.aiHandler?.handleSentimentAnalysis({ Message, SentenceScore: 'T', APIKey: apikey, ClientEmail: clientEmail, ProjectId: projectId }, xplatform);
      }

      const sentimentLabel = this.sentimentUtil.getSentimentLabel(score) as SentimentCategoryEnum;
      this.loggingService.info(sentimentLogPrefix, sentimentLabel, score, JSON.stringify(sentenceScores));

      const averageScore = await this.sentimentUtil.calculateAverageScore('sentiment', ProcessCode, UXID, req?.TenantCode!);

      const responseEntry: SessionEntry = {
        Token: token,
        TenantCode: req?.TenantCode!,
        ProcessCode,
        UXID,
        MessageID,
        SentenceScore,
        OverallScore,
        Response: {
          ...(OverallScore === 'T' && {
            OverallCategory: sentimentLabel,
            OverallScore: score || 0,
          }),
          ...(SentenceScore === 'T' && {
            SentenceScore: sentenceScores || {},
          }),
          AverageScore: averageScore || 0
        } as SentimentAnalysisResponseDto,
      };

      // Cache the result in Valkey
      await this.valkey.SetSentiment(cacheKey, responseEntry);

      return plainToInstance(SentimentAnalysisResponseEnvelopeDto,
        this.responseHelper.successNest(responseMessages?.AnalysisSuccess, responseCodes.SentimentAnalysisCompleted, responseEntry.Response as SentimentAnalysisResponseDto,
          ReqId, ReqCode), { excludeExtraneousValues: true }
      );

    } catch (error: any) {
      this.loggingService.error(responseMessages?.AnalysisFailed, error);
      return this.responseHelper.failNest(InternalServerErrorException, responseMessages?.InternalError, responseCodes.InternalServerError, ReqId, ReqCode);
    }
  }

  async analyzeSentimentTextChat(req: CustomJwtRequest, body: SentimentTextChatDto): Promise<SentimentTextChatResponseEnvelopeDto> {
    const token = req.headers['sessionid'] as string;
    const xplatform = req.XPlatformID as string;
    const apikey = req.XPlatformUA?.APISecretKey;
    const clientEmail = req.XPlatformUA?.ClientEmail;
    const projectId = req.XPlatformUA?.ProjectId;
    const xplatformSID = req.XPlatformSID;

    const { Message, MessageID, ReqId, ReqCode, UXID, ProcessCode } = body;

    this.loggingService.info(sentimentRequestLog, JSON.stringify(body));

    if (xplatformSID !== PlatformSID?.SentimentDetection) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      // Cache key for text chat sentiment (db 5)
      const cacheKey = this.valkey.createShortKey('sentimentTextChat', ProcessCode!, MessageID!, UXID!, [req?.TenantCode!]);
      const cachedRaw = await this.valkey.GetSentimentTextChat(cacheKey);
      const matchedEntry = cachedRaw ? JSON.parse(cachedRaw) : null;

      if (matchedEntry) {
        this.loggingService.info(commonResponseMessages?.CachedResult);
        const averageScore = await this.sentimentUtil?.calculateAverageScore('sentimentTextChat', ProcessCode!, UXID!, req?.TenantCode!);
        const responseWithAvg: SentimentTextChatResponseDto = { ...matchedEntry.Response, AverageScore: averageScore } as SentimentTextChatResponseDto;

        return plainToInstance(SentimentTextChatResponseEnvelopeDto,
          this.responseHelper.successNest(responseMessages?.AnalysisSuccess, responseCodes?.SentimentAnalysisCompleted, responseWithAvg, ReqId, ReqCode),
          { excludeExtraneousValues: true }
        );
      }

      this.loggingService.info(responseMessages?.AnalysisStarted, xplatform);

      const result = await this.aiHandler?.handleSentimentTextChat({ Message, APIKey: apikey, ClientEmail: clientEmail, ProjectId: projectId }, xplatform);
      this.loggingService.info(JSON.stringify(result));

      const averageScore = await this.sentimentUtil?.calculateAverageScore('sentimentTextChat', ProcessCode!, UXID!, req?.TenantCode!);

      const responseEntry = {
        Token: token,
        TenantCode: req?.TenantCode!,
        ProcessCode,
        UXID,
        MessageID,
        Response: {
          Sentiment: result,
          AverageScore: averageScore || 0,
        } as SentimentTextChatResponseDto,
      };

      await this.valkey.SetSentimentTextChat(cacheKey, responseEntry);

      return plainToInstance(SentimentTextChatResponseEnvelopeDto,
        this.responseHelper.successNest(responseMessages?.AnalysisSuccess, responseCodes.SentimentAnalysisCompleted, responseEntry?.Response as SentimentTextChatResponseDto, ReqId, ReqCode)
      );

    } catch (error: any) {
      this.loggingService.error(responseMessages?.AnalysisFailed, error);
      return this.responseHelper.failNest(InternalServerErrorException, responseMessages?.InternalError, responseCodes.InternalServerError, ReqId, ReqCode);
    }
  }
}
