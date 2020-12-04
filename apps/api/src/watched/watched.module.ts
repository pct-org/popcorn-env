import { Module } from '@nestjs/common'
import { MoviesService } from '@pct-org/types/movie'
import { EpisodesService } from '@pct-org/types/episode'

import { WatchedResolver } from './watched.resolver'
import { WatchedService } from './watched.service'

@Module({
  providers: [
    WatchedResolver,
    WatchedService,
    MoviesService,
    EpisodesService
  ]
})
export class WatchedModule {
}
