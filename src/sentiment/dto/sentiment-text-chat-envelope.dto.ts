import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { responseCodes, responseMessages } from '../../sentiment/constants/sentiment.constants';
import { SentimentTextChatResponseDto } from './sentiment-text-chat-response.dto';

// Standardized envelope for Sentiment Text Chat responses (mirrors SentimentAnalysisResponseEnvelopeDto)
export class SentimentTextChatResponseEnvelopeDto {
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

  @ApiProperty({ description: 'Payload containing text chat sentiment results', type: () => SentimentTextChatResponseDto, example: {
    Sentiment: {
      Speaker1: {
        OverallCategory: 'Neutral',
        OverallScore: 0.12,
        SentenceScore: { '1': { Category: 'Neutral', Score: 0.0 } }
      },
      Speaker2: {
        OverallCategory: 'Strongly Positive',
        OverallScore: 0.91,
        SentenceScore: { '1': { Category: 'Strongly Positive', Score: 0.91 } }
      }
    },
    AverageScore: 0.52
  } })
  @Expose()
  @Type(() => SentimentTextChatResponseDto)
  Data!: SentimentTextChatResponseDto;
}