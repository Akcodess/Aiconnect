import { Controller, Get, Post, UseGuards, Req, Query, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ApiSessionHeader } from '../common/decorators/api-session-header.decorator';

import { SentimentService } from './sentiment.service';
import { AuthGuard } from '../common/guards/session.guard';
import { SentimentAnalysisQueryDto } from './dto/sentiment.dto';
import { SentimentTextChatDto } from './dto/sentiment-text-chat.dto';
import { SentimentHistoryDto } from './dto/sentiment-history.dto';
import { SentimentAnalysisResponseEnvelopeDto } from './dto/sentiment-envelope.dto';
import { SentimentTextChatResponseEnvelopeDto } from './dto/sentiment-text-chat-envelope.dto';
import { SentimentHistoryResponseEnvelopeDto } from './dto/sentiment-history-envelope.dto';
import type { CustomJwtRequest } from '../common/types/request.types';
import { apiVersion } from '../common/constants/version.constants';

@ApiTags('Sentiment')
@Controller({ path: '', version: apiVersion })
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) { }

  // Sentiment endpoint
  @Get('sentiment')
  @UseGuards(AuthGuard)
  @ApiSessionHeader()
  @ApiOkResponse({ type: SentimentAnalysisResponseEnvelopeDto })
  async getSentiment(@Req() req: CustomJwtRequest, @Query(new ValidationPipe({ transform: true })) query: SentimentAnalysisQueryDto) {
    return this.sentimentService?.analyzeSentiment(req, query);
  }

  // Sentiment Text Chat endpoint
  @Post('sentiment-text-chat')
  @UseGuards(AuthGuard)
  @ApiSessionHeader()
  @ApiOkResponse({ type: SentimentTextChatResponseEnvelopeDto })
  async postSentimentTextChat(@Req() req: CustomJwtRequest, @Body(new ValidationPipe({ transform: true })) body: SentimentTextChatDto) {
    return this.sentimentService?.analyzeSentimentTextChat(req, body);
  }

  // Sentiment History endpoint
  @Post('sentiment-history')
  @UseGuards(AuthGuard)
  @ApiSessionHeader()
  @ApiOkResponse({ type: SentimentHistoryResponseEnvelopeDto })
  async postSentimentHistory(@Req() req: CustomJwtRequest, @Body(new ValidationPipe({ transform: true })) body: SentimentHistoryDto) {
    return this.sentimentService?.getSentimentHistory(req, body);
  }
}
