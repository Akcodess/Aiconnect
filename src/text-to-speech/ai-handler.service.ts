import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { LoggingService } from '../common/utils/logging.util';
import { TextToSpeechDispatchOptions, TextToSpeechHandlerFn } from './types/tts.types';
import { PromptHelper } from '../common/helpers/prompt.helper';
import { OpenAIService } from '../common/utils/openai.util';
import { ttsResponseMessages } from './constants/text-to-speech.constants';

@Injectable()
export class TextToSpeechAIHandlerService {
  constructor(private readonly logger: LoggingService, private readonly openai: OpenAIService) { }

  private readonly handlers: Record<string, TextToSpeechHandlerFn> = {
    openai: this.handleOpenAI.bind(this),
    // googlecloud: this.handleGoogleCloud.bind(this),
  };

  async dispatch(options: TextToSpeechDispatchOptions): Promise<string | Uint8Array | null> {
    const key = options.platform?.toLowerCase();
    const handler = this.handlers[key];
    return handler(options) ?? null;
  }

  private async handleOpenAI(options: TextToSpeechDispatchOptions): Promise<Uint8Array | null> {
    const { Message, VoiceModel, LanguageCode, SpeakingRate, creds } = options;
    try {
      const openai = new OpenAI({ apiKey: creds?.APIKey });
      let normalizedMessage: string | null = Message!;

      if (LanguageCode) {
        const prompt = PromptHelper?.BuildTextToLanguageTranslate(Message, LanguageCode);
        normalizedMessage = await this.openai?.chatCompletion(prompt!, creds?.APIKey);
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

  // private async handleGoogleCloud(options: TextToSpeechDispatchOptions): Promise<Uint8Array | null> {
  //   const { Message, VoiceModel, LanguageCode, SpeakingRate, creds } = options;
  //   try {
  //     const client = new TextToSpeechClient({
  //       credentials: { client_email: creds?.ClientEmail ?? '', private_key: creds?.APIKey ?? '' },
  //       projectId: creds?.ProjectId,
  //     });

  //     const speakingRateNum: number | undefined = SpeakingRate ? Number(SpeakingRate) : undefined;

  //     const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
  //       input: { text: Message ?? '' },
  //       voice: {
  //         languageCode: LanguageCode ?? 'en-US',
  //         name: VoiceModel,
  //       },
  //       audioConfig: {
  //         audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
  //         speakingRate: speakingRateNum,
  //       },
  //     };

  //     const [response] = await client.synthesizeSpeech(request);
  //     return response?.audioContent ?? null;
  //   } catch (err: unknown) {
  //     const message = err instanceof Error ? err.message : String(err);
  //     this.logger.error('Google Cloud TTS handler error', message);
  //     return null;
  //   }
  // }
}