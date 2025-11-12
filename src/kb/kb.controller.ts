import { Body, Controller, Post, Get, Delete, UseGuards, UsePipes, ValidationPipe, Req, Query } from '@nestjs/common';

import { KbService } from './kb.service';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import { KbInitDto, KbInitResponseEnvelopeDto, KbStoreListDto, KbStoreListResponseEnvelopeDto, KbDeleteDto, KbDeleteResponseEnvelopeDto, KbFileUploadDto, KbFileUploadResponseEnvelopeDto } from './dto/kb.dto';

@Controller({ path: 'kb', version: apiVersion })
export class KbController {
  constructor(private readonly service: KbService) { }

  @Post('init')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async init(@Req() req: CustomJwtRequest, @Body() dto: KbInitDto): Promise<KbInitResponseEnvelopeDto> {
    return this.service?.init(req, dto) as Promise<KbInitResponseEnvelopeDto>;
  }

  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getKb(@Req() req: CustomJwtRequest, @Query() dto: KbStoreListDto): Promise<KbStoreListResponseEnvelopeDto> {
    return this.service?.getKb(req, dto) as Promise<KbStoreListResponseEnvelopeDto>;
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteKb(@Req() req: CustomJwtRequest, @Query() dto: KbDeleteDto): Promise<KbDeleteResponseEnvelopeDto> {
    return this.service?.deleteKb(req, dto) as Promise<KbDeleteResponseEnvelopeDto>;
  }
  @Post('file')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async uploadFile(@Req() req: CustomJwtRequest, @Body() dto: KbFileUploadDto): Promise<KbFileUploadResponseEnvelopeDto> {
    return this.service?.uploadFile(req, dto) as Promise<KbFileUploadResponseEnvelopeDto>;
  }
}