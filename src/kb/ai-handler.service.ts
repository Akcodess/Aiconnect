import { Injectable } from '@nestjs/common';

import { AiUtilService } from '../common/utils/ai.util';
import { LoggingService } from '../common/utils/logging.util';
import type { KbInitResult, KbHandlerCreds, KbHandlerOps, KbFileUploadInput, KbFileUploadResult } from './types/kb.types';
import { kbResponseMessages } from './constants/kb.constants';

@Injectable()
export class KbAIHandlerService {
  constructor(private readonly logger: LoggingService, private readonly aiUtil: AiUtilService) { }

  private readonly handlers: Record<string, KbHandlerOps> = {
    openai: {
      KbInit: this.handleOpenAI.bind(this),
      KbFileUpload: this.handleOpenAIFileUpload.bind(this),
      KbFileDelete: this.handleOpenAIFileDelete.bind(this),
      VectorStoreDelete: this.handleOpenAIVectorDelete.bind(this),
      AssistantDelete: this.handleOpenAIAssistantDelete.bind(this),
    }
  };

  // Expose per-platform ops for direct access without wrapper methods
  getOps(platform: string): KbHandlerOps | undefined {
    const key = platform?.toLowerCase();
    return this.handlers[key];
  }


  private async handleOpenAI(platform: string, creds: KbHandlerCreds): Promise<KbInitResult | null> {
    try {
      const result = await this.aiUtil?.kbInitOpenAI({ APIKey: creds?.APIKey!, XPlatformID: platform });
      return result as KbInitResult;
    } catch (err: unknown) {
      this.logger.error(kbResponseMessages?.kbInitFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  private async handleOpenAIFileDelete(platform: string, creds: KbHandlerCreds, fileId: string): Promise<boolean> {
    try {
      const ok = await this.aiUtil?.kbDeleteFileOpenAI({ APIKey: creds?.APIKey!, FileId: fileId });
      return !!ok;
    } catch (err: unknown) {
      this.logger.warn(kbResponseMessages.fileDeleteFailed, err instanceof Error ? err.message : String(err));
      return false;
    }
  }

  private async handleOpenAIVectorDelete(platform: string, creds: KbHandlerCreds, vectorStoreId: string): Promise<boolean> {
    try {
      const ok = await this.aiUtil?.kbDeleteVectorStoreOpenAI({ APIKey: creds?.APIKey!, VectorStoreId: vectorStoreId });
      return !!ok;
    } catch (err: unknown) {
      this.logger.warn(kbResponseMessages.vectorStoreDeleteFailed, err instanceof Error ? err.message : String(err));
      return false;
    }
  }

  private async handleOpenAIAssistantDelete(platform: string, creds: KbHandlerCreds, assistantId: string): Promise<boolean> {
    try {
      const ok = await this.aiUtil?.kbDeleteAssistantOpenAI({ APIKey: creds?.APIKey!, AssistantId: assistantId });
      return !!ok;
    } catch (err: unknown) {
      this.logger.warn(kbResponseMessages.assistantDeleteFailed, err instanceof Error ? err.message : String(err));
      return false;
    }
  }

  private async handleOpenAIFileUpload(_: string, creds: KbHandlerCreds, input: KbFileUploadInput): Promise<KbFileUploadResult | null> {
    try {
      const result = await this.aiUtil?.kbFileUploadOpenAI({ APIKey: creds?.APIKey!, ...input });
      return result as KbFileUploadResult;
    } catch (err: unknown) {
      this.logger.error(kbResponseMessages.fileUploadFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }
}