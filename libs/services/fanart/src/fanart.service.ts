import { Injectable, Logger } from '@nestjs/common'
import * as Fanart from 'fanart.tv-api'
import { Images, ImagesSizes, Movie, Show } from '@pct-org/mongo-models'

@Injectable()
export class FanartService {

  private readonly fanart

  private readonly logger = new Logger('Fanart')

  constructor() {
    const fanartkey = process.env.FANART_KEY

    if (fanartkey) {
      this.fanart = new Fanart({
        apiKey: fanartkey
      })
    }
  }

  public async getMovieImages(item: Movie): Promise<Images> {
    let poster = null
    let backdrop = null

    try {
      const images = await this.fanart.getMovieImages(item.tmdbId)

      backdrop = !item.images.backdrop.full && images.moviebackground
        ? images.moviebackground.shift()
        : !item.images.backdrop && images.hdmovieclearart
          ? images.hdmovieclearart.shift()
          : null

      poster = !item.images.poster.full && images.movieposter
        ? images.movieposter.shift()
        : null

    } catch (err) {
      this.logger.error(`Error happened getting images for '${item.slug}'`, err)
    }

    return {
      backdrop: backdrop
        ? this.formatImage(backdrop)
        : item.images.backdrop,

      poster: poster
        ? this.formatImage(poster)
        : item.images.poster
    }
  }

  public async getShowImages(item: Show): Promise<Images> {
    let poster = null
    let backdrop = null

    try {
      const images = await this.fanart.getShowImages(item.tvdbId)

      backdrop = !item.images.backdrop.full && images.showbackground
        ? images.showbackground.shift()
        : !item.images.backdrop && images.clearart
          ? images.clearart.shift()
          : null

      poster = !item.images.poster.full && images.tvposter
        ? images.tvposter.shift()
        : null

    } catch (err) {
      this.logger.error(`Error happened getting images for '${item.slug}'`, err)
    }

    return {
      backdrop: backdrop
        ? this.formatImage(backdrop)
        : item.images.backdrop,

      poster: poster
        ? this.formatImage(poster)
        : item.images.poster
    }
  }

  private formatImage(image: { url: string }): ImagesSizes {
    return {
      full: image.url,
      high: image.url,
      medium: image.url,
      thumb: image.url
    }
  }

}