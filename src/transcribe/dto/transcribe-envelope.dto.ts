import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';
import { EvType } from '../../common/enums/evtype.enums';
import { TranscribeResponseDto } from './transcribe-response.dto';
import { transcribeResponseCodes, transcribeResponseMessages } from '../constants/transcribe.constants';

export class TranscribeResponseEnvelopeDto {
  @ApiProperty({ description: 'Status message', example: 'Transcription completed successfully' })
  @Expose()
  @Transform(({ value }) => value ?? transcribeResponseMessages?.TranscriptionSuccess)
  Message!: string;

  @ApiProperty({ description: 'Timestamp of the response', example: '2025-01-01 12:00:00' })
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @ApiProperty({ description: 'Event code representing the outcome', example: 'TranscribeSuccess' })
  @Expose()
  @Transform(({ value }) => value ?? transcribeResponseCodes?.TranscribeSuccess)
  EvCode!: string;

  @ApiProperty({ description: 'Event type', enum: EvType, example: EvType.Success })
  @Expose()
  @Transform(({ value }) => value ?? EvType.Success)
  EvType!: EvType;

  @ApiProperty({ description: 'Request ID for correlation', example: 'req-123' })
  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqId!: string;

  @ApiProperty({ description: 'Request code for correlation', example: 'code-456' })
  @Expose()
  @Transform(({ value }) => (value != null ? String(value).trim() : ''))
  ReqCode!: string;

  @ApiProperty({ description: 'Payload containing transcript', type: () => TranscribeResponseDto, example: { Transcript: 'Hello, thanks for calling. How can I help you today?' } })
  @Expose()
  @Type(() => TranscribeResponseDto)
  Data!: TranscribeResponseDto;
}