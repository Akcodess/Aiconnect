import { IsEnum, IsNumber, IsOptional, Min, Max, IsObject } from 'class-validator';
import { Expose } from 'class-transformer';

import { SentimentCategoryEnum } from '../enums/sentiment.enum';

export class SentenceSentimentDto {
  @Expose()
  @IsEnum(SentimentCategoryEnum)
  Category!: SentimentCategoryEnum;

  @Expose()
  @IsNumber()
  @Min(-1.0)
  @Max(1.0)
  Score!: number;
}

// Response DTO for sentiment analysis. This represents the "Data" payload returned by ResponseHelperService.successNest.
export class SentimentAnalysisResponseDto {
  @Expose()
  @IsOptional()
  @IsEnum(SentimentCategoryEnum)
  OverallCategory?: SentimentCategoryEnum;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(-1.0)
  @Max(1.0)
  OverallScore?: number;

  // SentenceScore is a dynamic map: { "1": { Category, Score }, "2": { ... } }
  // Validation of dynamic keys is limited; the type is provided for clarity.
  @Expose()
  @IsOptional()
  @IsObject()
  SentenceScore?: Record<number, SentenceSentimentDto>;

  @Expose()
  @IsNumber()
  @Min(-1.0)
  @Max(1.0)
  AverageScore!: number;
}