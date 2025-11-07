import { IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class SentimentAnalysisQueryDto {
  @IsString()
  @IsNotEmpty()
  Message!: string;

  @IsString()
  @IsNotEmpty()
  MessageID!: string;

  @IsString()
  @IsNotEmpty()
  ReqId?: string;

  @IsString()
  @IsNotEmpty()
  ReqCode?: string;

  @IsString()
  @IsNotEmpty()
  UXID!: string;

  @IsString()
  @IsNotEmpty()
  ProcessCode!: string;

  @IsNotEmpty()
  @IsEnum(['T', 'F'])
  SentenceScore?: 'T' | 'F';

  @IsOptional()
  @IsEnum(['T', 'F'])
  OverallScore?: 'T' | 'F';
}