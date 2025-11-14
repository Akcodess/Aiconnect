import { Controller, Get, Post, Body, ValidationPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { CommonService } from './common.service';
import { EncryptRequestDto } from './dto/common.dto';
import { VersionResponseEnvelopeDto, HealthResponseDto, EncryptResponseEnvelopeDto } from './dto/common-response.dto';
import { apiVersion } from './constants/version.constants';

@Controller({ path: '', version: apiVersion })
export class CommonController {
  constructor(private readonly commonService: CommonService) { }

  @Get('version')
  @ApiOperation({ description: 'Returns product/build version details wrapped in a standard response envelope.' })
  @ApiOkResponse({ type: VersionResponseEnvelopeDto })
  async getVersion(@Query('ReqId') reqId?: string, @Query('ReqCode') reqCode?: string) {
    return this.commonService?.getVersion(reqId, reqCode);
  }

  @Get('health')
  @ApiOperation({ description: 'Returns a simple OK payload to indicate the service is healthy.' })
  @ApiOkResponse({ type: HealthResponseDto })
  async health() {
    return this.commonService?.health();
  }

  @Post('encrypt')
  @ApiOperation({ description: 'Encrypts the provided payload and returns ciphertext wrapped in a standard response envelope.' })
  @ApiOkResponse({ type: EncryptResponseEnvelopeDto })
  async encrypt(@Body(new ValidationPipe({ transform: true })) body: EncryptRequestDto) {
    return this.commonService?.encrypt(body.Data, body.ReqId, body.ReqCode);
  }
}