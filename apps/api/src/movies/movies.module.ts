import { Module } from '@nestjs/common'
import { TraktModule } from '@pct-org/services/trakt'

import { MoviesResolver } from './movies.resolver'
import { MoviesService } from './movies.service'

@Module({
  imports: [
    TraktModule,
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
