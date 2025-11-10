import { Expose } from 'class-transformer';

export class TranslationResponseDto {
  @Expose()
  TranslatedMessage!: string;

  @Expose()
  From?: string;

  @Expose()
  To!: string;
}