import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { sessionResponseCodes, sessionResponseMessages } from '../constants/session.constants';
import { EvType } from '../../common/enums/evtype.enums';

export class SessionInitDto {
  @ApiProperty({ description: 'Request ID for tracking', example: 'req-123' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqId: string;

  @ApiProperty({ description: 'Request code for tracking', example: 'code-456' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqCode: string;

  @ApiProperty({ description: 'AI platform identifier', example: 'OpenAI' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  XPlatformID: string;

  @ApiProperty({ description: 'Comma-separated service identifiers', example: 'SentimentDetection' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  XPlatformSID: string;

  @ApiProperty({ description: 'Encrypted or key-based user attributes', example: 'encrypted-UA-or-key' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  XPlatformUA: string;

  @ApiProperty({ description: 'Tenant code', required: false, example: 'RADIUSINTELLO' })
  @Expose()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  TenantCode?: string;
}

export class SessionInitDataDto {
  @ApiProperty({ description: 'Session token (JWT)', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @Expose()
  @IsString()
  SessionId!: string;

  @ApiProperty({ description: 'Expiry time (epoch seconds)', example: 1736200000 })
  @Expose()
  ExpiresIn!: number;
}

export class SessionInitResponseDto {
  @ApiProperty({ description: 'Status message', example: 'Session initialized successfully' })
  @Expose()
  @Transform(({ value }) => value ?? sessionResponseMessages.SessionInitSuccess)
  Message!: string;

  @ApiProperty({ description: 'Timestamp of the response', example: '2025-01-01 12:00:00' })
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @ApiProperty({ description: 'Event code representing the outcome', example: 'SessionInitSuccess' })
  @Expose()
  @Transform(({ value }) => value ?? sessionResponseCodes.SessionInitSuccess)
  EvCode!: string;

  @ApiProperty({ description: 'Event type', enum: EvType, example: EvType.Success })
  @Expose()
  @Transform(({ value }) => value ?? EvType.Success)
  EvType!: EvType;

  @ApiProperty({ description: 'Request ID for correlation', required: false, example: 'req-123' })
  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqId?: string;

  @ApiProperty({ description: 'Request code for correlation', required: false, example: 'code-456' })
  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqCode?: string;

  @ApiProperty({ description: 'Payload containing session token details', type: () => SessionInitDataDto, example: { SessionId: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', ExpiresIn: 1736200000 } })
  @Expose()
  @Type(() => SessionInitDataDto)
  Data!: SessionInitDataDto;
}

export class SessionEndResponseDto {
  @ApiProperty({ description: 'Status message', example: 'Session ended and token expired successfully' })
  @Expose()
  @Transform(({ value }) => value ?? sessionResponseMessages.SessionEndSuccess)
  Message!: string;

  @ApiProperty({ description: 'Timestamp of the response', example: '2025-01-01 12:00:00' })
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @ApiProperty({ description: 'Event code representing the outcome', example: 'SessionEndSuccess' })
  @Expose()
  @Transform(({ value }) => value ?? sessionResponseCodes.SessionEndSuccess)
  EvCode!: string;

  @ApiProperty({ description: 'Event type', enum: EvType, example: EvType.Success })
  @Expose()
  @Transform(({ value }) => value ?? EvType.Success)
  EvType!: EvType;
}

// DTO for encrypt request
export class EncryptRequestDto {
  @ApiProperty({ description: 'Data to encrypt', example: { APIKey: 'secret', ClientEmail: 'user@example.com' } })
  @Expose()
  @IsNotEmpty()
  Data: any;

  @ApiProperty({ description: 'Request ID', required: false, example: 'req-123' })
  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqId?: string;

  @ApiProperty({ description: 'Request code', required: false, example: 'code-456' })
  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  ReqCode?: string;
}