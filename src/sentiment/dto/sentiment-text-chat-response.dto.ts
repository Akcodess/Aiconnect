import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsObject } from 'class-validator';

import { SentimentCategoryEnum } from '../enums/sentiment.enum';
import { SentenceSentimentDto } from './sentiment-response.dto';

// Speaker-level sentiment structure
export class TextChatSpeakerSentimentDto {
  @ApiProperty({ description: 'Overall sentiment category for the speaker', enum: SentimentCategoryEnum, example: SentimentCategoryEnum.Neutral })
  @Expose()
  @IsEnum(SentimentCategoryEnum)
  OverallCategory!: SentimentCategoryEnum;

  @ApiProperty({ description: 'Overall sentiment score for the speaker', example: 0.12 })
  @Expose()
  @IsNumber()
  OverallScore!: number;

  @ApiProperty({ description: 'Sentence-level scores for the speaker', example: { '1': { Category: 'Neutral', Score: 0.0 } } })
  @Expose()
  @IsObject()
  @Type(() => SentenceSentimentDto)
  SentenceScore!: Record<number, SentenceSentimentDto>;
}

// Response payload for sentiment text chat
export class SentimentTextChatResponseDto {
  @ApiProperty({ description: 'Map of speakers to their sentiment results', example: {
    Speaker1: { OverallCategory: 'Neutral', OverallScore: 0.12, SentenceScore: { '1': { Category: 'Neutral', Score: 0.0 } } },
    Speaker2: { OverallCategory: 'Strongly Positive', OverallScore: 0.91, SentenceScore: { '1': { Category: 'Strongly Positive', Score: 0.91 } } }
  } })
  @Expose()
  @IsObject()
  @Type(() => TextChatSpeakerSentimentDto)
  Sentiment!: Record<string, TextChatSpeakerSentimentDto>;

  @ApiProperty({ description: 'Average score across speakers', example: 0.52 })
  @Expose()
  @IsNumber()
  AverageScore!: number;
}