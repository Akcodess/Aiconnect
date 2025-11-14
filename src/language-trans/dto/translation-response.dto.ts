import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { EvType } from '../../common/enums/evtype.enums';
import { languageTransResponseCodes, languageTransResponseMessages } from '../constants/language-trans.constants';


export class TranslationResponseDto {
  @ApiProperty({ description: 'Translated text output', example: 'Bonjour, comment ça va ?' })
  @Expose()
  TranslatedMessage!: string;

  @ApiProperty({ description: 'Source language code', required: false, example: 'en' })
  @Expose()
  From?: string;

  @ApiProperty({ description: 'Target language code', example: 'fr' })
  @Expose()
  To!: string;
}
export class TranslationResponseEnvelopeDto {
  @ApiProperty({ description: 'Status message', example: 'Language translation completed successfully' })
  @Expose()
  @Transform(({ value }) => value ?? languageTransResponseMessages?.TranslationSuccess)
  Message!: string;

  @ApiProperty({ description: 'Timestamp of the response', example: '2025-01-01 12:00:00' })
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @ApiProperty({ description: 'Event code representing the outcome', example: 'LanguageTranslationSuccess' })
  @Expose()
  @Transform(({ value }) => value ?? languageTransResponseCodes?.TranslationSuccess)
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

  @ApiProperty({ description: 'Payload containing translated text and metadata', type: () => TranslationResponseDto, example: { TranslatedMessage: 'Bonjour, comment ça va ?', From: 'en', To: 'fr' } })
  @Expose()
  @Type(() => TranslationResponseDto)
  Data!: TranslationResponseDto;
}