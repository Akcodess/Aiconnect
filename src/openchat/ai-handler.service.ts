import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { LoggingService } from '../common/utils/logging.util';
import { openChatInstructions, openChatResponseMessages } from './constants/openchat.constants';
import type { OpenChatChatInput, OpenChatChatResult } from './types/openchat.types';
import { RunStatus } from './enums/openchat.enum';

@Injectable()
export class OpenChatAIHandlerService {
  constructor(private readonly logger: LoggingService) { }

  async createAssistantOpenAI(apiKey?: string): Promise<string | null> {
    try {
      const openai = new OpenAI({ apiKey });
      const assistant = await openai.beta.assistants.create({
        name: 'SessionBot',
        instructions: openChatInstructions,
        model: process.env.OPENAI_MODEL!,
      });
      return assistant.id;
    } catch (error: unknown) {
      this.logger.error(openChatResponseMessages?.OpenChatCreateAssistantError, error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  async createThreadOpenAI(apiKey?: string): Promise<string | null> {
    try {
      const openai = new OpenAI({ apiKey });
      const thread = await openai.beta.threads.create();
      return thread.id;
    } catch (error: unknown) {
      this.logger.error(openChatResponseMessages?.OpenChatCreateThreadError, error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  async runOpenChatOpenAI({ Message, APIKey, AssistantId, ThreadId }: OpenChatChatInput): Promise<OpenChatChatResult | null> {
    const openai = new OpenAI({ apiKey: APIKey });

    try {
      // Add user's message to thread
      await openai.beta.threads.messages.create(ThreadId!, {
        role: 'user',
        content: Message!,
      });

      // Run the assistant on the thread to generate a response
      const run = await openai.beta.threads.runs.create(ThreadId!, {
        assistant_id: AssistantId!,
      });

      // Poll for run completion
      let runStatus: { status: string };
      do {
        runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: ThreadId! });
        if (runStatus.status !== RunStatus?.Completed) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      } while (runStatus.status !== RunStatus?.Completed);

      // Fetch all messages for thread, and extract latest assistant response
      const allMessages = await openai.beta.threads.messages.list(ThreadId!);
      const assistantReply = allMessages?.data.find((msg) => msg.role === 'assistant');

      return {
        ThreadId,
        AssistantId,
        reply: assistantReply?.content?.[0],
        messages: allMessages.data.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      };
    } catch (error: unknown) {
      this.logger.error(openChatResponseMessages?.OpenChatHandlerError, error instanceof Error ? error.message : String(error));
      return null;
    }
  }
}