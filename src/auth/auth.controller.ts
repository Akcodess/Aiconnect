import { Controller, Post, Body, ValidationPipe, Headers } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SessionInitDto } from './dto/auth.dto';

@Controller('aiconnect/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('session-init')
  async sessionInit(@Body(new ValidationPipe({ transform: true })) body: SessionInitDto) {
    return this.authService.sessionInit(body);
  }

  @Post('session-end')
  async sessionEnd(@Headers('sessionid') sessionId: string, @Body(new ValidationPipe({ transform: true })) body?: Partial<SessionInitDto>) {
    return this.authService.sessionEnd(sessionId, body?.ReqId, body?.ReqCode);
  }
}