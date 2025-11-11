import { IsArray, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

import { insightResponseMessages, validInsights } from '../constants/insight.constants';

export class InsightDto {
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

  @IsNotEmpty()
  Message!: string | Record<string, any> | any[];

  @IsOptional()
  @IsArray()
  @IsIn(validInsights as unknown as readonly string[], { each: true, message: insightResponseMessages?.InvalidAllowedInsight })
  AllowedInsights?: typeof validInsights[number][];

  @IsArray()
  @IsNotEmpty()
  DispositionList!: string[];

  @IsArray()
  @IsNotEmpty()
  QuestionAnswer!: Array<{ question: string; answers: string[] }>;
}

export class InsightResponseDto {
  Insight!: Record<string, any>;
}