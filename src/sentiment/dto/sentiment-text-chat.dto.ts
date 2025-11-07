import { IsString, IsNotEmpty, IsObject } from 'class-validator';

// Request DTO for Sentiment Text Chat endpoint
export class SentimentTextChatDto {
  @IsObject()
  @IsNotEmpty()
  Message!: Record<string, string>; // Object containing dynamic speaker keys mapped to messages

  @IsString()
  @IsNotEmpty()
  MessageID!: string;

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