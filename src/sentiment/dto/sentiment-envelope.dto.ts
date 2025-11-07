import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { SentimentAnalysisResponseDto } from './sentiment-response.dto';
import { responseCodes, responseMessages } from '../../sentiment/constants/sentiment.constants';

// Standardized response envelope DTO for Sentiment analysis,
// matching the structure produced by ResponseHelperService.successNest
export class SentimentAnalysisResponseEnvelopeDto {
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
  @Type(() => SentimentAnalysisResponseDto)
  Data!: SentimentAnalysisResponseDto;
}