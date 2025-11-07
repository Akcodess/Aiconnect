import { Controller, Get, UseGuards, Req, Query, ValidationPipe } from '@nestjs/common';

import { SentimentService } from './sentiment.service';
import { AuthGuard } from '../common/guards/session.guard';
import { SentimentAnalysisQueryDto } from './dto/sentiment.dto';
import type { CustomJwtRequest } from '../common/types/request.types';

@Controller({ path: 'sentiment', version: '1' })
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) { }

  @Get()
  @UseGuards(AuthGuard)
  async getSentiment(@Req() req: CustomJwtRequest, @Query(new ValidationPipe({ transform: true })) query: SentimentAnalysisQueryDto): Promise<any> {
    return this.sentimentService?.analyzeSentiment(req, query);
  }
}
