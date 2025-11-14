import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbVectorStoreFileResult } from '../types/kb.types';

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