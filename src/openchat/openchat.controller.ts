import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { OpenChatService } from './openchat.service';
import { OpenChatInitDto, OpenChatChatDto, OpenChatInitResponseEnvelopeDto, OpenChatChatResponseEnvelopeDto } from './dto/openchat.dto';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import { ApiSessionHeader } from '../common/decorators/api-session-header.decorator';

@Controller({ path: 'openchat', version: apiVersion })
@ApiTags('OpenChat')
export class OpenChatController {
  constructor(private readonly service: OpenChatService) { }

  @Post('initialize')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiSessionHeader()
  @ApiOkResponse({ type: OpenChatInitResponseEnvelopeDto })
  async Initialize(@Req() req: CustomJwtRequest, @Body() body: OpenChatInitDto) {
    return this.service?.initialize(req, body);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiSessionHeader()
  @ApiOkResponse({ type: OpenChatChatResponseEnvelopeDto })
  async Chat(@Req() req: CustomJwtRequest, @Body() body: OpenChatChatDto) {
    return this.service?.chat(req, body);
  }
}