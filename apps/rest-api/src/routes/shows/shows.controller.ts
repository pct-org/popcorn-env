import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { ShowsArgs, ShowsService } from '@pct-org/api/shows'

import { Show, ShowClean } from '../../shared/show.interface'

@Controller()
export class ShowsController {

  @Inject()
  private readonly showsService: ShowsService

  @Get('/shows')
  public async getShows(): Promise<string[]> {
    const totalShows = await this.showsService.count()

    return Array(Math.round(totalShows / 50)).fill(null).map((empty, index) => (
      `/shows/${index + 1}`
    ))
  }

  @Get('/shows/:page')
  public async getShowsPage(
    @Param('page') page: number,
    @Query() args: ShowsArgs
  ): Promise<ShowClean[]> {
    args.offset = (page - 1) * args.limit
    args.query = args.keywords

    const shows = await this.showsService.findAll(args)

    return shows.map((show) => ({
      _id: show._id,
      imdb_id: show._id,
      tvdb_id: `${show.tvdbId}`,
      title: show.title,
      year: `${(new Date(show.released)).getFullYear()}`,
      slug: show.slug,
      num_seasons: show.numSeasons,
      images: {
        poster: show.images.poster.medium,
        fanart: show.images.backdrop.medium,
        banner: show.images.poster.medium
      },
      rating: {
        percentage: show.rating.percentage,
        watching: show.rating.watching,
        votes: show.rating.votes,
        loved: 100,
        hated: 100
      }
    }))
  }

  @Get('/show/:imdbId')
  public async getShow(
    @Param('imdbId') imdbId: string
  ): Promise<Show> {
    const show = await this.showsService.findOne(imdbId)

    return ({
      _id: show._id,
      imdb_id: show._id,
      tvdb_id: `${show.tvdbId}`,
      title: show.title,
      year: `${(new Date(show.released)).getFullYear()}`,
      slug: show.slug,
      runtime: `${(show.runtime.hours * 60) + show.runtime.minutes}`,
      synopsis: show.synopsis,
      num_seasons: show.numSeasons,
      country: show.airInfo.country,
      network: show.airInfo.network,
      air_day: show.airInfo.day,
      air_time: show.airInfo.time,
      status: show.airInfo.status,
      genres: show.genres,
      images: {
        poster: show.images.poster.medium,
        fanart: show.images.backdrop.medium,
        banner: show.images.poster.medium
      },
      rating: {
        percentage: show.rating.percentage,
        watching: show.rating.watching,
        votes: show.rating.votes,
        loved: 100,
        hated: 100
      },
      last_updated: show.updatedAt,
      episodes: []
    })
  }
}
