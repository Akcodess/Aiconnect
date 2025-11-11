import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { OpenChatService } from './openchat.service';
import { OpenChatInitDto } from './dto/openchat.dto';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';

@Controller({ path: 'openchat', version: apiVersion })
export class OpenChatController {
  constructor(private readonly service: OpenChatService) {}

  @Post('initialize')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async Initialize(@Req() req: CustomJwtRequest, @Body() body: OpenChatInitDto) {
    return this.service?.initialize(req, body);
  }
}