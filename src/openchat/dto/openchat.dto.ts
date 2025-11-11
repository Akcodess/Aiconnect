import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';
import { EvType } from '../../common/enums/evtype.enums';
import { openChatResponseCodes, openChatResponseMessages } from '../constants/openchat.constants';

export class OpenChatInitDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsOptional()
  @IsString()
  ProcessCode?: string;

  @IsOptional()
  @IsString()
  ContactId?: string;
}

export class OpenChatInitResponseDto {
  ThreadId!: string;
  AssistantId!: string;
}

export class OpenChatChatDto {
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
  AssistantId!: string;

  @IsString()
  @IsNotEmpty()
  ThreadId!: string;
}

export class OpenChatChatResponseDto {
  ThreadId!: string;
  AssistantId!: string;
  reply?: any;
  messages?: Array<{ role: string; content: any }>;
}

// Standardized envelope for OpenChat Initialize responses
export class OpenChatInitResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? openChatResponseMessages?.OpenChatInitSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? openChatResponseCodes?.OpenChatInitSuccess)
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
  @Type(() => OpenChatInitResponseDto)
  Data!: OpenChatInitResponseDto;
}

// Standardized envelope for OpenChat Chat responses
export class OpenChatChatResponseEnvelopeDto {
  @Expose()
  @Transform(({ value }) => value ?? openChatResponseMessages?.OpenChatSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? openChatResponseCodes?.OpenChatSuccess)
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
  @Type(() => OpenChatChatResponseDto)
  Data!: OpenChatChatResponseDto;
}