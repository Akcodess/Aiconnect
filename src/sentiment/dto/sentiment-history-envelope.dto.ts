import { Expose, Transform } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { responseCodes, responseMessages } from '../../sentiment/constants/sentiment.constants';

// Standardized envelope for Sentiment History responses (mirrors other envelopes)
export class SentimentHistoryResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? responseMessages?.HistorySuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? responseCodes?.SentimentHistoryCompleted)
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

  // Mixed array of sentiment analysis and text chat response objects
  @Expose()
  Data!: unknown[];
}