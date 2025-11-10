import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { SpeechClient, protos } from '@google-cloud/speech';

import { LoggingService } from '../common/utils/logging.util';
import { transcribeResponseMessages } from './constants/transcribe.constants';
import { TranscribeDispatchOptions, TranscribeHandlerFn, OpenAITranscriptionParams, OpenAITranscriptionResponse } from './types/transcribe.types';

@Injectable()
export class TranscribeAIHandlerService {
  constructor(private readonly logger: LoggingService) { }

  private readonly handlers: Record<string, TranscribeHandlerFn> = {
    openai: this.handleOpenAI.bind(this),
    googlecloud: this.handleGoogleCloud.bind(this)
  };

  async dispatch(options: TranscribeDispatchOptions): Promise<string | null> {
    const key = options.platform?.toLowerCase();
    const handler = this.handlers[key];
    return handler ? handler('', options) : null;
  }

  // Helper to build multipart form and post to OpenAI REST transcription endpoint
  private async postOpenAITranscription(params: OpenAITranscriptionParams): Promise<OpenAITranscriptionResponse> {
    const { audioStream, fileExt, mimeType, apiKey } = params;
    const formData = new FormData();
    formData.append('file', audioStream, { filename: `audio.${fileExt}`, contentType: mimeType });
    formData.append('model', process.env.OPENAI_TRANSCRIBE_MODEL);

    const response = await axios.post(process.env.OPENAI_TRANSCRIPT_REST!, formData, { headers: { ...formData.getHeaders(), Authorization: `Bearer ${apiKey}` } });

    return response?.data as OpenAITranscriptionResponse;
  }

  private async handleOpenAI(_: string, options: TranscribeDispatchOptions): Promise<string | null> {
    const { AudioUrl, creds, fileExt, mimeType } = options;
    try {
      const audioStream = await axios.get(AudioUrl, { responseType: 'stream' });
      const data = await this.postOpenAITranscription({ audioStream: audioStream?.data as NodeJS.ReadableStream, fileExt, mimeType, apiKey: creds?.APIKey, model: process.env.OPENAI_TRANSCRIBE_MODEL });

      return data?.text ?? null;
    } catch (err: unknown) {
      this.logger.error(transcribeResponseMessages?.TranscriptionFailed, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  private async handleGoogleCloud(_: string, options: TranscribeDispatchOptions): Promise<string | null> {
    const { AudioUrl, creds, fileExt } = options;
    try {
      const client = new SpeechClient({
        credentials: { client_email: creds?.ClientEmail!, private_key: creds?.APIKey! },
        projectId: creds?.ProjectId,
      });

      const audioResponse = await axios.get(AudioUrl!, { responseType: 'arraybuffer' });
      const audioBytes = Buffer.from(audioResponse.data as ArrayBuffer).toString('base64');

      let encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16;
      const ext = (fileExt || '').toLowerCase();
      if (ext === 'mp3') encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3;
      else if (ext === 'flac') encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.FLAC;
      else if (ext === 'mulaw' || ext === 'ulaw') encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MULAW;

      const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: { content: audioBytes },
        config: {
          encoding,
          languageCode: 'en-US',
        },
      };

      const [response] = await client.recognize(request);
      const transcript = response?.results?.map(r => r.alternatives?.[0]?.transcript ?? '').join('') || '';
      return transcript || null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(transcribeResponseMessages?.TranscriptionFailed, message);
      return null;
    }
  }
}