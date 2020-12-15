import { HttpModule, Module } from '@nestjs/common'

import { SubtitlesService } from './subtitles.service'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [
    ConfigModule,
    HttpModule
  ],
  providers: [
    SubtitlesService
  ],
  exports: [
    SubtitlesService
  ]
})
export class SubtitlesModule {
}
