import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbFileDeleteResult } from '../types/kb.types';

// Response envelope for DELETE /kb/file/:id
export class KbFileDeleteResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.fileDeleteSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.fileDeleteSuccess)
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
  @Type(() => Object)
  Data!: KbFileDeleteResult;
}