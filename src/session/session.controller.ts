import { Controller, Post, Body, ValidationPipe, Headers } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody } from '@nestjs/swagger';

import { SessionService } from './session.service';
import { SessionInitDto, SessionInitResponseDto, SessionEndResponseDto } from './dto/session.dto';
import { apiVersion } from '../common/constants/version.constants';
import { ApiSessionHeader } from '../common/decorators/api-session-header.decorator';

@ApiTags('Session')
@Controller({ path: '', version: apiVersion })
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Post('session-init')
  @ApiBody({ type: SessionInitDto })
  @ApiOkResponse({ type: SessionInitResponseDto })
  async sessionInit(@Body(new ValidationPipe({ transform: true })) body: SessionInitDto) {
    return this.sessionService?.sessionInit(body);
  }

  @Post('session-end')
  @ApiSessionHeader()
  @ApiOkResponse({ type: SessionEndResponseDto })
  async sessionEnd(@Headers('sessionid') sessionId: string, @Body(new ValidationPipe({ transform: true })) body?: Partial<SessionInitDto>) {
    return this.sessionService?.sessionEnd(sessionId, body?.ReqId, body?.ReqCode);
  }
}