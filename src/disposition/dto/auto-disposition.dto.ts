import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AutoDispositionDto {
  @ApiProperty({ description: 'Request ID for tracking', example: 'req-123' })
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @ApiProperty({ description: 'Request code for tracking', example: 'code-456' })
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

  @ApiProperty({ description: 'Conversation ID', example: 'conv-001' })
  @IsString()
  @IsNotEmpty()
  ConversationID!: string;

  @ApiProperty({ description: 'Complete conversation text', example: 'Hello, I want to cancel my subscription.' })
  @IsString()
  @IsNotEmpty()
  Conversation!: string;

  @ApiProperty({ description: 'List of possible disposition labels', example: ['Cancellation', 'Refund', 'Inquiry'], type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  DispositionList!: string[];
}