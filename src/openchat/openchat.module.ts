import { Module } from '@nestjs/common';
import { OpenChatController } from './openchat.controller';
import { OpenChatService } from './openchat.service';
import { OpenChatAIHandlerService } from './ai-handler.service';
import { CommonModule } from '../common/common.module';
import { ValkeyModule } from '../valkey/valkey.module';

@Module({
  imports: [CommonModule, ValkeyModule],
  controllers: [OpenChatController],
  providers: [OpenChatService, OpenChatAIHandlerService],
})
export class OpenChatModule {}