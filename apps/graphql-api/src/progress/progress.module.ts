import { Module } from '@nestjs/common'

import { MoviesService } from '../movies/movies.service'
import { EpisodesService } from '../episodes/episodes.service'

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
