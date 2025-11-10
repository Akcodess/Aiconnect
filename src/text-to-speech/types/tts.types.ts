export enum TextToSpeechPlatformSID {
  TextToSpeech = 'TextToSpeech',
}

export interface TextToSpeechDispatchOptions {
  Message: string;
  VoiceModel: string;
  LanguageCode?: string;
  SpeakingRate?: string;
  platform: string;
  creds: {
    APIKey?: string;
    ClientEmail?: string;
    ProjectId?: string;
  };
}

export type TextToSpeechHandlerFn = (
  options: TextToSpeechDispatchOptions
) => Promise<string | Uint8Array | null>;