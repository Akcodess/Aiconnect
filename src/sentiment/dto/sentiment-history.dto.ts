import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Request DTO for Sentiment History endpoint
export class SentimentHistoryDto {
  @ApiProperty({ description: 'Request ID', example: 'req-123' })
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @ApiProperty({ description: 'Request Code', example: 'code-456' })
  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @ApiProperty({ description: 'UXID', example: 'ux-abc' })
  @IsString()
  @IsNotEmpty()
  UXID!: string;

  @ApiProperty({ description: 'Process Code', example: 'proc-xyz' })
  @IsString()
  @IsNotEmpty()
  ProcessCode!: string;
}