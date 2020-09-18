import { Module } from '@nestjs/common'

import { EpisodesResolver } from './episodes.resolver'
import { EpisodesService } from './episodes.service'
import { BookmarksService } from '../bookmarks/bookmarks.service'
import { ShowsService } from '../shows/shows.service'

@Module({
  providers: [
    EpisodesResolver,
    EpisodesService,
    BookmarksService,
    ShowsService
  ]
})
export class EpisodesModule {
}
