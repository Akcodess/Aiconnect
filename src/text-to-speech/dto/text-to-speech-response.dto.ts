import { Expose } from 'class-transformer';

export class TextToSpeechResponseDto {
  @Expose()
  Audio!: string;
}