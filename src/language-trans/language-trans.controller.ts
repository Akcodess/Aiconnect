import { Controller, Post, UseGuards, Req, Body, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiBody } from '@nestjs/swagger';

import { AuthGuard } from '../common/guards/session.guard';
import type { CustomJwtRequest } from '../common/types/request.types';
import { LanguageTransService } from './language-trans.service';
import { TranslationDto } from './dto/translation.dto';
import { TranslationResponseEnvelopeDto } from './dto/translation-response.dto';
import { apiVersion } from '../common/constants/version.constants';
import { ApiSessionHeader } from '../common/decorators/api-session-header.decorator';

@Controller({ path: 'translate', version: apiVersion })
export class LanguageTransController {
  constructor(private readonly service: LanguageTransService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiSessionHeader()
  @ApiBody({ type: TranslationDto })
  @ApiOkResponse({ type: TranslationResponseEnvelopeDto })
  async postTranslate(@Req() req: CustomJwtRequest, @Body(new ValidationPipe({ transform: true })) body: TranslationDto): Promise<TranslationResponseEnvelopeDto> {
    return this.service?.translate(req, body);
  }
}