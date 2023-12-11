import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { SubtitlesService } from './subtitles.service'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [SubtitlesService],
  exports: [SubtitlesService]
})
export class SubtitlesModule {}
