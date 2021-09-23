import { Inject, Injectable, Logger } from '@nestjs/common'
import { BaseProvider, ScraperProviderConfig, ScrapedItem } from '@pct-org/scraper/providers/base'
import { MOVIE_TYPE } from '@pct-org/types/movie'
import * as Yts from 'yts-api-pt'

import { YtsTorrent } from './yts-provider.interfaces'
import { MovieHelperService } from '@pct-org/scraper/helpers/movie'

@Injectable()
export class YtsProviderService extends BaseProvider {

  @Inject()
  protected readonly movieHelper: MovieHelperService

  protected readonly name = 'YTS'

  protected readonly maxWebRequests = 2

  protected readonly logger = new Logger(this.name)

  protected readonly configs: ScraperProviderConfig[] = [{
    contentType: MOVIE_TYPE,
    query: {
      page: 1,
      limit: 50
    }
  }]

  protected api

  constructor() {
    super()

    const yts = new Yts()
    yts.search = yts.getMovies

    this.api = yts
  }

  /**
   * Get content info from a given torrent
   */
  getContentData(torrent: YtsTorrent): ScrapedItem | undefined {
    if (torrent && torrent.torrents && torrent.imdb_code) {
      if (torrent.language.match(/english/i) || torrent.language === this.language) {
        return this.extractContent({
          torrent,
          lang: this.language
        })
      }

    } else {
      this.logger.warn(`Could not extract data from torrent: '${torrent.title}'`)
    }
  }

  extractContent({
    torrent,
    lang
  }: { torrent: YtsTorrent; lang: string }): ScrapedItem | undefined {
    const movie: ScrapedItem = {
      title: torrent.title,
      slug: torrent.imdb_code,
      imdb: torrent.imdb_code,
      year: torrent.year,
      torrents: []
    }

    torrent.torrents.forEach((torrent) => {
      const {
        hash,
        peers,
        quality,
        seeds,
        size_bytes: sizeBytes
      } = torrent

      return movie.torrents.push({
        quality,
        provider: this.name,
        language: lang,
        size: sizeBytes,
        seeds: seeds || 0,
        peers: peers || 0,
        url: `magnet:?xt=urn:btih:${hash}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337`
      })
    })

    return movie
  }

  // /**
  //  * Enhances the item with info from Trakt.tv / TMDB / OMDB / Fanart etc and inserts
  //  * it into the MongoDB database.
  //  */
  // async enhanceAndImport(item: ScrapedItem): Promise<void> {
  //   const existingItem = await this.movieHelper.getItem(item.imdb, item.slug)
  //   console.log('existingItem', existingItem)
  //
  //   const enhancedItem = await this.movieHelper.addTraktInfo(item)
  //
  //   if (!enhancedItem) {
  //     // TODO:: Use yts info
  //   }
  //
  //   return Promise.resolve()
  // }

}
