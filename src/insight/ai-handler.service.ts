import { Injectable } from '@nestjs/common';

import { LoggingService } from '../common/utils/logging.util';
import { AiUtilService } from '../common/utils/ai.util';
import { InsightDispatchInput, InsightHandlerCreds } from './types/insight.types';
import { insightResponseMessages } from './constants/insight.constants';

@Injectable()
export class InsightAIHandlerService {
  constructor(private readonly logger: LoggingService, private readonly aiUtil: AiUtilService) { }

  private readonly handlers: Record<string, (prompt: string, creds: InsightHandlerCreds) => Promise<string | null>> = {
    openai: this.handleOpenAI.bind(this),
    googlecloud: this.handleGoogleCloud.bind(this),
  };

  async dispatch({ prompt, platform, creds }: InsightDispatchInput): Promise<string | null> {
    const key = platform?.toLowerCase();
    const handler = this.handlers[key];
    return await handler(prompt, creds);
  }

  private async handleOpenAI(prompt: string, creds: InsightHandlerCreds): Promise<string | null> {
    try {
      const response = await this.aiUtil?.chatCompletion(prompt, creds?.APIKey);
      return response;
    } catch (err: unknown) {
      this.logger.error(insightResponseMessages?.OpenaiHandlerError, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  private async handleGoogleCloud(prompt: string, creds: InsightHandlerCreds): Promise<string | null> {
    try {
      const response = await this.aiUtil?.googleCloudChat(prompt, creds?.APIKey, creds?.ClientEmail, creds?.ProjectId);
      return response?.replace(/^\s*```json\s*|```$/g, '')?.trim() || null;
    } catch (err: unknown) {
      this.logger.error(insightResponseMessages?.GoogleCloudHandlerError, err instanceof Error ? err.message : String(err));
      return null;
    }
  }
}