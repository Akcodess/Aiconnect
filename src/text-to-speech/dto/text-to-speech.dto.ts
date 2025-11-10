import { IsString, IsOptional } from 'class-validator';

export class TextToSpeechDto {
  @IsString()
  Message!: string;

  @IsString()
  VoiceModel!: string;

  @IsOptional()
  @IsString()
  LanguageCode?: string;

  @IsOptional()
  @IsString()
  SpeakingRate?: string;

  @IsString()
  ReqId!: string;

  @IsString()
  ReqCode!: string;

  @IsString()
  UXID!: string;

  @IsString()
  MessageID!: string;

  @IsString()
  ProcessCode!: string;
}