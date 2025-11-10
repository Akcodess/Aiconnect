import { Controller, Post, UseGuards, Req, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../common/guards/session.guard';
import type { CustomJwtRequest } from '../common/types/request.types';
import { DispositionService } from './disposition.service';
import { AutoDispositionDto } from './dto/auto-disposition.dto';

@Controller({ path: 'auto-disposition', version: '1' })
export class DispositionController {
  constructor(private readonly dispositionService: DispositionService) { }

  @Post()
  @UseGuards(AuthGuard)
  async postAutoDisposition(@Req() req: CustomJwtRequest, @Body(new ValidationPipe({ transform: true })) body: AutoDispositionDto) {
    return this.dispositionService?.classifyDisposition(req, body);
  }
}