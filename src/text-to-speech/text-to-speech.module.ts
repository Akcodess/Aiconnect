import { Module } from '@nestjs/common';
import { TextToSpeechController } from './text-to-speech.controller';
import { TextToSpeechService } from './text-to-speech.service';
import { TextToSpeechAIHandlerService } from './ai-handler.service';

import { CommonModule } from '../common/common.module';
import { ValkeyModule } from '../valkey/valkey.module';

@Module({
  imports: [CommonModule, ValkeyModule],
  controllers: [TextToSpeechController],
  providers: [TextToSpeechService, TextToSpeechAIHandlerService],
  exports: [TextToSpeechService],
})
export class TextToSpeechModule {}