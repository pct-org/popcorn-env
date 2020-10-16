import { Injectable, Logger } from '@nestjs/common'
import * as Fanart from 'fanart.tv-api'
import { Images, Movie } from '@pct-org/mongo-models'

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
        ? {
          full: backdrop.url,
          high: backdrop.url,
          medium: backdrop.url,
          thumb: backdrop.url
        }
        : item.images.backdrop,

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
