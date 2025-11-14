import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { responseCodes, responseMessages } from '../../sentiment/constants/sentiment.constants';

// Standardized envelope for Sentiment History responses (mirrors other envelopes)
export class SentimentHistoryResponseEnvelopeDto {
  @ApiProperty({ description: 'Status message', example: 'Sentiment history fetched successfully' })
  @Expose()
  @Transform(({ value }) => value ?? responseMessages?.HistorySuccess)
  Message!: string;

  @ApiProperty({ description: 'Timestamp of the response', example: '2025-01-01 12:00:00' })
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @ApiProperty({ description: 'Event code representing the outcome', example: 'SentimentHistoryCompleted' })
  @Expose()
  @Transform(({ value }) => value ?? responseCodes?.SentimentHistoryCompleted)
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

  // Mixed array of sentiment analysis and text chat response objects
  @ApiProperty({ description: 'Array of historical sentiment responses', example: [
    {
      OverallCategory: 'Slightly Positive',
      OverallScore: 0.44,
      SentenceScore: {
        '1': { Category: 'Neutral', Score: 0.1 },
        '2': { Category: 'Slightly Positive', Score: 0.5 }
      },
      AverageScore: 0.3
    },
    {
      Sentiment: {
        Speaker1: {
          OverallCategory: 'Neutral',
          OverallScore: 0.1,
          SentenceScore: { '1': { Category: 'Neutral', Score: 0.0 } }
        },
        Speaker2: {
          OverallCategory: 'Slightly Positive',
          OverallScore: 0.6,
          SentenceScore: { '1': { Category: 'Slightly Positive', Score: 0.6 } }
        }
      },
      AverageScore: 0.35
    }
  ] })
  @Expose()
  Data!: unknown[];
}