import { IsString, IsNotEmpty, IsArray, IsOptional, IsEnum } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbStoreSummary, KbInitResult, KbDeleteResult, KbFileUploadResult, KbFileSummary, KbFileDeleteResult, KbVectorStoreFileResult, KbAssistantCreateResult, KbAssistantSummary, KbAssistantUpdateResult, KbAssistantDeleteResult } from '../types/kb.types';
import { KbStatus } from '../types/kb.types';

export class KbInitDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;
}

// Standard response envelope for KB init
export class KbInitResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.kbInitSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.kbInitSuccess)
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
  Data!: KbInitResult;
}

// Request DTO for GET /kb (store list)
export class KbStoreListDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;
}

// Response envelope DTO for KB store listing
export class KbStoreListResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.storeListSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.storeListSuccess)
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
  Data!: KbStoreSummary[];
}

// Request DTO for DELETE /kb/:id (validate envelope metadata via query params)
export class KbDeleteDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;
}

// Response envelope for KB delete
export class KbDeleteResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.deleteKbSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.deleteKbSuccess)
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
  Data!: KbDeleteResult;
}

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

// Request DTO for GET /kb/file/:id (validate envelope metadata via query params)
export class KbFileListDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;
}

// Response envelope for KB file list
export class KbFileListResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.fileListSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.fileListSuccess)
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
  Data!: KbFileSummary[];
}

// Request DTO for POST /kb/vectorstore-file
export class KbVectorStoreFileDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  KBUID!: string;

  @IsArray()
  @IsNotEmpty()
  FileIds!: string[];
}

// Response envelope for POST /kb/vectorstore-file
export class KbVectorStoreFileResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.vectorStoreFileSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.vectorStoreFileSuccess)
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
  Data!: KbVectorStoreFileResult;
}

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

// Request DTO for POST /kb/assistant (assistant creation)
export class KbAssistantCreateDto {
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
  Name!: string;

  @IsString()
  @IsNotEmpty()
  Instructions!: string;
}

// Response envelope for POST /kb/assistant
export class KbAssistantCreateResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? kbResponseMessages?.assistantCreateSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? kbResponseCodes?.assistantCreateSuccess)
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
  Data!: KbAssistantCreateResult;
}

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
