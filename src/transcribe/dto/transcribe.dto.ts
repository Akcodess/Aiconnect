import { IsOptional, IsString, IsUrl, IsNotEmpty, IsNumberString } from 'class-validator';

export class TranscribeDto {
  @IsUrl()
  @IsNotEmpty()
  AudioUrl!: string;

  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  UXID!: string;

  @IsString()
  @IsNotEmpty()
  MessageID!: string;

  @IsString()
  @IsNotEmpty()
  ProcessCode!: string;

  @IsOptional()
  @IsNumberString()
  NumSpeakers?: string;

  @IsOptional()
  @IsString()
  LanguageCode?: string;

  @IsOptional()
  @IsString()
  SpeakerNames?: string;
}