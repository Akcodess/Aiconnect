import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { languageTransResponseCodes, languageTransResponseMessages } from '../constants/language-trans.constants';


export class TranslationResponseDto {
  @Expose()
  TranslatedMessage!: string;

  @Expose()
  From?: string;

  @Expose()
  To!: string;
}
export class TranslationResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? languageTransResponseMessages?.TranslationSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? languageTransResponseCodes?.TranslationSuccess)
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
  @Type(() => TranslationResponseDto)
  Data!: TranslationResponseDto;
}