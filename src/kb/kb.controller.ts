import { Body, Controller, Post, Get, Delete, Patch, UseGuards, UsePipes, ValidationPipe, Req, Query } from '@nestjs/common';

import { KbService } from './kb.service';
import type { CustomJwtRequest } from '../common/types/request.types';
import { AuthGuard } from '../common/guards/session.guard';
import { apiVersion } from '../common/constants/version.constants';
import { KbAssistantListDto, KbAssistantListResponseEnvelopeDto, KbAssistantUpdateDto, KbAssistantUpdateResponseEnvelopeDto, KbThreadCreateDto, KbThreadCreateResponseEnvelopeDto, KbRunMessageDto, KbRunMessageResponseEnvelopeDto } from './dto/kb.dto';
import { KbMessagesGetDto, KbMessagesGetResponseEnvelopeDto } from './dto/kb.message.dto';
import { KbInitDto, KbInitResponseEnvelopeDto } from './dto/kb-init.dto';
import { KbStoreListDto, KbStoreListResponseEnvelopeDto } from './dto/kb-list.dto';
import { KbDeleteDto, KbDeleteResponseEnvelopeDto } from './dto/kb-delete.dto';
import { KbFileUploadDto, KbFileUploadResponseEnvelopeDto } from './dto/kb-file-upload.dto';
import { KbFileListDto, KbFileListResponseEnvelopeDto } from './dto/kb-file-list.dto';
import { KbVectorStoreFileDto, KbVectorStoreFileResponseEnvelopeDto } from './dto/kb-vectorstore-file-map.dto';
import { KbFileDeleteResponseEnvelopeDto } from './dto/kb-file-delete.dto';
import {KbAssistantDeleteResponseEnvelopeDto} from './dto/kb-assistant-delete.sto';
import {KbAssistantCreateDto, KbAssistantCreateResponseEnvelopeDto} from './dto/kb-assistant-create.dto';
import { KbRunStatusGetDto, KbRunStatusGetResponseEnvelopeDto } from './dto/kb.runstatus.dto';

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

  @Get('file/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getFiles(@Req() req: CustomJwtRequest, @Query() dto: KbFileListDto): Promise<KbFileListResponseEnvelopeDto> {
    return this.service?.getFiles(req, dto) as Promise<KbFileListResponseEnvelopeDto>;
  }

  @Delete('file/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteFile(@Req() req: CustomJwtRequest, @Query() dto: KbDeleteDto): Promise<KbFileDeleteResponseEnvelopeDto> {
    return this.service?.deleteFile(req, dto) as Promise<KbFileDeleteResponseEnvelopeDto>;
  }

  // Create/link files to a vector store (POST)
  @Post('vectorstore-file')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async vectorStoreFile(@Req() req: CustomJwtRequest, @Body() dto: KbVectorStoreFileDto): Promise<KbVectorStoreFileResponseEnvelopeDto> {
    return this.service?.vectorStoreFileCreate(req, dto) as Promise<KbVectorStoreFileResponseEnvelopeDto>;
  }

  // Delete/unlink files from a vector store (PATCH)
  @Patch('vectorstore-file')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async vectorStoreFileDelete(@Req() req: CustomJwtRequest, @Body() dto: KbVectorStoreFileDto): Promise<KbVectorStoreFileResponseEnvelopeDto> {
    return this.service?.vectorStoreFileDelete(req, dto) as Promise<KbVectorStoreFileResponseEnvelopeDto>;
  }

  // Create Assistant for a KB (POST)
  @Post('assistant')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async assistantCreate(@Req() req: CustomJwtRequest, @Body() dto: KbAssistantCreateDto): Promise<KbAssistantCreateResponseEnvelopeDto> {
    return this.service?.assistantCreate(req, dto) as Promise<KbAssistantCreateResponseEnvelopeDto>;
  }

  // Get Assistants for a KB (GET)
  @Get('assistant')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAssistants(@Req() req: CustomJwtRequest, @Query() dto: KbAssistantListDto): Promise<KbAssistantListResponseEnvelopeDto> {
    return this.service?.getAssistants(req, dto) as Promise<KbAssistantListResponseEnvelopeDto>;
  }

  // Update Assistant instructions/status (PATCH)
  @Patch('assistant')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async assistantUpdate(@Req() req: CustomJwtRequest, @Body() dto: KbAssistantUpdateDto): Promise<KbAssistantUpdateResponseEnvelopeDto> {
    return this.service?.assistantUpdate(req, dto) as Promise<KbAssistantUpdateResponseEnvelopeDto>;
  }

  // Delete Assistant by AssistantId (DELETE)
  @Delete('assistant/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async assistantDelete(@Req() req: CustomJwtRequest, @Query() dto: KbDeleteDto): Promise<KbAssistantDeleteResponseEnvelopeDto> {
    return this.service?.assistantDelete(req, dto) as Promise<KbAssistantDeleteResponseEnvelopeDto>;
  }

  // Create a Thread (POST)
  @Post('thread')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async threadCreate(@Req() req: CustomJwtRequest, @Body() dto: KbThreadCreateDto): Promise<KbThreadCreateResponseEnvelopeDto> {
    return this.service?.threadCreate(req, dto) as Promise<KbThreadCreateResponseEnvelopeDto>;
  }

  // Run message on a thread (POST)
  @Post('run-message')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async runMessage(@Req() req: CustomJwtRequest, @Body() dto: KbRunMessageDto): Promise<KbRunMessageResponseEnvelopeDto> {
    return this.service?.runMessage(req, dto) as Promise<KbRunMessageResponseEnvelopeDto>;
  }

  // Get run status (GET)
  @Get('run-status')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async runStatusGet(@Req() req: CustomJwtRequest, @Query() dto: KbRunStatusGetDto): Promise<KbRunStatusGetResponseEnvelopeDto> {
    return this.service?.runStatusGet(req, dto) as Promise<KbRunStatusGetResponseEnvelopeDto>;
  }

  // Get messages (GET)
  @Get('messages')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async messagesGet(@Req() req: CustomJwtRequest, @Query() dto: KbMessagesGetDto): Promise<KbMessagesGetResponseEnvelopeDto> {
    return this.service?.getMessages(req, dto) as Promise<KbMessagesGetResponseEnvelopeDto>;
  }
}