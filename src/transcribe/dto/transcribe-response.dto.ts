import { ApiProperty } from '@nestjs/swagger';

export class TranscribeResponseDto {
  @ApiProperty({ description: 'Full transcription text', example: 'Hello, thanks for calling. How can I help you today?' })
  Transcript!: string;
}