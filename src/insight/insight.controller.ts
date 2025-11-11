import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, BadRequestException, Req } from '@nestjs/common';

import { InsightService } from './insight.service';
import { InsightDto } from './dto/insight.dto';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import type { CustomJwtRequest } from '../common/types/request.types';

@Controller({ path: 'insight', version: apiVersion })
export class InsightController {
  constructor(private readonly insightService: InsightService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async GetInsight(@Req() req: CustomJwtRequest, @Body() body: InsightDto) {
    return this.insightService?.generate(req, body);
  }
}