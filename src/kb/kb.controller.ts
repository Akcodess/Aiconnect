import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { KbService } from './kb.service';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import { KbStoreListDto, KbFileListDto } from './dto/kb.dto';

@Controller({ path: 'kb', version: apiVersion })
export class KbController {
  constructor(private readonly service: KbService) {}

  @Post('stores/list')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async listStores(@Req() req: CustomJwtRequest, @Body() body: KbStoreListDto) {
    return this.service?.listStores(req, body);
  }

  @Post('files/list')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async listFiles(@Req() req: CustomJwtRequest, @Body() body: KbFileListDto) {
    return this.service?.listFiles(req, body);
  }
}