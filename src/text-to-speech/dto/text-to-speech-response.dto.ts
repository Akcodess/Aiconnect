import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TextToSpeechResponseDto {
  @Expose()
  @ApiProperty({ description: 'URL or path to the synthesized audio file.', example: 'https://cdn.example.com/audio/tts-12345.mp3' })
  Audio!: string;
}