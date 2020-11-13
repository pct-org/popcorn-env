import { Module } from '@nestjs/common'
import { MoviesService } from '@pct-org/types/movie'
import { EpisodesService } from '@pct-org/types/episode'

import { ProgressResolver } from './progress.resolver'

@Module({
  providers: [
    ProgressResolver,

    MoviesService,
    EpisodesService
  ]
})
export class ProgressModule {
}
