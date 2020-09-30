import { Global, HttpModule, Module } from '@nestjs/common'

import { SubtitlesService } from './subtitles.service'
import { ConfigModule } from '../config/config.module'

@Global()
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
