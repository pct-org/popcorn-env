import { Module } from '@nestjs/common'
import { EpisodesService } from '@pct-org/types/episode'

import { CalendarController } from './calendar.controller'

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
