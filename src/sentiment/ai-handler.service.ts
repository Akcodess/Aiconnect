import { Injectable } from '@nestjs/common';
import { LanguageServiceClient } from '@google-cloud/language';

import { AIHandlerParams, AIHandlerParamsSentimenrtTextChat, TextChatSpeakerSentiment } from './types/sentiment.types';
import { LoggingService } from '../common/utils/logging.util';
import { SentimentUtilityService } from './utils/sentiment.util';
import { PromptHelper } from '../common/helpers/prompt.helper';
import { OpenAIService } from '../common/utils/openai.util';
import { googleCloudMesssages, openaiMessages } from './constants/sentiment.constants';

@Injectable()
export class AIHandlerService {
  constructor(private logger: LoggingService, private sentimentUtil: SentimentUtilityService, private openai: OpenAIService) { }

  // Dispatcher aligned with requested platforms
  private readonly sentimentHandlers: Record<string, (params: AIHandlerParams) => Promise<number | Record<number, { Category: string; Score: number }> | null>> = {
    openai: this.handleOpenAI.bind(this),
    googlecloud: this.handleGoogleCloud.bind(this),
  };

  // Dispatcher for Sentiment Text Chat (per-speaker analysis)
  private readonly sentimentTextChatHandlers: Record<string, (params: AIHandlerParamsSentimenrtTextChat) => Promise<Record<string, TextChatSpeakerSentiment> | null>> = {
    openai: this.handleTextChatOpenAI.bind(this),
    googlecloud: this.handleTextChatGoogleCloud.bind(this),
  };

  async handleSentimentAnalysis(params: AIHandlerParams, platform: string): Promise<number | Record<number, { Category: string; Score: number }> | null> {
    const key = platform?.toLowerCase();
    const handler = this.sentimentHandlers[key];
    return await handler(params);
  }

  async handleSentimentTextChat(params: AIHandlerParamsSentimenrtTextChat, platform: string): Promise<Record<string, TextChatSpeakerSentiment> | null> {
    const key = platform?.toLowerCase();
    const handler = this.sentimentTextChatHandlers[key];
    return await handler(params);
  }

  // Normalize union message into a single string suitable for prompt building
  private normalizeTextChatMessage(message: string | Record<string, string>): string {
    if (typeof message === 'string') return message;
    return Object.entries(message).map(([speaker, text]) => `${speaker}: ${text}`).join('\n');
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
    } catch (err: unknown) {
      this.logger.error(openaiMessages?.OpenaiHandlerError, err instanceof Error ? err.message : String(err));
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
        const sentences: Array<{ sentiment?: { score?: number } }> = result.sentences as Array<{ sentiment?: { score?: number } }>;
        sentences.forEach((sentence, index: number) => {
          const s = typeof sentence?.sentiment?.score === 'number' ? sentence.sentiment.score! : 0;
          sentenceScores[index + 1] = {
            Category: this.sentimentUtil.getSentimentLabel(s),
            Score: parseFloat(s.toFixed(2)),
          };
        });
        return sentenceScores;
      } else {
        return overall;
      }
    } catch (err: unknown) {
      this.logger.error(googleCloudMesssages?.GoogleCloudHandlerError, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  // OPENAI implementation for Sentiment Text Chat
  private async handleTextChatOpenAI({ Message, APIKey }: AIHandlerParamsSentimenrtTextChat): Promise<Record<string, TextChatSpeakerSentiment> | null> {
    try {
      const prompt = PromptHelper?.BuildSentimentTextChatPrompt(this.normalizeTextChatMessage(Message));
      const raw = await this.openai?.chatCompletion(prompt, APIKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Record<string, TextChatSpeakerSentiment>;
      return parsed;
    } catch (err: unknown) {
      this.logger.error(openaiMessages?.OpenaiHandlerError, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  // Google Cloud implementation for Sentiment Text Chat (per speaker)
  private async handleTextChatGoogleCloud({ Message, APIKey, ClientEmail, ProjectId }: AIHandlerParamsSentimenrtTextChat): Promise<Record<string, TextChatSpeakerSentiment> | null> {
    try {
      const client = new LanguageServiceClient({
        credentials: { private_key: APIKey, client_email: ClientEmail },
        projectId: ProjectId,
      });

      // Ensure we have a speaker->text map even if Message is a simple string
      const parsed: Record<string, string> = typeof Message === 'string' ? { default: Message } : Message;
      const response: Record<string, TextChatSpeakerSentiment> = {};

      for (const speaker in parsed) {
        const content = parsed[speaker];
        const [result] = await client.analyzeSentiment({ document: { content, type: 'PLAIN_TEXT' } });

        const overallScore = result.documentSentiment?.score ?? 0;
        const sentences: Array<{ sentiment?: { score?: number } }> = Array.isArray(result?.sentences) ? (result.sentences as Array<{ sentiment?: { score?: number } }>) : [];

        const sentenceScore: Record<number, { Category: string; Score: number }> = {};
        sentences.forEach((s, i) => {
          const score = typeof s?.sentiment?.score === 'number' ? s.sentiment.score! : 0;
          sentenceScore[i + 1] = {
            Category:  this.sentimentUtil?.getSentimentLabel(score),
            Score: parseFloat(score.toFixed(2)),
          };
        });

        response[speaker] = {
          OverallCategory:  this.sentimentUtil?.getSentimentLabel(overallScore),
          OverallScore: parseFloat(overallScore.toFixed(2)),
          SentenceScore: sentenceScore,
        };
      }
      return response;
    } catch (err: unknown) {
      this.logger.error(googleCloudMesssages?.GoogleCloudHandlerError, err instanceof Error ? err.message : String(err));
      return null;
    }
  }
}