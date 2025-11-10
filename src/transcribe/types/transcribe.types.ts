export enum TranscribePlatformSID {
  SpeechToText = 'SpeechToText',
}

export interface TranscribeDispatchOptions {
  AudioUrl: string;
  fileExt?: string;
  mimeType?: string;
  NumSpeakers?: string;
  LanguageCode?: string;
  SpeakerNames?: string;
  platform: string;
  creds: TranscribeCredentials;
  RestEndpoint?: string;
}

export interface TranscribeCredentials {
  APIKey?: string;
  ClientEmail?: string;
  ProjectId?: string;
}

export type TranscribeHandlerFn = (
  prompt: string,
  options: TranscribeDispatchOptions,
) => Promise<string | null>;

// Parameters interface for postOpenAITranscription helper
export interface OpenAITranscriptionParams {
  audioStream: NodeJS.ReadableStream;
  fileExt?: string;
  mimeType?: string;
  apiKey?: string;
  model?: string;
}

// Response interface from OpenAI transcription endpoint
export interface OpenAITranscriptionResponse {
  text?: string;
  transcript?: string;
  result?: string;
  [key: string]: unknown;
}

// Optional: function type if you want to type the helper signature via types
export type PostOpenAITranscriptionFn = (
  params: OpenAITranscriptionParams
) => Promise<OpenAITranscriptionResponse>;