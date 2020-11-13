import { Module } from '@nestjs/common'
import { ShowsService } from '@pct-org/types/show'
import { EpisodesService } from '@pct-org/types/episode'

import { EpisodesResolver } from './episodes.resolver'
import { BookmarksService } from '../bookmarks/bookmarks.service'

@Module({
  providers: [
    EpisodesResolver,
    EpisodesService,
    BookmarksService,
    ShowsService
  ],
  exports: [
    EpisodesService
  ]
})
export class EpisodesModule {
}
