import { Injectable } from '@nestjs/common'
import * as Trakt from 'trakt.tv'

import { TraktMovie } from './interfaces/trakt.movie.interface'
import { TraktShow } from './interfaces/trakt.show.interface'
import { TraktSeason } from './interfaces/trakt.season.interface'
import { TraktEpisode } from './interfaces/trakt.episode.interface'
import { TraktWatching } from './interfaces/trakt.watching.interface'

@Injectable()
export class TraktService {

  public static TYPE_MOVIES = 'movies'
  public static TYPE_SHOWS = 'shows'

  private readonly trakt

  constructor() {
    const clientId = process.env.TRAKT_KEY

    if (clientId) {
      try {
        this.trakt = new Trakt({
          client_id: clientId
        })
      } catch (err) {
        // Do nothing
      }
    }
  }

  public getMovieSummary(id: string): Promise<TraktMovie | undefined> {
    return this.getSummary(id, TraktService.TYPE_MOVIES) as Promise<TraktMovie | undefined>
  }

  public getMovieWatching(id: string): Promise<TraktWatching[] | undefined> {
    return this.getWatching(id, TraktService.TYPE_MOVIES)
  }

  public getShowSummary(id: string): Promise<TraktShow | undefined> {
    return this.getSummary(id, TraktService.TYPE_SHOWS) as Promise<TraktShow | undefined>
  }

  public getShowWatching(id: string): Promise<TraktWatching[] | undefined> {
    return this.getWatching(id, TraktService.TYPE_SHOWS)
  }

  public async getShowSeasons(id: string): Promise<TraktSeason[]> {
    try {
      return this.trakt.seasons.summary({
        id,
        extended: 'episodes,full'
      })

    } catch (err) {
      return []
    }
  }

  public getNextEpisodeForShow(id: string): Promise<TraktEpisode | undefined> {
    try {
      return this.trakt.shows.next_episode({
        id,
        extended: 'full',
      })

    } catch (err) {
      return undefined
    }
  }

  public getLastEpisodeForShow(id: string): Promise<TraktEpisode | undefined> {
    try {
      return this.trakt.shows.last_episode({
        id,
        extended: 'full',
      })

    } catch (err) {
      return undefined
    }
  }

  private getSummary(id: string, type): Promise<TraktMovie | TraktShow | undefined> {
    try {
      return this.trakt[type].summary({
        id,
        extended: 'full'
      })

    } catch (err) {
      return undefined
    }
  }

  private getWatching(id: string, type = TraktService.TYPE_MOVIES): Promise<TraktWatching[] | undefined> {
    try {
      return this.trakt[type].watching({
        id
      })

    } catch (err) {
      return undefined
    }
  }

}
