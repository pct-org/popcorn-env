import { Injectable, Logger } from '@nestjs/common'
import { Tmdb, NotFoundError } from 'tmdb'
import { Images, ImagesSizes, Movie, Show } from '@pct-org/mongo-models'

@Injectable()
export class TmdbService {

  private readonly tmdb

  private readonly logger = new Logger('TMDB')

  constructor() {
    const tmdbkey = process.env.TMDB_KEY

    if (tmdbkey) {
      this.tmdb = new Tmdb(tmdbkey)
    }
  }

  public getMovieImages(item: Movie): Promise<Images> {
    return this.getImages(item, 'movie')
  }

  public getShowImages(item: Show): Promise<Images> {
    return this.getImages(item, 'tv')
  }

  private async getImages(item: Movie | Show, type: string): Promise<Images> {
    let poster = null
    let backdrop = null

    try {
      const images = await this.tmdb.get(`${type}/${item._id}/images`)

      poster = images.posters.filter(
        poster => poster.iso6391 === 'en' || poster.iso6391 === null
      ).shift()?.filePath ?? null

      backdrop = images.backdrops.filter(
        backdrop => backdrop.iso6391 === 'en' || backdrop.iso6391 === null
      ).shift()?.filePath ?? null

    } catch (err) {
      if (err instanceof NotFoundError) {
        this.logger.warn(`Can't find images for slug '${item.slug}'`)

      } else {
        this.logger.error(`Error happened getting images for '${item.slug}'`, err)
      }
    }

    return {
      poster: this.formatImage(poster),
      backdrop: this.formatImage(backdrop)
    }
  }

  /**
   * Formats imdb image sizes
   */
  private formatImage(filePath: string = null): ImagesSizes {
    const baseUrl = 'https://image.tmdb.org/t/p'

    return {
      full: filePath ?
        `${baseUrl}/original${filePath}`
        : filePath,

      high: filePath ?
        `${baseUrl}/w1280${filePath}`
        : null,

      medium: filePath
        ? `${baseUrl}/w780${filePath}`
        : null,

      thumb: filePath
        ? `${baseUrl}/w342${filePath}`
        : null
    }
  }

}
