import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class AutoDispositionDto {
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
  ProcessCode!: string;

  @IsString()
  @IsNotEmpty()
  ConversationID!: string;

  @IsString()
  @IsNotEmpty()
  Conversation!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  DispositionList!: string[];
}