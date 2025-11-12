import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';
import { EvType } from '../../common/enums/evtype.enums';
import { kbResponseCodes, kbResponseMessages } from '../constants/kb.constants';
import type { KbStoreSummary, KbFileSummary, KbInitResult } from '../types/kb.types';

export class KbInitDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;
}
