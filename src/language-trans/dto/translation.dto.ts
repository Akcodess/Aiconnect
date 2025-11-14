import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationDto {
  @ApiProperty({ description: 'Request ID for tracking', example: 'req-123' })
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @ApiProperty({ description: 'Request code for tracking', example: 'LanguageTranslation' })
  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @ApiProperty({ description: 'UX identifier', example: 'ux-abc' })
  @IsString()
  @IsNotEmpty()
  UXID!: string;

  @ApiProperty({ description: 'Process code', example: 'proc-xyz' })
  @IsString()
  @IsNotEmpty()
  ProcessCode!: string;

  @ApiProperty({ description: 'Message ID', example: 'msg-001' })
  @IsString()
  @IsNotEmpty()
  MessageID!: string;

  @ApiProperty({ description: 'Text to translate', example: 'Hello, how are you?' })
  @IsString()
  @IsNotEmpty()
  Message!: string;

  @ApiProperty({ description: 'Source language code (optional)', required: false, example: 'en' })
  @IsString()
  @IsOptional()
  From?: string;

  @ApiProperty({ description: 'Target language code', example: 'RADIUSINTELLO' })
  @IsString()
  @IsNotEmpty()
  To!: string;
}