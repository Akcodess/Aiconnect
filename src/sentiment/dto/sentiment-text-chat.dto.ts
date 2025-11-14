import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Request DTO for Sentiment Text Chat endpoint
export class SentimentTextChatDto {
  @ApiProperty({ description: 'Speaker-to-message map', example: { Speaker1: 'Hello there', Speaker2: 'Hi!' } })
  @IsObject()
  @IsNotEmpty()
  Message!: Record<string, string>; // Object containing dynamic speaker keys mapped to messages

  @ApiProperty({ description: 'Unique identifier for this message/chat', example: 'msg-001' })
  @IsString()
  @IsNotEmpty()
  MessageID!: string;

  @ApiProperty({ description: 'Request ID', example: 'req-123' })
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @ApiProperty({ description: 'Request Code', example: 'code-456' })
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
}