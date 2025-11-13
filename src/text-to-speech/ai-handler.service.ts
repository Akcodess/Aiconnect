import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';

import { LoggingService } from '../common/utils/logging.util';
import { TextToSpeechDispatchOptions, TextToSpeechHandlerFn } from './types/tts.types';
import { PromptHelper } from '../common/helpers/prompt.helper';
import { AiUtilService } from '../common/utils/ai.util';
import { ttsResponseMessages } from './constants/text-to-speech.constants';

@Injectable()
export class TextToSpeechAIHandlerService {
  constructor(private readonly logger: LoggingService, private readonly ai: AiUtilService) { }

  private readonly handlers: Record<string, TextToSpeechHandlerFn> = {
    openai: this.handleOpenAI.bind(this),
    googlecloud: this.handleGoogleCloud.bind(this),
  };

  async dispatch(options: TextToSpeechDispatchOptions): Promise<string | Uint8Array | null> {
    const key = options.platform?.toLowerCase();
    const handler = this.handlers[key];
    return handler(options) ?? null;
  }

  private async handleOpenAI(options: TextToSpeechDispatchOptions): Promise<string | Uint8Array | null> {
    const { Message, VoiceModel, LanguageCode, SpeakingRate, creds } = options;
    try {
      const openai = new OpenAI({ apiKey: creds?.APIKey });
      let normalizedMessage: string | null = Message!;

      if (LanguageCode) {
        const prompt = PromptHelper?.BuildTextToLanguageTranslate(Message, LanguageCode);
        normalizedMessage = await this.ai?.chatCompletion(prompt!, creds?.APIKey);
        this.logger.info(ttsResponseMessages?.NormalizedMessage, normalizedMessage);
      }

      const validGenders = process.env.OPENAI_SSML_GENDERS!;
      const gender = validGenders?.includes(VoiceModel as any) ? VoiceModel : 'alloy';

      const response = await openai.audio.speech.create({
        model: process.env.OPENAI_TTS_MODEL!,
        voice: gender as any || 'alloy',
        input: normalizedMessage as string,
        response_format: process.env.AUDIO_EXT as any,
        speed: parseFloat(SpeakingRate || '1.0')
      });
      return Buffer.from(await response.arrayBuffer()) || null;
    } catch (err: unknown) {
      this.logger.error(ttsResponseMessages?.OpenaiHandlerError, err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  private async handleGoogleCloud(options: TextToSpeechDispatchOptions): Promise<string | Uint8Array | null> {
    const { Message, VoiceModel, LanguageCode, SpeakingRate, creds } = options;
    try {
      const client = new TextToSpeechClient({
        credentials: { private_key: creds?.APIKey, client_email: creds?.ClientEmail },
        projectId: creds?.ProjectId,
      });

      let normalizedMessage: string | null = Message!;

      if (LanguageCode) {
        const prompt = PromptHelper?.BuildTextToLanguageTranslate(Message!, LanguageCode!);
        normalizedMessage = await this.ai?.googleCloudChat(prompt!, creds?.APIKey, creds?.ClientEmail, creds?.ProjectId);
        this.logger.info(ttsResponseMessages?.NormalizedMessage, normalizedMessage);
      }

      const validGenders = process.env.GOOGLECLOUD_SSML_GENDERS!;
      const gender = validGenders.includes(VoiceModel as any) ? VoiceModel : 'NEUTRAL';
      const [response] = await client?.synthesizeSpeech({ input: { text: normalizedMessage }, voice: { languageCode: LanguageCode || 'en-US', ssmlGender: gender as any }, audioConfig: { audioEncoding: (process.env.AUDIO_EXT as any)?.toUpperCase(), speakingRate: parseFloat(SpeakingRate || '1.0') } });
      return response.audioContent || null;
    } catch (err: any) {
      this.logger.error(ttsResponseMessages?.GoogleCloudHandlerError, err.message);
      return null;
    }
  }
}