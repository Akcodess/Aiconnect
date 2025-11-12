import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { KbService } from './kb.service';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import { KbInitDto, KbInitResponseEnvelopeDto } from './dto/kb.dto';

@Controller({ path: 'kb', version: apiVersion })
export class KbController {
  constructor(private readonly service: KbService) {}
  
  @Post('init')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async init(@Req() req: CustomJwtRequest, @Body() dto: KbInitDto): Promise<KbInitResponseEnvelopeDto> {
    return this.service?.init(req, dto) as Promise<KbInitResponseEnvelopeDto>;
  }
}