import { IsString, IsNotEmpty } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbInitResult } from '../types/kb.types';

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