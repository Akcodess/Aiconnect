import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as mime from 'mime-types';

import type { CustomJwtRequest } from '../common/types/request.types';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { TranscribeDto } from './dto/transcribe.dto';
import { TranscribeResponseDto } from './dto/transcribe-response.dto';
import { TranscribeResponseEnvelopeDto } from './dto/transcribe-envelope.dto';
import { TranscribeAIHandlerService } from './ai-handler.service';
import { TranscribePlatformSID } from './types/transcribe.types';
import { transcribeResponseCodes, transcribeResponseMessages, transcribeRequestLog } from './constants/transcribe.constants';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';

@Injectable()
export class TranscribeService {
  constructor(
    private readonly responseHelper: ResponseHelperService,
    private readonly logger: LoggingService,
    private readonly aiHandler: TranscribeAIHandlerService,
  ) { }

  async transcribe(req: CustomJwtRequest, query: TranscribeDto): Promise<TranscribeResponseEnvelopeDto> {
    const token = req.headers['sessionid'] as string;
    const xplatform = req.XPlatformID as string;
    const apikey = req.XPlatformUA?.APISecretKey;
    const clientEmail = req.XPlatformUA?.ClientEmail;
    const projectId = req.XPlatformUA?.ProjectId;
    const xplatformSID = req.XPlatformSID;

    const { AudioUrl, MessageID, ReqId, ReqCode, UXID, ProcessCode, NumSpeakers, LanguageCode, SpeakerNames } = query;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    this.logger.info(transcribeRequestLog, JSON.stringify(query));

    // SID validation
    if (xplatformSID !== TranscribePlatformSID?.SpeechToText) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const fileExt = path.extname(AudioUrl).slice(1);
      const mimeType = (mime.lookup(fileExt) as string) || undefined;

      this.logger.info(transcribeResponseMessages?.TranscriptionStarted, xplatform);

      const transcript = await this.aiHandler?.dispatch({
        AudioUrl, fileExt, mimeType, NumSpeakers, LanguageCode, SpeakerNames, platform: xplatform,
        creds: { APIKey: apikey, ClientEmail: clientEmail, ProjectId: projectId }
      });

      if (!transcript) {
        this.logger.error(transcribeResponseMessages?.TranscriptionFailed);
        return this.responseHelper.failNest(InternalServerErrorException, transcribeResponseMessages?.TranscriptionFailed, transcribeResponseCodes?.TranscribeError, ReqId, ReqCode);
      }

      const responseEntry = { Token: token, TenantCode: req?.TenantCode!, ProcessCode, UXID, MessageID, Response: { Transcript: transcript } as TranscribeResponseDto };

      return this.responseHelper.successNest(transcribeResponseMessages?.TranscriptionSuccess, transcribeResponseCodes?.TranscribeSuccess, responseEntry?.Response as TranscribeResponseDto, ReqId, ReqCode) as any;
    } catch (err: any) {
      this.logger.error(transcribeResponseMessages?.TranscriptionFailed, err);
      return this.responseHelper.failNest(InternalServerErrorException, transcribeResponseMessages?.InternalError, transcribeResponseCodes?.InternalServerError, ReqId, ReqCode);
    }
  }
}