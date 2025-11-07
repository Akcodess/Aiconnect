import { Controller, Get, Post, UseGuards, Req, Query, Body, ValidationPipe } from '@nestjs/common';

import { SentimentService } from './sentiment.service';
import { AuthGuard } from '../common/guards/session.guard';
import { SentimentAnalysisQueryDto } from './dto/sentiment.dto';
import { SentimentTextChatDto } from './dto/sentiment-text-chat.dto';
import { SentimentHistoryDto } from './dto/sentiment-history.dto';
import type { CustomJwtRequest } from '../common/types/request.types';

@Controller({ path: '', version: '1' })
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) { }

  // Sentiment endpoint
  @Get('sentiment')
  @UseGuards(AuthGuard)
  async getSentiment(@Req() req: CustomJwtRequest, @Query(new ValidationPipe({ transform: true })) query: SentimentAnalysisQueryDto): Promise<any> {
    return this.sentimentService?.analyzeSentiment(req, query);
  }

  // Sentiment Text Chat endpoint
  @Post('sentiment-text-chat')
  @UseGuards(AuthGuard)
  async postSentimentTextChat(@Req() req: CustomJwtRequest, @Body(new ValidationPipe({ transform: true })) body: SentimentTextChatDto): Promise<any> {
    return this.sentimentService?.analyzeSentimentTextChat(req, body);
  }

  // Sentiment History endpoint
  @Post('sentiment-history')
  @UseGuards(AuthGuard)
  async postSentimentHistory(@Req() req: CustomJwtRequest, @Body(new ValidationPipe({ transform: true })) body: SentimentHistoryDto): Promise<any> {
    return this.sentimentService?.getSentimentHistory(req, body);
  }
}
