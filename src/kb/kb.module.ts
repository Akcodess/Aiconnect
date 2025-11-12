import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { DBModule } from '../db/db.module';
import { KbController } from './kb.controller';
import { KbService } from './kb.service';

@Module({
  imports: [CommonModule, DBModule],
  controllers: [KbController],
  providers: [KbService],
})
export class KbModule {}