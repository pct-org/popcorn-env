import { Controller, Get, Req, Res } from '@nestjs/common'
import * as ical from 'ical-generator'

import { BookmarksService } from '../bookmarks/bookmarks.service'
import { EpisodesService } from '../episodes/episodes.service'

@Controller()
export class CalendarController {

  constructor(
    private readonly episodesService: EpisodesService,
    private readonly bookmarksService: BookmarksService
  ) {}

  @Get('calendar.ics')
  async calendar(
    @Res() res
  ) {
    const cal = ical()

    cal.prodId({
      company: 'Popcorn Time',
      product: 'Calendar'
    })

    cal.domain('pct')
    cal.name('Airing Episodes')

    // Set the correct ical headers
    res.headers({
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"'
    })

    const bookmarks = await this.bookmarksService.findAllShows({
      offset: 0,
      limit: 1000,
      query: null
    })

    await Promise.all(
      bookmarks.map(async (bookmark) => {
        const notAiredEpisodes = await this.episodesService.findForCalendar(bookmark._id)

        if (notAiredEpisodes.length > 0) {
          notAiredEpisodes.forEach(episode => {
            cal.createEvent({
              id: episode._id,
              start: new Date(episode.firstAired),
              alarms: null,
              allDay: true,
              summary: `${bookmark.title} S${episode.season}E${episode.number}. ${episode.title}`,
              description: episode.synopsis
            })
          })
        }
      })
    )

    res.send(
      cal.toString()
    )
  }

}
