import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TranslationDto {
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
  MessageID!: string;

  @IsString()
  @IsNotEmpty()
  Message!: string;

  @IsString()
  @IsOptional()
  From?: string;

  @IsString()
  @IsNotEmpty()
  To!: string;
}