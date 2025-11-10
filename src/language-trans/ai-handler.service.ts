import { Injectable } from '@nestjs/common';
import { Translate } from '@google-cloud/translate/build/src/v2';

import { OpenAIService } from '../common/utils/openai.util';
import { LoggingService } from '../common/utils/logging.util';
import { PromptHelper } from '../common/helpers/prompt.helper';
import { languageTransResponseMessages } from './constants/language-trans.constants';
import { TranslationDispatchOptions, GoogleCloudCredentials, TranslationHandlerFn } from './types/language-trans.types';

@Injectable()
export class LanguageTransAIHandlerService {
  constructor(private readonly logger: LoggingService, private readonly openai: OpenAIService) { }

  private readonly handlers: Record<string, TranslationHandlerFn> = {
    openai: this.handleOpenAI.bind(this),
    googlecloud: this.handleGoogleCloud.bind(this),
  };

  async dispatch(options: TranslationDispatchOptions): Promise<string | null> {
    const { message, to, from, platform, creds } = options;
    const prompt = PromptHelper?.BuildTranslationPrompt(message, to, from);
    const key = platform?.toLowerCase();
    const handler = this.handlers[key];
    return handler ? handler(prompt, message, to, creds) : null;
  }

  private async handleOpenAI(prompt: string, creds: GoogleCloudCredentials): Promise<string | null> {
    try {
      const response = await this.openai?.chatCompletion(prompt, creds?.APIKey);
      return response;
    } catch (err: unknown) {
      this.logger.error(languageTransResponseMessages?.TranslationFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  private async handleGoogleCloud(prompt: string, message: string, to: string, creds: GoogleCloudCredentials): Promise<string | null> {
    try {
      const translateClient = new Translate({
        credentials: { private_key: creds?.APIKey, client_email: creds?.ClientEmail },
        projectId: creds?.ProjectId,
      });
      const [translated] = await translateClient.translate(message, to);
      return translated;
    } catch (err: unknown) {
      this.logger.error(languageTransResponseMessages?.TranslationFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }
}