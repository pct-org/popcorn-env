import { Controller, Get, Inject, Res } from '@nestjs/common'
import ical from 'ical-generator'
import { EpisodesService } from '@pct-org/types/episode'

import { BookmarksService } from '../bookmarks/bookmarks.service'

@Controller()
export class CalendarController {
  @Inject()
  private readonly episodesService: EpisodesService

  @Inject()
  private readonly bookmarksService: BookmarksService

  @Get('calendar.ics')
  public async calendar(@Res() res) {
    const cal = ical()

    cal.prodId({
      company: 'Popcorn Time',
      product: 'Calendar'
    })

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
        const notAiredEpisodes = await this.episodesService.findForCalendar(
          bookmark._id
        )

        if (notAiredEpisodes.length > 0) {
          notAiredEpisodes.forEach((episode) => {
            cal.createEvent({
              id: episode._id,
              start: new Date(episode.firstAired),
              alarms: null,
              allDay: true,
              summary: `${bookmark.title} S${`0${episode.season}`.slice(
                -2
              )}E${`0${episode.number}`.slice(-2)}. ${episode.title}`,
              description: episode.synopsis
            })
          })
        }
      })
    )

    res.send(cal.toString())
  }
}
