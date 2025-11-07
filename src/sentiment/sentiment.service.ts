import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CustomJwtRequest, SentimentQueryDto, SessionEntry, PlatformSID } from '../common/types/sentiment.types';
import { responseCodes, responseMessages } from '../common/constants/response.constants';
import { sentimentRequestLog, sentimentLogPrefix } from './constants/sentiment.constants';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { SentimentUtilityService } from '../common/utils/sentiment.util';
import { AIHandlerService } from './ai-handler.service';

@Injectable()
export class SentimentService {
  private readonly sentimentCache = new Map<string, SessionEntry>();

  constructor(
    private configService: ConfigService,
    private responseHelper: ResponseHelperService,
    private loggingService: LoggingService,
    private sentimentUtil: SentimentUtilityService,
    private aiHandler: AIHandlerService,
  ) {}

  async analyzeSentiment(
    req: CustomJwtRequest,
    res: Response,
    query: SentimentQueryDto
  ): Promise<void> {
    const token = req.headers['sessionid'] as string;
    const xplatform = req.XPlatformID as string;
    const apikey = req.XPlatformUA?.APISecretKey;
    const clientEmail = req.XPlatformUA?.ClientEmail;
    const projectId = req.XPlatformUA?.ProjectId;
    const xplatformSID = req.XPlatformSID;

    const { 
      Message = '', 
      MessageID = '', 
      ReqId = '', 
      ReqCode = '', 
      UXID = '', 
      ProcessCode = '', 
      SentenceScore, 
      OverallScore 
    } = query;

    this.loggingService.info(sentimentRequestLog, JSON.stringify(query));

    // Validate platform SID
    if (xplatformSID !== PlatformSID.SentimentDetection) {
      return this.responseHelper.fail(
        res,
        400,
        responseMessages.SID_MISMATCH,
        responseCodes.XPLATFORM_SID_MISMATCH,
        ReqId,
        ReqCode
      );
    }

    try {
      // Create cache key
      const cacheKey = this.createCacheKey('sentiment', ProcessCode, UXID, MessageID, req?.TenantCode!);
      const cached = this.sentimentCache.get(cacheKey);

      if (cached) {
        this.loggingService.info(responseMessages.CACHED_RESULT);
        const averageScore = await this.sentimentUtil.calculateAverageScore(
          'sentiment', 
          ProcessCode, 
          UXID, 
          req?.TenantCode!
        );
        const responseWithAvg = { ...cached.Response, AverageScore: averageScore };
        
        return this.responseHelper.success(
          res,
          responseMessages.ANALYSIS_SUCCESS,
          responseCodes.SENTIMENT_ANALYSIS_COMPLETED,
          responseWithAvg,
          ReqId,
          ReqCode
        );
      }

      this.loggingService.info(responseMessages.ANALYSIS_STARTED, xplatform);

      // Perform sentiment analysis
      let score: number | any = null;
      let sentenceScores: any = null;

      if (OverallScore === 'T') {
        score = await this.aiHandler.handleSentimentAnalysis({
          Message,
          APIKey: apikey,
          ClientEmail: clientEmail,
          ProjectId: projectId
        }, xplatform);
      }

      if (SentenceScore === 'T') {
        sentenceScores = await this.aiHandler.handleSentimentAnalysis({
          Message,
          SentenceScore: 'T',
          APIKey: apikey,
          ClientEmail: clientEmail,
          ProjectId: projectId
        }, xplatform);
      }

      const sentimentLabel = this.sentimentUtil.getSentimentLabel(score);
      this.loggingService.info(sentimentLogPrefix, sentimentLabel, score, JSON.stringify(sentenceScores));

      const averageScore = await this.sentimentUtil.calculateAverageScore(
        'sentiment', 
        ProcessCode, 
        UXID, 
        req?.TenantCode!
      );

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
        },
      };

      // Cache the result
      this.sentimentCache.set(cacheKey, responseEntry);

      return this.responseHelper.success(
        res,
        responseMessages.ANALYSIS_SUCCESS,
        responseCodes.SENTIMENT_ANALYSIS_COMPLETED,
        responseEntry.Response,
        ReqId,
        ReqCode
      );

    } catch (error: any) {
      this.loggingService.error(responseMessages.ANALYSIS_FAILED, error);
      return this.responseHelper.fail(
        res,
        500,
        responseMessages.INTERNAL_ERROR,
        responseCodes.INTERNAL_SERVER_ERROR,
        ReqId,
        ReqCode
      );
    }
  }

  private createCacheKey(
    type: string,
    processCode: string,
    uxid: string,
    messageId: string,
    tenantCode: string
  ): string {
    return `${type}:${processCode}:${uxid}:${messageId}:${tenantCode}`;
  }
}
