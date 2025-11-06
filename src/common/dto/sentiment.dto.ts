import { IsOptional, IsString, IsEnum } from 'class-validator';

export class SentimentAnalysisQueryDto {
  @IsOptional()
  @IsString()
  Message?: string;

  @IsOptional()
  @IsString()
  MessageID?: string;

  @IsOptional()
  @IsString()
  ReqId?: string;

  @IsOptional()
  @IsString()
  ReqCode?: string;

  @IsOptional()
  @IsString()
  UXID?: string;

  @IsOptional()
  @IsString()
  ProcessCode?: string;

  @IsOptional()
  @IsEnum(['T', 'F'])
  SentenceScore?: 'T' | 'F';

  @IsOptional()
  @IsEnum(['T', 'F'])
  OverallScore?: 'T' | 'F';
}