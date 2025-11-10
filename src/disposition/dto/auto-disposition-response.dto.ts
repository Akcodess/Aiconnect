import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { dispositionResponseCodes, dispositionResponseMessages } from '../constants/disposition.constants';

export class AutoDispositionResponseDto {
  @Expose()
  Disposition!: string;
}

export class AutoDispositionResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? dispositionResponseMessages?.DispositionSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? dispositionResponseCodes?.AutoDispositionSuccess)
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
  @Type(() => AutoDispositionResponseDto)
  Data!: AutoDispositionResponseDto;
}