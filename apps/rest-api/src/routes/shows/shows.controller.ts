import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { ShowsArgs, ShowsService } from '@pct-org/types/show'
import { EpisodesService } from '@pct-org/types/episode'

import { Show, ShowClean } from '../../shared/show.interface'

@Controller()
export class ShowsController {

  @Inject()
  private readonly showsService: ShowsService

  @Inject()
  private readonly episodesService: EpisodesService

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
    const episodes = await this.episodesService.findAllForShow(imdbId)

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
      episodes: episodes.map((episode) => ({
        torrents: episode.torrents.reduce((newTorrents, torrent) => {
          newTorrents[torrent.quality] = {
            url: torrent.url,
            seed: torrent.seeds,
            peer: torrent.peers,
            size: torrent.size,
            fileSize: torrent.sizeString,
            provider: torrent.provider
          }

          return newTorrents
        }, {}),
        first_aired: episode.firstAired,
        date_based: false,
        overview: episode.synopsis,
        title: episode.title,
        episode: episode.number,
        season: episode.season,
        tvdb_id: null,
        watched: {
          watched: false,
        }
      }))
    })
  }
}
