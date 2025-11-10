import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';
import { EvType } from '../../common/enums/evtype.enums';
import { TranscribeResponseDto } from './transcribe-response.dto';
import { transcribeResponseCodes, transcribeResponseMessages } from '../constants/transcribe.constants';

export class TranscribeResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? transcribeResponseMessages?.TranscriptionSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? transcribeResponseCodes?.TranscribeSuccess)
  EvCode!: string;

  @Expose()
  @Transform(({ value }) => value ?? EvType.Success)
  EvType!: EvType;

  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqId!: string;

  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqCode!: string;

  @Expose()
  @Type(() => TranscribeResponseDto)
  Data!: TranscribeResponseDto;
}