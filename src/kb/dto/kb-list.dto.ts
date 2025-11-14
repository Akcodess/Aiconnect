import { IsString, IsNotEmpty } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbStoreSummary } from '../types/kb.types';

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