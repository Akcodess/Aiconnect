import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TextToSpeechDto {
  @IsString()
  @ApiProperty({ description: 'The text content to synthesize as speech.', example: 'Hello, thanks for calling. How can I help you today?' })
  Message!: string;

  @IsString()
  @ApiProperty({ description: 'The voice model to use for synthesis (provider-specific).', example: 'alloy' })
  VoiceModel!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'BCP-47 language code for synthesis (optional).', example: 'en-US', required: false })
  LanguageCode?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Speaking rate factor (optional).', example: '1.0', required: false })
  SpeakingRate?: string;

  @IsString()
  @ApiProperty({ description: 'Request identifier for tracing.', example: 'req-123' })
  ReqId!: string;

  @IsString()
  @ApiProperty({ description: 'Request code for correlation.', example: 'code-456' })
  ReqCode!: string;

  @IsString()
  @ApiProperty({ description: 'User experience identifier for caching and correlation.', example: 'ux-abc' })
  UXID!: string;

  @IsString()
  @ApiProperty({ description: 'Message identifier for caching and correlation.', example: 'msg-001' })
  MessageID!: string;

  @IsString()
  @ApiProperty({ description: 'Process code for cache scoping and identification.', example: 'proc-tts-xyz' })
  ProcessCode!: string;
}