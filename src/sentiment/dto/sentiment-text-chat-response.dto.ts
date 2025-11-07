import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsObject } from 'class-validator';

import { SentimentCategoryEnum } from '../enums/sentiment.enum';
import { SentenceSentimentDto } from './sentiment-response.dto';

// Speaker-level sentiment structure
export class TextChatSpeakerSentimentDto {
  @Expose()
  @IsEnum(SentimentCategoryEnum)
  OverallCategory!: SentimentCategoryEnum;

  @Expose()
  @IsNumber()
  OverallScore!: number;

  @Expose()
  @IsObject()
  @Type(() => SentenceSentimentDto)
  SentenceScore!: Record<number, SentenceSentimentDto>;
}

// Response payload for sentiment text chat
export class SentimentTextChatResponseDto {
  @Expose()
  @IsObject()
  @Type(() => TextChatSpeakerSentimentDto)
  Sentiment!: Record<string, TextChatSpeakerSentimentDto>;

  @Expose()
  @IsNumber()
  AverageScore!: number;
}