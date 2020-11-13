import { Module } from '@nestjs/common'
import { MoviesService } from '@pct-org/types/movie'
import { EpisodesService } from '@pct-org/types/episode'

import { DownloadsResolver } from './downloads.resolver'
import { DownloadsService } from './downloads.service'


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
