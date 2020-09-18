import { Module } from '@nestjs/common'

import { CalendarController } from './calendar.controller'

import { EpisodesService } from '../episodes/episodes.service'
import { BookmarksService } from '../bookmarks/bookmarks.service'

@Module({
  providers: [
    EpisodesService,
    BookmarksService
  ],
  controllers: [
    CalendarController
  ]
})
export class CalendarModule {
}
