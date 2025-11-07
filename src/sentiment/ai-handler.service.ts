import { Injectable } from '@nestjs/common';
import { LanguageServiceClient } from '@google-cloud/language';

import { AIHandlerParams } from './types/sentiment.types';
import { LoggingService } from '../common/utils/logging.util';
import { SentimentUtilityService } from './utils/sentiment.util';
import { PromptHelper } from '../common/helpers/prompt.helper';
import { OpenAIService } from '../common/utils/openai.util';
import { googleCloudMesssages, openaiMessages } from './constants/sentiment.constants';

@Injectable()
export class AIHandlerService {
  constructor(private logger: LoggingService, private sentimentUtil: SentimentUtilityService, private openai: OpenAIService) { }

  // Dispatcher aligned with requested platforms
  private readonly sentimentHandlers: Record<string, (params: AIHandlerParams) => Promise<any>> = {
    openai: this.handleOpenAI.bind(this),
    googlecloud: this.handleGoogleCloud.bind(this),
  };

  async handleSentimentAnalysis(params: AIHandlerParams, platform: string): Promise<any> {
    const key = platform?.toLowerCase();
    const handler = this.sentimentHandlers[key];
    return await handler(params);
  }

  // OPENAI implementation via Chat Completions API (SDK)
  private async handleOpenAI({ Message, SentenceScore, APIKey }: AIHandlerParams): Promise<number | Record<number, { Category: string; Score: number }> | null> {
    try {
      const prompt = SentenceScore === 'T' ? PromptHelper.BuildSentanceSentimentPrompt(Message) : PromptHelper.BuildSentimentPrompt(Message);

      const raw = await this.openai.chatCompletion(prompt, APIKey);
      if (!raw) return null;

      if (SentenceScore === 'T') {
        return JSON.parse(raw);
      } else {
        return isNaN(parseFloat(raw)) ? null : parseFloat(raw);
      }
    } catch (err: any) {
      this.logger.error(openaiMessages?.OpenaiHandlerError, err?.message || err);
      return null;
    }
  }

  // GoogleCloud implementation placeholder (no external SDK usage to keep build clean)
  private async handleGoogleCloud({ Message, SentenceScore, APIKey, ClientEmail, ProjectId }: AIHandlerParams): Promise<number | Record<number, { Category: string; Score: number }> | null> {
    try {
      const client = new LanguageServiceClient({
        credentials: { private_key: APIKey, client_email: ClientEmail },
        projectId: ProjectId,
      });

      const [result] = await client.analyzeSentiment({
        document: { content: Message!, type: 'PLAIN_TEXT' },
      });
      const baseScore = typeof result?.documentSentiment?.score === 'number' ? result.documentSentiment.score : 0;
      const overall = parseFloat(baseScore.toFixed(2));

      if (SentenceScore === 'T' && Array.isArray(result?.sentences) && result.sentences.length) {
        const sentenceScores: Record<number, { Category: string; Score: number }> = {};
        result.sentences.forEach((sentence: any, index: number) => {
          const s = typeof sentence?.sentiment?.score === 'number' ? sentence.sentiment.score : 0;
          sentenceScores[index + 1] = {
            Category: this.sentimentUtil.getSentimentLabel(s),
            Score: parseFloat(s.toFixed(2)),
          };
        });
        return sentenceScores;
      } else {
        return overall;
      }
    } catch (err: any) {
      this.logger.error(googleCloudMesssages?.GoogleCloudHandlerError, err?.message || err);
      return null;
    }
  }
}