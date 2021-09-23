import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { Movie } from '@pct-org/types/movie'
import { Episode } from '@pct-org/types/episode'
import { Torrent } from '@pct-org/types/shared'
import { formatTorrents } from '@pct-org/torrent/utils'

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

  public searchEpisode = async(episode: Episode): Promise<Torrent[]> => {
    const results = await Promise.all(this.adapters.map(
      adapter => adapter.searchEpisode(episode))
    )

    return formatTorrents(
      results.reduce((foundTorrents, results) => ([
        ...foundTorrents,
        ...results
      ]), [])
    )
  }

  public searchMovie = async(movie: Movie): Promise<Torrent[]> => {
    const results = await Promise.all(this.adapters.map(
      adapter => adapter.searchMovie(movie))
    )

    return formatTorrents(
      results.reduce((foundTorrents, results) => ([
        ...foundTorrents,
        ...results
      ]), [])
    )
  }

}
