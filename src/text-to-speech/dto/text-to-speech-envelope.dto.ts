import { ApiProperty } from '@nestjs/swagger';

import { TextToSpeechResponseDto } from './text-to-speech-response.dto';
import { ttsResponseCodes, ttsResponseMessages } from '../constants/text-to-speech.constants';
import { EvType } from '../../common/enums/evtype.enums';

export class TextToSpeechResponseEnvelopeDto {
  @ApiProperty({ description: 'Event message', example: ttsResponseMessages?.TextToSpeechSuccess })
  Message: string;

  @ApiProperty({ description: 'Event timestamp (YYYY-MM-DD HH:mm:ss)', example: '2025-01-01 12:00:00' })
  TimeStamp: string;

  @ApiProperty({ description: 'Event code', example: ttsResponseCodes?.TextToSpeechSuccess })
  EvCode: string;

  @ApiProperty({ description: 'Event type', example: EvType })
  EvType: string;

  @ApiProperty({ description: 'Request identifier', example: 'req-123', required: false })
  ReqId?: string;

  @ApiProperty({ description: 'Request code', example: 'code-456', required: false })
  ReqCode?: string;

  @ApiProperty({ description: 'Optional data payload containing synthesized audio info', required: false, type: TextToSpeechResponseDto })
  Data?: TextToSpeechResponseDto;
}