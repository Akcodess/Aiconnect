import { Injectable } from '@nestjs/common';

import { OpenAIService } from '../common/utils/openai.util';
import { LoggingService } from '../common/utils/logging.util';
import { PromptHelper } from '../common/helpers/prompt.helper';
import { dispositionResponseMessages } from './constants/disposition.constants';
import { DispositionDispatchOptions, DispositionProviderCredentials } from './types/ai-handler.types';

@Injectable()
export class DispositionAIHandlerService {
  constructor(private readonly logger: LoggingService, private readonly openai: OpenAIService) {}

  private readonly handlers: Record<string, (prompt: string, creds: DispositionProviderCredentials) => Promise<string | null>> = {
    openai: this.handleOpenAI.bind(this),
    googlecloud: this.handleGoogleCloud.bind(this),
  };

  async dispatch(options: DispositionDispatchOptions): Promise<string | null> {
    const { conversation, dispositionList, platform, creds } = options;
    const prompt = PromptHelper?.BuildAutoDispositionPrompt(conversation, dispositionList);
    const key = platform?.toLowerCase();
    const handler = this.handlers[key];
    return handler ? handler(prompt, creds) : null;
  }

  private async handleOpenAI(prompt: string, creds: DispositionProviderCredentials): Promise<string | null> {
    try {
      const response = await this.openai?.chatCompletion(prompt, creds?.APIKey);
      return response;
    } catch (err: unknown) {
      this.logger.error(dispositionResponseMessages?.DispositionFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  // Placeholder for Google Cloud implementation; returns null to indicate not supported yet
  private async handleGoogleCloud(prompt: string, creds: DispositionProviderCredentials): Promise<string | null> {
    try {
      const response = await this.openai?.CallGoogleCloudChat(prompt, creds?.APIKey, creds?.ClientEmail, creds?.ProjectId);
      return response?.replace(/\n/g, '') || null;
    } catch (err: unknown) {
      this.logger.error(dispositionResponseMessages?.DispositionFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }
}