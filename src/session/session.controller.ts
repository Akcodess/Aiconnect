import { Controller, Post, Body, ValidationPipe, Headers } from '@nestjs/common';

import { SessionService } from './session.service';
import { SessionInitDto } from './dto/session.dto';

@Controller({ path: '', version: '1' })
export class SessionController {
  constructor(private readonly sessionService: SessionService) { }

  @Post('session-init')
  async sessionInit(@Body(new ValidationPipe({ transform: true })) body: SessionInitDto) {
    return this.sessionService.sessionInit(body);
  }

  @Post('session-end')
  async sessionEnd(@Headers('sessionid') sessionId: string, @Body(new ValidationPipe({ transform: true })) body?: Partial<SessionInitDto>) {
    return this.sessionService.sessionEnd(sessionId, body?.ReqId, body?.ReqCode);
  }
}