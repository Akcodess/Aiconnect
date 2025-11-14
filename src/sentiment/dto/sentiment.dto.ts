import { IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SentimentAnalysisQueryDto {
  @ApiProperty({ description: 'Message text to analyze', example: 'Hello, how are you?', type: String })
  @IsString()
  @IsNotEmpty()
  Message!: string;

  @ApiProperty({ description: 'Unique identifier for this message', example: 'msg-001', type: String })
  @IsString()
  @IsNotEmpty()
  MessageID!: string;

  @ApiProperty({ description: 'Optional request ID for tracking', example: 'req-123', type: String })
  @IsString()
  @IsNotEmpty()
  ReqId?: string;

  @ApiProperty({ description: 'Optional request code for tracking', example: 'code-456', type: String })
  @IsString()
  @IsNotEmpty()
  ReqCode?: string;

  @ApiProperty({ description: 'UX identifier', example: 'ux-abc', type: String })
  @IsString()
  @IsNotEmpty()
  UXID!: string;

  @ApiProperty({ description: 'Process code', example: 'proc-xyz', type: String })
  @IsString()
  @IsNotEmpty()
  ProcessCode!: string;

  @ApiProperty({ description: 'Include sentence-level scores', enum: ['T', 'F'], required: false, example: 'F' })
  @IsOptional()
  @IsEnum(['T', 'F'])
  SentenceScore?: 'T' | 'F';

  @ApiProperty({ description: 'Include overall score', enum: ['T', 'F'], example: 'T' })
  @IsNotEmpty()
  @IsEnum(['T', 'F'])
  OverallScore?: 'T' | 'F';
}