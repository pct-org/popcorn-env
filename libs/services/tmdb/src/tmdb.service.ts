import { Injectable, Logger } from '@nestjs/common'
import { Tmdb, NotFoundError } from 'tmdb'
import { Images, ImagesSizes } from '@pct-org/types/shared'
import { Movie } from '@pct-org/types/movie'
import { Show } from '@pct-org/types/show'
import { Season } from '@pct-org/types/season'

import { TmdbSeason } from './interfaces/tmdb.season.interface'

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

  public getSeasonInfo(item: Show, season: Season): Promise<TmdbSeason> {
    try {
      return this.tmdb.get(`tv/${item.tmdbId}/season/${season.number}`)

    } catch (err) {
      if (err instanceof NotFoundError) {
        this.logger.warn(`Can't find season for slug '${item.slug}' season '${season.number}'`)

      } else {
        this.logger.error(`Error happened getting season info for '${item.slug}' and season '${season.number}'`, err)
      }

      throw err
    }
  }

  private async getImages(item: Movie | Show, type: string): Promise<Images> {
    let poster = null
    let backdrop = null

    try {
      const images = await this.tmdb.get(`${type}/${item.tmdbId}/images`)

      if (!item.images.poster.full) {
        poster = images.posters.filter(
          poster => poster.iso6391 === 'en' || poster.iso6391 === null
        ).shift()?.filePath ?? null
      }

      if (!item.images.backdrop.full) {
        backdrop = images.backdrops.filter(
          backdrop => backdrop.iso6391 === 'en' || backdrop.iso6391 === null
        ).shift()?.filePath ?? null
      }

    } catch (err) {
      if (err instanceof NotFoundError) {
        this.logger.warn(`Can't find images for slug '${item.slug}'`)

      } else {
        this.logger.error(`Error happened getting images for '${item.slug}'`, err)
      }
    }

    return {
      poster: poster
        ? this.formatImage(poster)
        : item.images.poster,

      backdrop: backdrop
        ? this.formatImage(backdrop)
        : item.images.backdrop
    }
  }

  /**
   * Formats imdb image sizes
   */
  public formatImage(filePath: string = null): ImagesSizes {
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
