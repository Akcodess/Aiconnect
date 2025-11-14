import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { SentimentAnalysisResponseDto } from './sentiment-response.dto';
import { responseCodes, responseMessages } from '../../sentiment/constants/sentiment.constants';

// Standardized response envelope DTO for Sentiment analysis,
// matching the structure produced by ResponseHelperService.successNest
export class SentimentAnalysisResponseEnvelopeDto {
  @ApiProperty({ description: 'Status message', example: 'Sentiment analysis completed successfully' })
  @Expose()
  @Transform(({ value }) => value ?? responseMessages?.AnalysisSuccess)
  Message!: string;

  @ApiProperty({ description: 'Timestamp of the response', example: '2025-01-01 12:00:00' })
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @ApiProperty({ description: 'Event code representing the outcome', example: 'SentimentAnalysisCompleted' })
  @Expose()
  @Transform(({ value }) => value ?? responseCodes?.SentimentAnalysisCompleted)
  EvCode!: string;

  @ApiProperty({ description: 'Event type', enum: EvType, example: EvType.Success })
  @Expose()
  @Transform(({ value }) => value ?? EvType.Success)
  EvType!: EvType;

  @ApiProperty({ description: 'Request ID for correlation', required: false, example: 'req-123' })
  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqId?: string;

  @ApiProperty({ description: 'Request code for correlation', required: false, example: 'code-456' })
  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqCode?: string;

  @ApiProperty({ description: 'Payload containing sentiment analysis results', type: () => SentimentAnalysisResponseDto, example: {
    OverallCategory: 'Slightly Positive',
    OverallScore: 0.62,
    SentenceScore: {
      '1': { Category: 'Slightly Positive', Score: 0.6 },
      '2': { Category: 'Neutral', Score: 0.0 }
    },
    AverageScore: 0.31
  } })
  @Expose()
  @Type(() => SentimentAnalysisResponseDto)
  Data!: SentimentAnalysisResponseDto;
}