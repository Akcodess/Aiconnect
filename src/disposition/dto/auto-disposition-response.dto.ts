import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { dispositionResponseCodes, dispositionResponseMessages } from '../constants/disposition.constants';

export class AutoDispositionResponseDto {
  @ApiProperty({ description: 'Predicted disposition label', example: 'Cancellation' })
  @Expose()
  Disposition!: string;
}

export class AutoDispositionResponseEnvelopeDto {
  @ApiProperty({ description: 'Status message', example: 'Auto-disposition completed successfully' })
  @Expose()
  @Transform(({ value }) => value ?? dispositionResponseMessages?.DispositionSuccess)
  Message!: string;

  @ApiProperty({ description: 'Timestamp of the response', example: '2025-01-01 12:00:00' })
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @ApiProperty({ description: 'Event code representing the outcome', example: 'AutoDispositionSuccess' })
  @Expose()
  @Transform(({ value }) => value ?? dispositionResponseCodes?.AutoDispositionSuccess)
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

  @ApiProperty({ description: 'Payload containing disposition result', type: () => AutoDispositionResponseDto, example: { Disposition: 'Cancellation' } })
  @Expose()
  @Type(() => AutoDispositionResponseDto)
  Data!: AutoDispositionResponseDto;
}