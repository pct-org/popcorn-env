import { Module } from '@nestjs/common'

import { DownloadsResolver } from './downloads.resolver'
import { DownloadsService } from './downloads.service'

import { MoviesService } from '../movies/movies.service'
import { EpisodesService } from '../episodes/episodes.service'

@Module({
  providers: [
    DownloadsResolver,
    DownloadsService,

    MoviesService,
    EpisodesService
  ]
})
export class DownloadsModule {
}
