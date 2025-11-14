import { IsString, IsNotEmpty} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbFileUploadResult } from '../types/kb.types';

// Request DTO for POST /kb/file (upload KB file)
export class KbFileUploadDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  KBUID!: string;

  @IsString()
  @IsNotEmpty()
  FileName!: string;

  @IsString()
  @IsNotEmpty()
  FileURL!: string;
}

// Response envelope for KB file upload
export class KbFileUploadResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.fileUploadSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.fileUploadSuccess)
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
  Data!: KbFileUploadResult;
}