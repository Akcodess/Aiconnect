import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type {KbAssistantSummary, KbAssistantUpdateResult, KbThreadCreateResult, KbRunMessageResult } from '../types/kb.types';
import { KbStatus } from '../types/kb.types';

// Request DTO for PATCH /kb/assistant (update assistant instructions/status)
export class KbAssistantUpdateDto {
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
  AssistantId!: string;

  @IsString()
  @IsNotEmpty()
  Instructions!: string;

  @IsOptional()
  @IsEnum(KbStatus)
  Status?: KbStatus;
}

// Response envelope for PATCH /kb/assistant
export class KbAssistantUpdateResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.assistantUpdateSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.assistantUpdateSuccess)
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
  Data!: KbAssistantUpdateResult;
}

// Request DTO for GET /kb/assistant (assistant list)
export class KbAssistantListDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  KBUID!: string;
}

// Response envelope for GET /kb/assistant
export class KbAssistantListResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.assistantListSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.assistantListSuccess)
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
  Data!: KbAssistantSummary[];
}

// Request DTO for POST /kb/thread
export class KbThreadCreateDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;
}

// Response envelope for KB thread creation
export class KbThreadCreateResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.threadCreateSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.threadCreateSuccess)
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
  Data!: KbThreadCreateResult;
}

// Request DTO for POST /kb/run-message
export class KbRunMessageDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  Message!: string;

  @IsString()
  @IsNotEmpty()
  ThreadId!: string;

  @IsString()
  @IsNotEmpty()
  AssistantId!: string;
}

// Response envelope for KB run message
export class KbRunMessageResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.runMessageSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.runMessageSuccess)
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
  Data!: KbRunMessageResult;
}
