import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { TextToSpeechDto } from './dto/text-to-speech.dto';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';

@Controller({ path: 'synthesize', version: '1' })
export class TextToSpeechController {
  constructor(private readonly service: TextToSpeechService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async GetSpeech(@Req() req: CustomJwtRequest, @Body() body: TextToSpeechDto) {
    return this.service.synthesize(req, body);
  }
}