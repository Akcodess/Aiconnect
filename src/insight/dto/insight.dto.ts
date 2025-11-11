import { IsArray, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { insightResponseCodes, insightResponseMessages, validInsights } from '../constants/insight.constants';

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

// Standardized response envelope DTO for Insight,
// matching the structure produced by ResponseHelperService.successNest
export class InsightResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? insightResponseMessages?.InsightSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? insightResponseCodes?.InsightSuccess)
  EvCode!: string;

  @Expose()
  @Transform(({ value }) => value ?? EvType.Success)
  EvType!: EvType;

  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqId?: string;

  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqCode?: string;

  @Expose()
  @Type(() => InsightResponseDto)
  Data!: InsightResponseDto;
}