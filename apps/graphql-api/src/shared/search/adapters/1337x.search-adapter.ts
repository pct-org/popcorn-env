import { Episode, Movie, Torrent } from '@pct-org/mongo-models'
import { Logger } from '@nestjs/common'
import { search, info } from 'xtorrent'
import { parse as parseBytes } from 'bytes'

import { SearchAdapter } from '../search-base.adapter'

export class OneThreeThreeSevenXSearchAdapater extends SearchAdapter {

  static providerName = '1337x'

  private readonly logger = new Logger(OneThreeThreeSevenXSearchAdapater.name)

  /**
   * Thse uploaders are Vip Uploaders
   */
  private readonly trustedUploaders = [
    'ETTV',
    'EtHD',
    'MkvCage',
    'mazemaze16'
  ]
  /**
   * Search for a episode
   *
   * @param episode
   * @param isRetry
   * @returns {Promise<*>}
   */
  searchEpisode = async (episode: Episode) => {
    try {
      const { torrents, domain } = await search({
        query: this.getEpisodeQuery(episode),
        category: 'TV'
      })

      const foundTorrents = torrents.filter((torrent) =>
        this.trustedUploaders.includes(torrent.uploader) &&
        torrent.title.toUpperCase().includes(this.buildSeasonEpisodeString(episode).toUpperCase())
      )

      const results = await Promise.all(
        foundTorrents.map((torrent) => this.formatTorrent(torrent, domain))
      )

      return results.filter(Boolean)

    } catch (e) {
      this.logger.error('Error searching for episode!', e)
    }

    return []
  }

  /**
   * Search for movies
   *
   * @param movie
   * @param isRetry
   * @returns {Promise<*>}
   */
  searchMovie = async (movie: Movie) => {
    try {
      // TODO
    } catch (e) {
      this.logger.error('Error searching for movie!', e)
    }

    return []
  }

  formatTorrent = async (torrent, domain: string): Promise<Torrent | boolean> => {
    const quality = this.determineQuality(torrent.title)

    // If we could not determine the quality we are not adding it
    if (!quality) {
      return false
    }

    const data = await info(`${domain}${torrent.href}`)

    return {
      language: 'en',
      peers: parseInt(data.leechers, 10),
      provider: OneThreeThreeSevenXSearchAdapater.providerName,
      quality: quality,
      seeds: parseInt(data.seeders, 10),
      size: parseBytes(data.size),
      sizeString: data.size,
      title: data.title,
      type: SearchAdapter.TORRENT_TYPE,
      url: data.download.magnet
    }
  }

}

