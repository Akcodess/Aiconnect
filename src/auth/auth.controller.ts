import { Controller, Post, Get, Body, ValidationPipe, Headers, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SessionInitDto, EncryptRequestDto } from './dto/auth.dto';

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

  @Get('version')
  async getVersion(@Query('ReqId') reqId?: string, @Query('ReqCode') reqCode?: string) {
    return this.authService.getVersion(reqId, reqCode);
  }

  @Get('health')
  async health() {
    return this.authService.health();
  }

  @Post('encrypt')
  async encrypt(@Body(new ValidationPipe({ transform: true })) body: EncryptRequestDto) {
    return this.authService.encrypt(body.Data, body.ReqId, body.ReqCode);
  }
}