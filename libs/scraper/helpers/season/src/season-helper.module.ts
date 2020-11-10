import { Module } from '@nestjs/common'
import { EpisodeHelperModule } from '@pct-org/scraper/helpers/episode'
import { TmdbModule } from '@pct-org/services/tmdb'

import { SeasonHelperService } from './season-helper.service'

@Module({
  imports: [
    TmdbModule,
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
