import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbAssistantDeleteResult} from '../types/kb.types';

// Response envelope for DELETE /kb/assistant/:id
export class KbAssistantDeleteResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.assistantDeleteSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.assistantDeleteSuccess)
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
  Data!: KbAssistantDeleteResult;
}