import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import { LoggingService } from './logging.util';
import { commonResponseMessages } from '../constants/common.constants';
import { v4 as uuidv4 } from 'uuid';
import { kbResponseMessages } from '../../kb/constants/kb.constants';

@Injectable()
export class AiUtilService {
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
      this.logger.error(commonResponseMessages?.ChatCompletionErrorOpenAI, err?.message || err);
      return null;
    }
  }

  // Google Cloud Vertex AI text generation
  async googleCloudChat(prompt: string, APIKey?: string, ClientEmail?: string, ProjectId?: string): Promise<string | null> {
    try {
      const vertex_ai = new VertexAI({
        project: ProjectId!,
        location: 'us-central1',
        googleAuthOptions: { credentials: { private_key: APIKey, client_email: ClientEmail}}
      });

      const generativeModel = vertex_ai.getGenerativeModel({
        model: process.env.GOOGLECLOUD_MODEL!,
        // generationConfig: { maxOutputTokens: 1000 },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      const request = { contents: [{ role: 'user', parts: [{ text: prompt }] }] } as any;
      const resp = await generativeModel.generateContent(request);
      return resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err: any) {
      this.logger.error(commonResponseMessages?.ChatCompletionErrorGoogle, err?.message || err);
      return null;
    }
  }

  // Initialize a KB for OpenAI by creating a Vector Store and returning KBUID + XPRef meta
  async kbInitOpenAI({ APIKey, XPlatformID }: { APIKey: string; XPlatformID: string }): Promise<any> {
    const openai = new OpenAI({ apiKey: APIKey });

    try {
      const kbuid = uuidv4();
      const vectorStore = await openai.vectorStores.create({
        name: `kb-vector-${kbuid}`,
      });
      const vectorStoreId = vectorStore.id;

      return {
        KBUID: kbuid,
        XPlatformID: XPlatformID,
        XPRef: { VectorStoreId: vectorStoreId },
      };
    } catch (error: any) {
      this.logger.error(kbResponseMessages.kbInitFailed, error?.message || error);
      return null;
    }
  }
}