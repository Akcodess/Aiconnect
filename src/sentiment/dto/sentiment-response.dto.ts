import { IsEnum, IsNumber, IsOptional, Min, Max, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SentimentCategoryEnum } from '../enums/sentiment.enum';

export class SentenceSentimentDto {
  @ApiProperty({ enum: SentimentCategoryEnum, example: SentimentCategoryEnum.Neutral })
  @Expose()
  @IsEnum(SentimentCategoryEnum)
  Category!: SentimentCategoryEnum;

  @ApiProperty({ example: 0.0 })
  @Expose()
  @IsNumber()
  @Min(-1.0)
  @Max(1.0)
  Score!: number;
}

// Response DTO for sentiment analysis. This represents the "Data" payload returned by ResponseHelperService.successNest.
export class SentimentAnalysisResponseDto {
  @ApiProperty({ enum: SentimentCategoryEnum, required: false, example: SentimentCategoryEnum['SlightlyPositive'] ?? 'Slightly Positive' })
  @Expose()
  @IsOptional()
  @IsEnum(SentimentCategoryEnum)
  OverallCategory?: SentimentCategoryEnum;

  @ApiProperty({ example: 0.62 })
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(-1.0)
  @Max(1.0)
  OverallScore?: number;

  @ApiProperty({ required: false, example: { '1': { Category: 'Slightly Positive', Score: 0.6 }, '2': { Category: 'Neutral', Score: 0.0 } } })
  @Expose()
  @IsOptional()
  @IsObject()
  SentenceScore?: Record<number, SentenceSentimentDto>;

  @ApiProperty({ example: 0.31 })
  @Expose()
  @IsNumber()
  @Min(-1.0)
  @Max(1.0)
  AverageScore!: number;
}