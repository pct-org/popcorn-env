import { HttpService, Injectable, Logger } from '@nestjs/common'
import { Episode, Movie, Torrent } from '@pct-org/mongo-models'

import { RarbgSearchAdapter } from './adapters/rarbg.search-adapter'
import { OneThreeThreeSevenXSearchAdapater } from './adapters/1337x.search-adapter'
import { SearchAdapter } from './search-base.adapter'

@Injectable()
export class SearchService {

  private readonly logger = new Logger(SearchService.name)

  adapters: SearchAdapter[] = []

  constructor(
    private readonly httpService: HttpService
  ) {
    this.adapters.push(new RarbgSearchAdapter(httpService))
    this.adapters.push(new OneThreeThreeSevenXSearchAdapater(httpService))
  }

  searchEpisode = async (episode: Episode) => {
    const results = await Promise.all(this.adapters.map(
      adapter => adapter.searchEpisode(episode))
    )

    return this.filterDuplicateTorrentsAndSort(
      results.reduce((foundTorrents, results) => ([
        ...foundTorrents,
        ...results
      ]), [])
    )
  }

  searchMovie = async (movie: Movie) => {
    const results = await Promise.all(this.adapters.map(
      adapter => adapter.searchMovie(movie))
    )

    return this.filterDuplicateTorrentsAndSort(
      results.reduce((foundTorrents, results) => ([
        ...foundTorrents,
        ...results
      ]), [])
    )
  }

  /**
   * TODO:: Also move to the utils package
   *
   * Removes duplicate qualities (gets the best one) and sorts the torrents on quality
   *
   * @param torrents
   */
  private filterDuplicateTorrentsAndSort = (torrents: Torrent[]) => {
    let newTorrents = []

    // Loop true all torrents
    torrents.forEach((torrent) => {
      let add = true
      const match = newTorrents.find(
        t => t.quality === torrent.quality
      )

      // If we have a match we need additional checks to determine witch one to keep
      if (match) {
        // Put add to false
        add = false

        // For 2160p we get the smallest one
        if (torrent.quality === '2160p') {
          // Check if existing torrent is bigger then the new one
          if (torrent.size < match.size) {
            add = true
          }

        } else if (torrent.seeds > match.seeds) {
          add = true
        }
      }

      // Only add if we are allowed and quality is not null
      if (add && torrent.quality !== null) {
        // If add was true and we have a match we need to remove the old one
        if (match) {
          newTorrents = newTorrents.filter(
            t => t.quality !== match.quality
          )
        }

        newTorrents.push(torrent)
      }
    })

    // The order that we want it in
    const order = ['2160p', '3D', '1080p', '1080p-bl', '720p', '720p-ish', '480p']

    // Return all merged torrents
    return newTorrents.sort((torrentA, torrentB) =>
      order.indexOf(torrentA.quality) - order.indexOf(torrentB.quality)
    )
  }
}
