import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LoggingService } from '../../common/utils/logging.util';

@Injectable()
export class OpenAIService {
  constructor(private readonly logger: LoggingService) { }

  async chatCompletion(prompt: string, apiKey?: string): Promise<string | null> {
    try {
      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL!,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      return response.choices?.[0]?.message?.content?.trim() || null;
    } catch (err: any) {
      this.logger.error('OpenAI ChatCompletionError', err?.message || err);
      return null;
    }
  }
}