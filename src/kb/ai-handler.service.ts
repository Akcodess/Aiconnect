import { Injectable } from '@nestjs/common';

import { AiUtilService } from '../common/utils/ai.util';
import { LoggingService } from '../common/utils/logging.util';
import type { KbInitResult, KbHandlerCreds, KbHandlerOps, KbFileUploadInput, KbFileUploadResult, KbVectorStoreFileInput, KbVectorStoreFileResult, KbAssistantCreateInput, KbAssistantCreateResult, KbAssistantUpdateInput, KbAssistantUpdateResult } from './types/kb.types';
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
      VectorStoreFileCreate: this.handleOpenAIVectorStoreFile.bind(this),
      VectorStoreFileDelete: this.handleOpenAIVectorStoreFileDelete.bind(this),
      AssistantCreate: this.handleOpenAIAssistantCreate.bind(this),
      AssistantUpdate: this.handleOpenAIAssistantUpdate.bind(this),
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

  private async handleOpenAIVectorStoreFile(_: string, creds: KbHandlerCreds, input: KbVectorStoreFileInput): Promise<KbVectorStoreFileResult | null> {
    try {
      const result = await this.aiUtil?.kbVectorStoreFileOpenAI({ APIKey: creds?.APIKey!, ...input });
      return result as KbVectorStoreFileResult;
    } catch (err: unknown) {
      this.logger.error(kbResponseMessages?.vectorStoreFileFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  private async handleOpenAIVectorStoreFileDelete(_: string, creds: KbHandlerCreds, input: KbVectorStoreFileInput): Promise<KbVectorStoreFileResult | null> {
    try {
      const result = await this.aiUtil?.kbVectorStoreFileDeleteOpenAI({ APIKey: creds?.APIKey!, ...input });
      return result as KbVectorStoreFileResult;
    } catch (err: unknown) {
      this.logger.error(kbResponseMessages?.vectorStoreFileDeleteFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  private async handleOpenAIAssistantCreate(_: string, creds: KbHandlerCreds, input: KbAssistantCreateInput): Promise<KbAssistantCreateResult | null> {
    try {
      const result = await this.aiUtil?.kbAssistantCreateOpenAI({ APIKey: creds?.APIKey!, ...input });
      return result as KbAssistantCreateResult;
    } catch (err: unknown) {
      this.logger.error(kbResponseMessages.assistantCreateFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  private async handleOpenAIAssistantUpdate(_: string, creds: KbHandlerCreds, input: KbAssistantUpdateInput): Promise<KbAssistantUpdateResult | null> {
    try {
      const result = await this.aiUtil?.kbAssistantUpdateOpenAI({ APIKey: creds?.APIKey!, ...input });
      return result as KbAssistantUpdateResult;
    } catch (err: unknown) {
      this.logger.error(kbResponseMessages?.assistantUpdateFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }
}