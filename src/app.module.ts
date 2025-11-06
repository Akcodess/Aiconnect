import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { SentimentModule } from './sentiment/sentiment.module';

import { AuthModule } from './auth/auth.module';
import { ValkeyModule } from './valkey/valkey.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    // SentimentModule,
    AuthModule,
    ValkeyModule
  ]
})
export class AppModule { }
