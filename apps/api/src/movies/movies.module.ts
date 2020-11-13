import { Module } from '@nestjs/common'
import { TraktModule } from '@pct-org/services/trakt'
import { MoviesService } from '@pct-org/types/movie'

import { MoviesResolver } from './movies.resolver'

@Module({
  imports: [
    TraktModule
  ],
  providers: [
    MoviesResolver,
    MoviesService
  ],
  exports: [
    MoviesService
  ]
})
export class MoviesModule {
}
