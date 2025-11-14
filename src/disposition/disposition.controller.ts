import { Controller, Post, UseGuards, Req, Body, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiBody } from '@nestjs/swagger';

import { AuthGuard } from '../common/guards/session.guard';
import type { CustomJwtRequest } from '../common/types/request.types';
import { DispositionService } from './disposition.service';
import { AutoDispositionDto } from './dto/auto-disposition.dto';
import { AutoDispositionResponseEnvelopeDto } from './dto/auto-disposition-response.dto';
import { apiVersion } from '../common/constants/version.constants';
import { ApiSessionHeader } from '../common/decorators/api-session-header.decorator';

@Controller({ path: 'auto-disposition', version: apiVersion })
export class DispositionController {
  constructor(private readonly dispositionService: DispositionService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiSessionHeader()
  @ApiBody({ type: AutoDispositionDto })
  @ApiOkResponse({ type: AutoDispositionResponseEnvelopeDto })
  async postAutoDisposition(@Req() req: CustomJwtRequest, @Body(new ValidationPipe({ transform: true })) body: AutoDispositionDto) {
    return this.dispositionService?.classifyDisposition(req, body);
  }
}