import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import type { CustomJwtRequest } from '../common/types/request.types';
import { ResponseHelperService } from '../common/helpers/response.helper';
import { LoggingService } from '../common/utils/logging.util';
import { ValkeyConfigService } from '../valkey/valkey.service';
import { OpenChatAIHandlerService } from './ai-handler.service';
import { OpenChatInitDto, OpenChatInitResponseDto, OpenChatChatDto, OpenChatChatResponseDto, OpenChatInitResponseEnvelopeDto, OpenChatChatResponseEnvelopeDto } from './dto/openchat.dto';
import { OpenChatPlatformSID } from './types/openchat.types';
import { openChatResponseCodes, openChatResponseMessages } from './constants/openchat.constants';
import { commonResponseCodes, commonResponseMessages } from '../common/constants/response.constants';
import type { OpenChatChatResult } from './types/openchat.types';

@Injectable()
export class OpenChatService {
  constructor(
    private readonly responseHelper: ResponseHelperService, private readonly logger: LoggingService, private readonly valkey: ValkeyConfigService, private readonly openChatHandler: OpenChatAIHandlerService
  ) { }

  async initialize(req: CustomJwtRequest, body: OpenChatInitDto): Promise<OpenChatInitResponseEnvelopeDto> {
    const token = req?.headers['sessionid'] as string;
    const xplatform = req?.XPlatformID as string;
    const apikey = req?.XPlatformUA?.APISecretKey;
    const xplatformSID = req?.XPlatformSID;

    const { ReqId, ReqCode, ProcessCode, ContactId } = body;

    this.logger.info(openChatResponseMessages?.OpenChatInitRequestBody, JSON.stringify(body));

    if (xplatformSID !== OpenChatPlatformSID?.OpenChat) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      this.logger.info(openChatResponseMessages?.OpenChatInitStarted, xplatform);

      const assistantCacheKey = this.valkey.createShortKey('assistant', ProcessCode ?? '', ContactId ?? '', ReqCode!, [xplatform]);
      const threadCacheKey = this.valkey.createShortKey('thread', ProcessCode ?? '', ContactId ?? '', ReqCode!, [xplatform]);

      let assistantId = await this.valkey.GetOpenChatAssistant(assistantCacheKey);
      let threadId = await this.valkey.GetOpenChatThread(threadCacheKey);

      if (!assistantId) {
        const createdAssistantId = await this.openChatHandler?.createAssistantOpenAI(apikey);
        if (createdAssistantId) {
          assistantId = createdAssistantId;
          await this.valkey.SetOpenChatAssistant(assistantCacheKey, createdAssistantId);
          this.logger.info(`${openChatResponseMessages?.OpenChatAssistantCreated}${createdAssistantId}:${assistantCacheKey}`);
        }
      }

      if (!threadId) {
        const createdThreadId = await this.openChatHandler?.createThreadOpenAI(apikey);
        if (createdThreadId) {
          threadId = createdThreadId;
          await this.valkey.SetOpenChatThread(threadCacheKey, createdThreadId);
          this.logger.info(`${openChatResponseMessages?.OpenChatThreadCreated}${createdThreadId}:${threadCacheKey}`);
        }
      }

      // Normalize any JSON-quoted string IDs
      if (typeof assistantId === 'string' && assistantId.startsWith('"')) {
        assistantId = JSON.parse(assistantId);
      }
      if (typeof threadId === 'string' && threadId.startsWith('"')) {
        threadId = JSON.parse(threadId);
      }

      const responseEntry = {
        Token: token, TenantCode: req?.TenantCode!, ProcessCode, ContactId, ReqCode,
        Response: { ThreadId: threadId!, AssistantId: assistantId! } as OpenChatInitResponseDto,
      };

      this.logger.info(openChatResponseMessages?.OpenChatInitSuccess, JSON.stringify(responseEntry));
      return plainToInstance(
        OpenChatInitResponseEnvelopeDto,
        this.responseHelper.successNest(openChatResponseMessages?.OpenChatInitSuccess, openChatResponseCodes?.OpenChatInitSuccess, responseEntry?.Response, ReqId, ReqCode)
      );
    } catch (error: any) {
      this.logger.error(openChatResponseMessages?.OpenChatInitFailed, error);
      return this.responseHelper.failNest(InternalServerErrorException, openChatResponseMessages?.OpenChatInitFailed, openChatResponseCodes?.InternalServerError, ReqId, ReqCode);
    }
  }

  async chat(req: CustomJwtRequest, body: OpenChatChatDto): Promise<OpenChatChatResponseEnvelopeDto> {
    const token = req?.headers['sessionid'] as string;
    const xplatform = req?.XPlatformID as string;
    const apikey = req?.XPlatformUA?.APISecretKey;
    const xplatformSID = req?.XPlatformSID;

    const { ReqId, ReqCode, Message, AssistantId, ThreadId } = body;

    this.logger.info(openChatResponseMessages?.OpenChatRequestBody, JSON.stringify(body));

    if (xplatformSID !== OpenChatPlatformSID?.OpenChat) {
      return this.responseHelper.failNest(BadRequestException, commonResponseMessages?.SidMismatch, commonResponseCodes?.XPlatformSidMismatch, ReqId, ReqCode);
    }

    try {
      const responseResult: OpenChatChatResult | null = await this.openChatHandler?.runOpenChatOpenAI({ Message, APIKey: apikey, AssistantId, ThreadId, ReqCode, XPlatformID: xplatform });

      if (!responseResult) {
        throw new Error('OpenChat handler returned null');
      }

      const payload: OpenChatChatResponseDto = {
        ThreadId: responseResult.ThreadId,
        AssistantId: responseResult.AssistantId,
        reply: responseResult.reply,
        messages: responseResult.messages,
      };

      this.logger.info(openChatResponseMessages?.OpenChatSuccess);
      return plainToInstance(
        OpenChatChatResponseEnvelopeDto,
        this.responseHelper.successNest(openChatResponseMessages?.OpenChatSuccess, openChatResponseCodes?.OpenChatSuccess, payload, ReqId, ReqCode
        )
      );
    } catch (error: any) {
      this.logger.error(openChatResponseMessages?.OpenChatFailed, error);
      return this.responseHelper.failNest(InternalServerErrorException, openChatResponseMessages?.OpenChatFailed, openChatResponseCodes?.InternalServerError, ReqId, ReqCode);
    }
  }
}