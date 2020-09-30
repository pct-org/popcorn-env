import { Module, Global } from '@nestjs/common'

import { ShowsService } from '../../shows/shows.service'
import { MoviesService } from '../../movies/movies.service'
import { TraktService } from './trakt.service'

@Global()
@Module({
  providers: [
    TraktService,
    ShowsService,
    MoviesService
  ],
  exports: [
    TraktService
  ]
})
export class TraktModule {
}
