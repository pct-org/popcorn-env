import { Injectable, Logger } from '@nestjs/common'
import * as TvDB from 'node-tvdb'
import { Images } from '@pct-org/types/shared'
import { Show } from '@pct-org/types/show'

@Injectable()
export class TvdbService {

  public static BASE_URL = 'https://thetvdb.com/banners/'

  private readonly tvdb

  private readonly logger = new Logger('TvDB')

  constructor() {
    const tvdbkey = process.env.TVDB_KEY

    if (tvdbkey) {
      this.tvdb = new TvDB(tvdbkey)
    }
  }

  public async getShowImages(item: Show): Promise<Images> {
    let poster = null
    let backdrop = null

    try {
      const images = await this.tvdb.getSeriesById(item.tvdbId)

      backdrop = !item.images.backdrop.full && images.fanart
        ? `${TvdbService.BASE_URL}${images.fanart}`
        : null

      poster = !item.images.poster.full && images.poster
        ? `${TvdbService.BASE_URL}${images.poster}`
        : null

    } catch (err) {
      if (err.statusCode && err.statusCode === 404) {
        this.logger.warn(`Can't find images for '${item.slug}'`)

      } else {
        this.logger.error(`Error happened getting images for '${item.slug}'`, err)
      }
    }

    return {
      backdrop: backdrop
        ? {
          full: backdrop,
          high: backdrop,
          medium: backdrop,
          thumb: backdrop
        }
        : item.images.poster,

      poster: poster
        ? {
          full: poster,
          high: poster,
          medium: poster,
          thumb: poster
        }
        : item.images.poster
    }

  }
}
