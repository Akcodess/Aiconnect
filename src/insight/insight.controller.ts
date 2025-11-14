import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { InsightService } from './insight.service';
import { InsightDto, InsightResponseEnvelopeDto } from './dto/insight.dto';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import type { CustomJwtRequest } from '../common/types/request.types';
import { ApiSessionHeader } from '../common/decorators/api-session-header.decorator';

@Controller({ path: 'insight', version: apiVersion })
@ApiTags('Insight')
export class InsightController {
  constructor(private readonly insightService: InsightService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiSessionHeader()
  @ApiOkResponse({ type: InsightResponseEnvelopeDto })
  async GetInsight(@Req() req: CustomJwtRequest, @Body() body: InsightDto) {
    return this.insightService?.generate(req, body);
  }
}