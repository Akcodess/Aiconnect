import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import { LoggingService } from './logging.util';
import { commonResponseMessages } from '../constants/common.constants';
import { v4 as uuidv4 } from 'uuid';
import { kbResponseMessages } from '../../kb/constants/kb.constants';
import type { KbFileUploadOpenAIParams, KbFileUploadResult } from '../../kb/types/kb.types';
import type { KbVectorStoreFileInput, KbVectorStoreFileResult, KbAssistantCreateInput, KbAssistantCreateResult, KbAssistantUpdateResult, KbThreadCreateResult, KbRunMessageInput, KbRunMessageResult } from '../../kb/types/kb.types';
import { KbStatus } from '../../kb/types/kb.types';
import { utilMessages } from '../constants/util.contant';

@Injectable()
export class AiUtilService {
  constructor(private readonly logger: LoggingService) { }

  async chatCompletion(prompt: string, apiKey?: string): Promise<string | null> {
    try {
      const openai = new OpenAI({ apiKey });
      const response = await openai?.chat?.completions.create({
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
        googleAuthOptions: { credentials: { private_key: APIKey, client_email: ClientEmail } }
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


  //KB AI Handler
  // Initialize a KB for OpenAI by creating a Vector Store and returning KBUID + XPRef meta
  async kbInitOpenAI({ APIKey, XPlatformID }: { APIKey: string; XPlatformID: string }): Promise<any> {
    const openai = new OpenAI({ apiKey: APIKey });

    try {
      const kbuid = uuidv4();
      const vectorStore = await openai?.vectorStores.create({ name: `kb-vector-${kbuid}` });
      const vectorStoreId = vectorStore.id;

      return { KBUID: kbuid, XPlatformID: XPlatformID, XPRef: { VectorStoreId: vectorStoreId } };
    } catch (error: any) {
      this.logger.error(kbResponseMessages.kbInitFailed, error?.message || error);
      return null;
    }
  }

  // Delete a file in OpenAI (used for KB file cleanup)
  async kbDeleteFileOpenAI({ APIKey, FileId }: { APIKey: string; FileId: string }): Promise<boolean> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      const resp = await openai?.files.delete(FileId as any);
      return !!resp;
    } catch (error: any) {
      this.logger.warn(utilMessages?.KbFileDeleteError, error?.message || error);
      return false;
    }
  }

  // Delete a vector store in OpenAI
  async kbDeleteVectorStoreOpenAI({ APIKey, VectorStoreId }: { APIKey: string; VectorStoreId: string }): Promise<boolean> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      const resp = await openai?.vectorStores?.delete?.(VectorStoreId);
      return !!resp;
    } catch (error: any) {
      this.logger.warn(utilMessages?.KbDeleteVectorStoreError, error?.message || error);
      return false;
    }
  }

  // Delete an assistant in OpenAI
  async kbDeleteAssistantOpenAI({ APIKey, AssistantId }: { APIKey: string; AssistantId: string }): Promise<boolean> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      const resp = await openai?.beta?.assistants?.delete?.(AssistantId);
      return !!resp;
    } catch (error: any) {
      this.logger.warn(utilMessages?.KbDeleteAssistantError, error?.message || error);
      return false;
    }
  }

  // Upload a file to OpenAI assistants files and return XPRef meta for KB
  async kbFileUploadOpenAI({ APIKey, KBUID, FileName, FileURL }: KbFileUploadOpenAIParams): Promise<KbFileUploadResult | null> {
    const openai = new OpenAI({ apiKey: APIKey });
    const uploadDir = path.join(__dirname, process.env.OPENAI_KB_FILE_PATH!);
    const localFilePath = path.join(uploadDir, FileName);

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const response = await axios.get(FileURL, { responseType: 'stream' });
      const writer = fs.createWriteStream(localFilePath);

      await new Promise<void>((resolve, reject) => {
        response.data.pipe(writer);
        writer.on('finish', () => resolve());
        writer.on('error', (err: any) => reject(err));
      });

      const upload = await openai.files.create({ file: fs.createReadStream(localFilePath), purpose: 'assistants' });

      // Clean up local temp file
      fs.unlinkSync(localFilePath);

      return { KBUID, FileName, FileURL, XPRef: { FileId: upload.id, Status: KbStatus?.Inactive } } as KbFileUploadResult;
    } catch (error: any) {
      this.logger.error(kbResponseMessages.fileUploadFailed, error?.message || error);
      return null;
    }
  }

  // Link uploaded files to a Vector Store in OpenAI
  async kbVectorStoreFileOpenAI({ APIKey, VectorStoreId, FileIds }: { APIKey: string } & KbVectorStoreFileInput): Promise<KbVectorStoreFileResult | null> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      for (const fileId of FileIds) {
        await openai?.vectorStores?.files?.create?.(VectorStoreId!, { file_id: fileId });
      }
      return { VectorStoreId, FileIds };
    } catch (error: any) {
      this.logger.error(kbResponseMessages?.vectorStoreFileFailed, error?.message || error);
      return null;
    }
  }

  // Delete files from a Vector Store in OpenAI
  async kbVectorStoreFileDeleteOpenAI({ APIKey, VectorStoreId, FileIds }: { APIKey: string } & KbVectorStoreFileInput): Promise<KbVectorStoreFileResult | null> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      for (const fileId of FileIds) {
        await openai?.vectorStores?.files?.delete?.(fileId, { vector_store_id: VectorStoreId! });
      }
      return { VectorStoreId, FileIds };
    } catch (error: any) {
      this.logger.error(kbResponseMessages?.vectorStoreFileDeleteFailed, error?.message || error);
      return null;
    }
  }

  // Create an assistant in OpenAI and attach vector store via file_search tool
  async kbAssistantCreateOpenAI({ APIKey, VectorStoreId, Name, Instructions, KBUID }: { APIKey: string } & KbAssistantCreateInput): Promise<KbAssistantCreateResult | null> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      const assistant = await openai?.beta.assistants?.create?.({
        name: Name,
        instructions: Instructions,
        model: process.env.OPENAI_MODEL!,
        tools: [{ type: 'file_search' }],
        tool_resources: {
          file_search: {
            vector_store_ids: [VectorStoreId!]
          }
        }
      });

      return { Code: Math.random().toString(36).substring(2, 15), KBUID, Name, Instructions, XPRef: { AssistantId: assistant?.id, Status: KbStatus.Active } } as KbAssistantCreateResult;
    } catch (error: any) {
      this.logger.error(kbResponseMessages.assistantCreateFailed, error?.message || error);
      return null;
    }
  }

  // Update an assistant in OpenAI (instructions only)
  async kbAssistantUpdateOpenAI({ APIKey, AssistantId, Instructions }: { APIKey: string; AssistantId: string; Instructions: string }): Promise<KbAssistantUpdateResult | null> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      const assistant = await openai?.beta?.assistants?.update?.(AssistantId!, { instructions: Instructions });
      if (!assistant) return null;
      return { AssistantId, Instructions } as KbAssistantUpdateResult;
    } catch (error: any) {
      this.logger.error(kbResponseMessages?.assistantUpdateFailed, error?.message || error);
      return null;
    }
  }

  // Create a thread in OpenAI
  async kbThreadCreateOpenAI({ APIKey }: { APIKey: string }): Promise<KbThreadCreateResult | null> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      const thread = await openai.beta.threads.create();
      return { threadId: thread?.id } as KbThreadCreateResult;
    } catch (error: any) {
      this.logger.error(kbResponseMessages?.threadCreateFailed, error?.message || error);
      return null;
    }
  }

  // Run a message in a thread and start an assistant run
  async kbRunMessageOpenAI({ APIKey, Message, ThreadId, AssistantId }: { APIKey: string } & KbRunMessageInput): Promise<KbRunMessageResult | null> {
    const openai = new OpenAI({ apiKey: APIKey });
    try {
      // Add user's message to thread
      await openai?.beta?.threads?.messages?.create?.(ThreadId!, {
        role: 'user',
        content: Message!,
      });

      // Run the assistant on the thread to generate a response
      const run = await openai?.beta?.threads?.runs?.create?.(ThreadId!, {
        assistant_id: AssistantId!,
      });

      return { ThreadId, RunId: run?.id! } as KbRunMessageResult;
    } catch (error: any) {
      this.logger.error(kbResponseMessages?.runMessageFailed, error?.message || error);
      return null;
    }
  }
}