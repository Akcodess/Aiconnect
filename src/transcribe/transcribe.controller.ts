import { Controller, Get, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthGuard } from '../common/guards/session.guard';
import type { CustomJwtRequest } from '../common/types/request.types';
import { TranscribeDto } from './dto/transcribe.dto';
import { TranscribeService } from './transcribe.service';
import { apiVersion } from '../common/constants/version.constants';
import { ApiSessionHeader } from '../common/decorators/api-session-header.decorator';
import { TranscribeResponseEnvelopeDto } from './dto/transcribe-envelope.dto';

@Controller({ path: 'transcribe', version: apiVersion })
export class TranscribeController {
  constructor(private readonly transcribeService: TranscribeService) { }

  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiSessionHeader()
  @ApiOkResponse({ type: TranscribeResponseEnvelopeDto })
  async GetTranscription(@Req() req: CustomJwtRequest, @Query() query: TranscribeDto) {
    return this.transcribeService?.transcribe(req, query);
  }
}