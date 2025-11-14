import { IsOptional, IsString, IsUrl, IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranscribeDto {
  @ApiProperty({ description: 'Publicly accessible audio file URL', example: 'https://example.com/audio/call1.mp3' })
  @IsUrl()
  @IsNotEmpty()
  AudioUrl!: string;

  @ApiProperty({ description: 'Request ID for tracking', example: 'req-123' })
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @ApiProperty({ description: 'Request code for tracking', example: 'GetTranscribe' })
  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @ApiProperty({ description: 'UX identifier', example: 'ux-abc' })
  @IsString()
  @IsNotEmpty()
  UXID!: string;

  @ApiProperty({ description: 'Message ID for correlation', example: 'msg-001' })
  @IsString()
  @IsNotEmpty()
  MessageID!: string;

  @ApiProperty({ description: 'Process code', example: 'proc-xyz' })
  @IsString()
  @IsNotEmpty()
  ProcessCode!: string;

  @ApiProperty({ description: 'Number of speakers (string number)', required: false, example: '2' })
  @IsOptional()
  @IsNumberString()
  NumSpeakers?: string;

  @ApiProperty({ description: 'Language code for transcription (e.g., en-US)', required: false, example: 'en-US' })
  @IsOptional()
  @IsString()
  LanguageCode?: string;

  @ApiProperty({ description: 'Comma-separated speaker names (optional)', required: false, example: 'customer,agent' })
  @IsOptional()
  @IsString()
  SpeakerNames?: string;
}