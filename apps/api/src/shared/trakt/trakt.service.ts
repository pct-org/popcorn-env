import { Injectable } from '@nestjs/common'
import * as Trakt from 'trakt.tv'
import { Show, Movie } from '@pct-org/mongo-models'

import { ConfigService } from '../config/config.service'
import { ShowsService } from '../../shows/shows.service'
import { MoviesService } from '../../movies/movies.service'

@Injectable()
export class TraktService {

  private readonly trakt

  constructor(
    private readonly configService: ConfigService,
    private readonly showsService: ShowsService,
    private readonly moviesService: MoviesService
  ) {
    const clientId = this.configService.get(ConfigService.TRAKT_KEY)

    if (clientId) {
      try {
        this.trakt = new Trakt({
          client_id: this.configService.get(ConfigService.TRAKT_KEY)
        })
      } catch (err) {
        // Do nothing
      }
    }
  }

  async mostWatchedWeeklyShows(): Promise<Show[]> {
    // Trakt is not setup
    if (!this.trakt) {
      return []
    }

    let showIds = []

    try {
      const traktMostWatched = await this.trakt.shows.watched({
        period: 'weekly',
        limit: 20
      })

      showIds = traktMostWatched.map((item) => item.show.ids.imdb)
    } catch (e) {
    }

    if (showIds.length === 0) {
      return []
    }

    const shows = await this.showsService.findAllWithIDS(showIds)

    return shows.sort((showA, showB) =>
      showIds.indexOf(showA._id) - showIds.indexOf(showB._id)
    )
  }

  async findRelatedMovies(movieImdbId): Promise<Movie[]> {
    // Trakt is not setup
    if (!this.trakt) {
      return []
    }

    let movieIds = []

    try {
      const traktRelatedMovies = await this.trakt.movies.related({
        id: movieImdbId,
        limit: 30
      })

      movieIds = traktRelatedMovies.map((item) => item.ids.imdb)
    } catch (e) {
    }

    if (movieIds.length === 0) {
      return []
    }

    const movies = await this.moviesService.findAllWithIDS(movieIds)

    return this.sortItemsOnIds(movies, movieIds)
  }

  private sortItemsOnIds(items, ids) {
    return items.sort((itemA, itemB) =>
      ids.indexOf(itemA._id) - ids.indexOf(itemB._id)
    )
  }
}
