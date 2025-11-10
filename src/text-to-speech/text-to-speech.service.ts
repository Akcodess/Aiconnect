import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import type { CustomJwtRequest } from '../common/types/request.types';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { ValkeyConfigService } from '../valkey/valkey.service';
import { TextToSpeechAIHandlerService } from './ai-handler.service';
import { TextToSpeechDto } from './dto/text-to-speech.dto';
import { TextToSpeechResponseDto } from './dto/text-to-speech-response.dto';
import { TextToSpeechPlatformSID } from './types/tts.types';
import { ttsResponseCodes, ttsResponseMessages, ttsRequestLog } from './constants/text-to-speech.constants';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';
import { bufferAudio } from './utils/audio.util';

@Injectable()
export class TextToSpeechService {
  constructor(
    private readonly responseHelper: ResponseHelperService,
    private readonly logger: LoggingService,
    private readonly valkey: ValkeyConfigService,
    private readonly aiHandler: TextToSpeechAIHandlerService,
  ) { }

  async synthesize(req: CustomJwtRequest, body: TextToSpeechDto): Promise<any> {
    const token = req?.headers['sessionid'] as string;
    const xplatform = req?.XPlatformID as string;
    const apikey = req?.XPlatformUA?.APISecretKey;
    const clientEmail = req?.XPlatformUA?.ClientEmail;
    const projectId = req?.XPlatformUA?.ProjectId;
    const xplatformSID = req?.XPlatformSID;

    const { Message, VoiceModel, LanguageCode, SpeakingRate, MessageID, ReqId, ReqCode, UXID, ProcessCode } = body;

    this.logger.info(ttsRequestLog, JSON.stringify(body));

    if (xplatformSID !== TextToSpeechPlatformSID?.TextToSpeech) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const cacheKey = this.valkey.createShortKey('tts', ProcessCode!, UXID!, MessageID!, [LanguageCode ?? '', req?.TenantCode!]);
      const cachedRaw = await this.valkey.GetTextToSpeech(cacheKey);
      const matchedEntry = cachedRaw ? JSON.parse(cachedRaw) : null;

      if (matchedEntry) {
        this.logger.info(ttsResponseMessages?.CachedResult);
        return this.responseHelper.successNest(ttsResponseMessages?.TextToSpeechSuccess, ttsResponseCodes?.TextToSpeechSuccess, matchedEntry.Response as TextToSpeechResponseDto, ReqId, ReqCode);
      }

      this.logger.info(ttsResponseMessages?.TextToSpeechStarted, xplatform);

      const result = await this?.aiHandler?.dispatch({ Message, VoiceModel, LanguageCode, SpeakingRate, platform: xplatform, creds: { APIKey: apikey, ClientEmail: clientEmail, ProjectId: projectId } });
      const filePath = await bufferAudio(result);

      const responseEntry = { Token: token, TenantCode: req?.TenantCode!, ProcessCode, UXID, MessageID, LanguageCode, Response: { Audio: filePath } as TextToSpeechResponseDto };

      await this.valkey.SetTextToSpeech(cacheKey, responseEntry);

      return plainToInstance(TextToSpeechResponseDto, this.responseHelper.successNest(ttsResponseMessages?.TextToSpeechSuccess, ttsResponseCodes?.TextToSpeechSuccess, { Audio: filePath }, ReqId, ReqCode));
    } catch (error: any) {
      this.logger.error(ttsResponseMessages?.TextToSpeechFailed, error);
      return this.responseHelper.failNest(InternalServerErrorException, ttsResponseMessages?.InternalError, ttsResponseCodes?.InternalServerError, ReqId, ReqCode);
    }
  }
}