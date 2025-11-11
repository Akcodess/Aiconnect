import { Controller, Post, UseGuards, Req, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../common/guards/session.guard';
import type { CustomJwtRequest } from '../common/types/request.types';
import { LanguageTransService } from './language-trans.service';
import { TranslationDto } from './dto/translation.dto';
import { apiVersion } from '../common/constants/version.constants';

@Controller({ path: 'translate', version: apiVersion })
export class LanguageTransController {
  constructor(private readonly service: LanguageTransService) { }

  @Post()
  @UseGuards(AuthGuard)
  async postTranslate(@Req() req: CustomJwtRequest, @Body(new ValidationPipe({ transform: true })) body: TranslationDto): Promise<any> {
    return this.service?.translate(req, body);
  }
}