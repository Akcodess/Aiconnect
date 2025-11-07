import { Controller, Get, Post, Body, ValidationPipe, Query } from '@nestjs/common';

import { CommonService } from './common.service';
import { EncryptRequestDto } from './dto/common.dto';

@Controller({ path: '', version: '1' })
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('version')
  async getVersion(@Query('ReqId') reqId?: string, @Query('ReqCode') reqCode?: string) {
    return this.commonService.getVersion(reqId, reqCode);
  }

  @Get('health')
  async health() {
    return this.commonService.health();
  }

  @Post('encrypt')
  async encrypt(@Body(new ValidationPipe({ transform: true })) body: EncryptRequestDto) {
    return this.commonService.encrypt(body.Data, body.ReqId, body.ReqCode);
  }
}