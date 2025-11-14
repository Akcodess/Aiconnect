import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbGetMessagesResult } from '../types/kb.types';

// Request DTO for GET /kb/messages
export class KbMessagesGetDto {
    @IsString()
    @IsNotEmpty()
    ReqId!: string;

    @IsString()
    @IsNotEmpty()
    ReqCode!: string;

    @IsString()
    @IsNotEmpty()
    ThreadId!: string;

    @IsOptional()
    @IsString()
    Limit?: string;
}

// Response envelope for GET /kb/messages
export class KbMessagesGetResponseEnvelopeDto {
    @Expose()
    @Transform(({ value }) => value ?? kbResponseMessages?.messagesGetSuccess)
    Message!: string;

    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp!: string;

    @Expose()
    @Transform(({ value }) => value ?? kbResponseCodes?.messagesGetSuccess)
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
    Data!: KbGetMessagesResult;
}