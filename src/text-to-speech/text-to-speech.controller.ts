import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { TextToSpeechService } from './text-to-speech.service';
import { TextToSpeechDto } from './dto/text-to-speech.dto';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import { TextToSpeechResponseEnvelopeDto } from './dto/text-to-speech-envelope.dto';
import { ApiSessionHeader } from '../common/decorators/api-session-header.decorator';

@Controller({ path: 'synthesize', version: apiVersion })
export class TextToSpeechController {
  constructor(private readonly service: TextToSpeechService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiSessionHeader()
  @ApiOkResponse({ type: TextToSpeechResponseEnvelopeDto })
  async GetSpeech(@Req() req: CustomJwtRequest, @Body() body: TextToSpeechDto) {
    return this.service?.synthesize(req, body);
  }
}