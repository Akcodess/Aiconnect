import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { LoggingService } from '../common/utils/logging.util';
import { openChatInstructions, openChatResponseMessages } from './constants/openchat.constants';

@Injectable()
export class OpenChatAIHandlerService {
  constructor(private readonly logger: LoggingService) {}

  async createAssistantOpenAI(apiKey?: string): Promise<string | null> {
    try {
      const openai = new OpenAI({ apiKey });
      const assistant = await openai.beta.assistants.create({
        name: 'SessionBot',
        instructions: openChatInstructions,
        model: process.env.OPENAI_MODEL!,
      });
      return assistant.id;
    } catch (err: any) {
      this.logger.error(openChatResponseMessages?.OpenChatCreateAssistantError, err?.message || err);
      return null;
    }
  }

  async createThreadOpenAI(apiKey?: string): Promise<string | null> {
    try {
      const openai = new OpenAI({ apiKey });
      const thread = await openai.beta.threads.create();
      return thread.id;
    } catch (err: any) {
      this.logger.error(openChatResponseMessages?.OpenChatCreateThreadError, err?.message || err);
      return null;
    }
  }
}