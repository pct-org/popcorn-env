import { Module } from '@nestjs/common'
import { TraktModule } from '@pct-org/services/trakt'
import { TmdbModule } from '@pct-org/services/tmdb'
import { FanartModule } from '@pct-org/services/fanart'
import { TvdbModule } from '@pct-org/services/tvdb'
import { SeasonHelperModule } from '@pct-org/scraper/helpers/season'

import { ShowHelperService } from './show-helper.service'

@Module({
  imports: [
    TraktModule,
    TmdbModule,
    FanartModule,
    TvdbModule,
    SeasonHelperModule,
  ],
  providers: [
    ShowHelperService,
  ],
  exports: [
    ShowHelperService
  ]
})
export class ShowHelperModule {
}
