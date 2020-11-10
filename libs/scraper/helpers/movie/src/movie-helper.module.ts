import { Module } from '@nestjs/common'
import { TraktModule } from '@pct-org/services/trakt'
import { TmdbModule } from '@pct-org/services/tmdb'
import { FanartModule } from '@pct-org/services/fanart'
import { OmdbModule } from '@pct-org/services/omdb'

import { MovieHelperService } from './movie-helper.service'

@Module({
  imports: [
    TraktModule,
    TmdbModule,
    FanartModule,
    OmdbModule,
  ],
  providers: [
    MovieHelperService
  ],
  exports: [
    MovieHelperService
  ]
})
export class MovieHelperModule {
}
