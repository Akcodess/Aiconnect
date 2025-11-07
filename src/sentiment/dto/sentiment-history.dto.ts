import { IsString, IsNotEmpty } from 'class-validator';

// Request DTO for Sentiment History endpoint
export class SentimentHistoryDto {
  @IsString()
  @IsNotEmpty()
  ReqId!: string;

  @IsString()
  @IsNotEmpty()
  ReqCode!: string;

  @IsString()
  @IsNotEmpty()
  UXID!: string;

  @IsString()
  @IsNotEmpty()
  ProcessCode!: string;
}