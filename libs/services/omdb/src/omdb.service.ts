import { Injectable, Logger } from '@nestjs/common'
import * as Omdb from 'omdb-api-pt'
import { Images, Movie } from '@pct-org/mongo-models'

@Injectable()
export class OmdbService {

  private readonly omdb

  private readonly logger = new Logger('OMDB')

  constructor() {
    const omdbKey = process.env.OMDB_KEY

    if (omdbKey) {
      this.omdb = new Omdb({
        apiKey: omdbKey
      })
    }
  }

  public async getMovieImages(item: Movie): Promise<Images> {
    let poster = null

    if (item.images.poster.full) {
      return item.images
    }

    try {
      const images = await this.omdb.byId({
        imdb: item.imdbId,
        type: 'movie'
      })

      poster = images.Poster

    } catch (err) {
      if (err.statusCode && err.statusCode === 404) {
        this.logger.error(`Can't find images for '${item.slug}'`, err)

      } else if (err.statusCode && err.statusCode === 401) {
        this.logger.error(`Rate limit hit when fetching for '${item.slug}'`, err)

      } else {
        this.logger.error(`Error happened getting images for '${item.slug}'`, err)
      }
    }

    return {
      backdrop: item.images.backdrop,
      poster: poster
        ? {
          full: poster.url,
          high: poster.url,
          medium: poster.url,
          thumb: poster.url
        }
        : item.images.poster
    }
  }

}
