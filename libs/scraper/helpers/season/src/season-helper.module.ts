import { Module } from '@nestjs/common'
import { EpisodeHelperModule } from '@pct-org/scraper/helpers/episode'

import { SeasonHelperService } from './season-helper.service'

@Module({
  imports: [
    EpisodeHelperModule,
  ],
  providers: [
    SeasonHelperService
  ],
  exports: [
    SeasonHelperService
  ]
})
export class SeasonHelperModule {
}
