import { IsString, IsNotEmpty } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbAssistantCreateResult } from '../types/kb.types';

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