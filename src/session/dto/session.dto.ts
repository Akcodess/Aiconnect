import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import moment from 'moment';

import { sessionResponseCodes, sessionResponseMessages } from '../constants/session.constants';
import { EvType } from '../../common/enums/evtype.enums';

export class SessionInitDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqCode: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  XPlatformID: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  XPlatformSID: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  XPlatformUA: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  TenantCode?: string;
}

export class SessionInitResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? sessionResponseMessages.SessionInitSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? sessionResponseCodes.SessionInitSuccess)
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
  @Transform(({ value }) => (value != null ? Number(value) : 0))
  ExpiresIn?: number;

  @Expose()
  @Transform(({ value }) => (value != null ? String(value) : ''))
  SessionId?: string;
}

export class SessionEndResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? sessionResponseMessages.SessionEndSuccess)
  Message!: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? sessionResponseCodes.SessionInitSuccess)
  EvCode!: string;

  @Expose()
  @Transform(({ value }) => value ?? EvType.Success)
  EvType!: EvType;
}

// DTO for encrypt request
export class EncryptRequestDto {
  @Expose()
  @IsNotEmpty()
  Data: any;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqCode?: string;
}