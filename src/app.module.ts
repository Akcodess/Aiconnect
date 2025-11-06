import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { SentimentModule } from './sentiment/sentiment.module';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    // SentimentModule,
    AuthModule
  ]
})
export class AppModule { }
