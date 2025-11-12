import { Body, Controller, Post, Get, UseGuards, UsePipes, ValidationPipe, Req, Query } from '@nestjs/common';
import { KbService } from './kb.service';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import { KbInitDto, KbInitResponseEnvelopeDto, KbStoreListDto, KbStoreListResponseEnvelopeDto } from './dto/kb.dto';

@Controller({ path: 'kb', version: apiVersion })
export class KbController {
  constructor(private readonly service: KbService) {}
  
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
}