import { IsArray, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { insightResponseCodes, insightResponseMessages, validInsights } from '../constants/insight.constants';

export class InsightDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Request identifier for tracing.', example: 'req-123' })
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Request code for correlation.', example: 'code-456' })
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User experience identifier for caching and correlation.', example: 'ux-abc' })
  UXID!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Message identifier for caching and correlation.', example: 'msg-001' })
  MessageID!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Process code for cache scoping and identification.', example: 'proc-insight-xyz' })
  ProcessCode!: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Content to analyze for insights (string, object, or array).', example: 'Customer called regarding a billing issue and requested a refund.' })
  Message!: string | Record<string, any> | any[];

  @IsOptional()
  @IsArray()
  @IsIn(validInsights as unknown as readonly string[], { each: true, message: insightResponseMessages?.InvalidAllowedInsight })
  @ApiProperty({ description: 'Optional list of specific insights to compute.', required: false, isArray: true, enum: validInsights, example: ['Summary', 'Sentiment', 'Disposition'] })
  AllowedInsights?: typeof validInsights[number][];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'List of possible dispositions to match from the content.', example: ['Billing issue', 'Request a refund', 'Upgrade plan'] })
  DispositionList!: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'Question-answer pairs to extract from the content.', example: [ { question: 'What is the customer issue?', answers: ['Billing', 'Refund'] } ] })
  QuestionAnswer!: Array<{ question: string; answers: string[] }>;
}

export class InsightResponseDto {
  @ApiProperty({ description: 'Computed insight results keyed by insight type.', example: { Summary: 'Customer requested a refund due to a billing error.', Sentiment: 'Negative', NextAction: 'Issue refund and follow up within 24 hours', Disposition: 'Request a refund', KeywordCount: { Billing: 3, Refund: 1 } } })
  Insight!: Record<string, any>;
}

// Standardized response envelope DTO for Insight,
// matching the structure produced by ResponseHelperService.successNest
export class InsightResponseEnvelopeDto {
  @Expose()
  @ApiProperty({ description: 'Event message', example: insightResponseMessages?.InsightSuccess })
  @Transform(({ value }) => value ?? insightResponseMessages?.InsightSuccess)
  Message!: string;

  @Expose()
  @ApiProperty({ description: 'Event timestamp (YYYY-MM-DD HH:mm:ss)', example: moment().format('YYYY-MM-DD HH:mm:ss') })
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @ApiProperty({ description: 'Event code', example: insightResponseCodes?.InsightSuccess })
  @Transform(({ value }) => value ?? insightResponseCodes?.InsightSuccess)
  EvCode!: string;

  @Expose()
  @ApiProperty({ description: 'Event type', example: EvType.Success })
  @Transform(({ value }) => value ?? EvType.Success)
  EvType!: EvType;

  @Expose()
  @ApiProperty({ description: 'Request identifier', example: 'req-123', required: false })
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqId?: string;

  @Expose()
  @ApiProperty({ description: 'Request code', example: 'code-456', required: false })
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqCode?: string;

  @Expose()
  @ApiProperty({ description: 'Insight result data payload', type: InsightResponseDto })
  @Type(() => InsightResponseDto)
  Data!: InsightResponseDto;
}