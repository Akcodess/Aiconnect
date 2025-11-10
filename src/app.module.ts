import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SentimentModule } from './sentiment/sentiment.module';
import { DispositionModule } from './disposition/disposition.module';
import { LanguageTransModule } from './language-trans/language-trans.module';
import { TranscribeModule } from './transcribe/transcribe.module';

import { SessionModule } from './session/session.module';
import { ValkeyModule } from './valkey/valkey.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    SentimentModule,
    SessionModule,
    DispositionModule,
    LanguageTransModule,
    TranscribeModule,
    ValkeyModule,
    CommonModule
  ]
})
export class AppModule { }
