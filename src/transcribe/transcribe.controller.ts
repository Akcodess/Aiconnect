import { Controller, Get, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../common/guards/session.guard';
import type { CustomJwtRequest } from '../common/types/request.types';
import { TranscribeDto } from './dto/transcribe.dto';
import { TranscribeService } from './transcribe.service';

@Controller({ path: 'transcribe', version: '1' })
export class TranscribeController {
  constructor(private readonly transcribeService: TranscribeService) {}

  @UseGuards(AuthGuard)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async GetTranscription(@Req() req: CustomJwtRequest, @Query() query: TranscribeDto) {
    return this.transcribeService.transcribe(req, query);
  }
}