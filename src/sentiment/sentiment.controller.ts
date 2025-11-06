import { Controller, Get, UseGuards, Req, Res, Query, ValidationPipe } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SentimentService } from './sentiment.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { SentimentAnalysisQueryDto } from '../common/dto/sentiment.dto';
import type { CustomJwtRequest } from '../common/types/sentiment.types';

@Controller('sentiment')
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getSentiment(
    @Req() req: CustomJwtRequest,
    @Res() res: Response,
    @Query(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
    query: SentimentAnalysisQueryDto
  ): Promise<void> {
    return this.sentimentService.analyzeSentiment(req, res, query);
  }
}
