import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { responseCodes, responseMessages } from '../../sentiment/constants/sentiment.constants';
import { SentimentTextChatResponseDto } from './sentiment-text-chat-response.dto';

// Standardized envelope for Sentiment Text Chat responses (mirrors SentimentAnalysisResponseEnvelopeDto)
export class SentimentTextChatResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? responseMessages?.AnalysisSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? responseCodes?.SentimentAnalysisCompleted)
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
  @Type(() => SentimentTextChatResponseDto)
  Data!: SentimentTextChatResponseDto;
}