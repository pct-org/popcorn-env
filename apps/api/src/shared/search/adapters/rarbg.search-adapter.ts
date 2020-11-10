import { Episode, Movie, Torrent } from '@pct-org/mongo-models'
import { Logger } from '@nestjs/common'
import { formatBytes } from '@pct-org/torrent/utils'

import { SearchAdapter } from '../search-base.adapter'

export class RarbgSearchAdapter extends SearchAdapter {

  static providerName = 'RARBG'

  private readonly logger = new Logger(RarbgSearchAdapter.name)

  private url = 'https://torrentapi.org/pubapi_v2.php'

  private defaultParams = {
    app_id: 'popsticle',
    format: 'json_extended'
  }

  private token = null
  private tokenExpires = null
  private lastRequest = null

  private getToken = async () => {
    if (this.token === null || (this.tokenExpires - Date.now()) < 0) {
      const ttl = Date.now() + 900000

      const data: { token: string } = await this.get({ get_token: 'get_token' })
      this.token = data.token
      this.tokenExpires = ttl
    }

    return this.token
  }

  private getRequestParams = (item: Episode | Movie) => {
    const params = {
      mode: 'search',
      category: item.type === 'episode'
        ? 'tv'
        : 'movies',
      sort: 'seeders',
      ranked: 1,
      token: this.token,
      search_string: undefined,
      search_imdb: item._id
    }

    if (item.type === 'episode') {
      const episode: Episode = item as Episode

      params.search_imdb = episode.showImdbId
      params.search_string = this.getEpisodeQuery(episode)
    }

    return params
  }

  /**
   * Search for a episode
   *
   * @param episode
   * @returns {Promise<*>}
   */
  public async searchEpisode(episode: Episode): Promise<Torrent[]> {
    try {
      const token = await this.getToken()

      if (token) {
        const { torrent_results } = await this.get(this.getRequestParams(episode))

        if (torrent_results && torrent_results.length > 0) {
          // Double check that the torrents are for the episode we want
          const foundTorrents = torrent_results
            .filter((torrent) =>
              torrent.episode_info.imdb === episode.showImdbId
            )
            // Sometimes the episodes are marked incorrectly, so we check if the episode info matches
            // or if that SXXEXX is included in the title
            .filter((torrent) =>
              (
                parseInt(torrent.episode_info.seasonnum) === episode.season &&
                parseInt(torrent.episode_info.epnum) === episode.number
              ) ||
              torrent.title.toUpperCase().includes(this.buildSeasonEpisodeString(episode).toUpperCase())
            )

          // Format all the torrents and remove the ones that returned false
          return foundTorrents
            .map(this.formatTorrent)
            .filter(Boolean) as Torrent[]
        }
      }

    } catch (err) {
      this.logger.error('Error searching for episode!', err)
    }

    return []
  }

  /**
   * Search for movies
   *
   * @param movie
   * @returns {Promise<*>}
   */
  public async searchMovie(movie: Movie): Promise<Torrent[]> {
    try {
      const token = await this.getToken()

      if (token) {
        const { torrent_results } = await this.get(this.getRequestParams(movie))

        // Return the best torrents
        return torrent_results
          .map(this.formatTorrent)
          .filter(Boolean) as Torrent[]
      }

    } catch (err) {
      this.logger.error('Error searching for movie!', err)
    }

    return []
  }

  private formatTorrent(torrent): Torrent | boolean {
    const quality = this.determineQuality(torrent.title)

    // If we could not determine the quality we are not adding it
    if (!quality) {
      return false
    }

    return {
      language: 'en',
      peers: parseInt(torrent.leechers, 10),
      provider: RarbgSearchAdapter.providerName,
      quality: quality,
      seeds: parseInt(torrent.seeders, 10),
      size: torrent.size,
      sizeString: formatBytes(torrent.size),
      title: torrent.title,
      type: SearchAdapter.TORRENT_TYPE,
      url: torrent.download
    }
  }

  private get(params): Promise<any> {
    return new Promise((resolve, reject) => {
      let timeout = 0

      // There is a 1 req / 2 sec limit
      if (this.lastRequest !== null && (this.lastRequest + 2200) > Date.now()) {
        timeout = (this.lastRequest + 2200) - Date.now()
      }

      this.lastRequest = Date.now()

      setTimeout(() => {
        this.httpService.get(
          this.url,
          {
            params: {
              ...params,
              ...this.defaultParams
            }
          }
        ).toPromise()
          .then(({ data }) => {
            resolve(data)
          }).catch(reject)

      }, timeout)
    })
  }

}

