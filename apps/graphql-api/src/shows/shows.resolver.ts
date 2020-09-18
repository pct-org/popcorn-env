import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Show, Season } from '@pct-org/mongo-models'
import * as Trakt from 'trakt.tv'

import { ShowArgs } from './dto/show.args'
import { ShowsArgs } from './dto/shows.args'
import { ShowsService } from './shows.service'

import { ConfigService } from '../shared/config/config.service'
import { SeasonsService } from '../seasons/seasons.service'
import { DownloadsService } from '../downloads/downloads.service'

@Resolver(of => Show)
export class ShowsResolver {

  private readonly trakt

  constructor(
    private readonly showsService: ShowsService,
    private readonly seasonsService: SeasonsService,
    private readonly downloadsService: DownloadsService,
    private readonly configService: ConfigService
  ) {
    this.trakt = new Trakt({
      client_id: this.configService.get(ConfigService.TRAKT_KEY)
    })

  }

  /**
   * Fetch one show
   */
  @Query(returns => Show, { description: 'Get one show by _id (imdb id)' })
  show(@Args() showArgs: ShowArgs): Promise<Show> {
    return this.showsService.findOne(showArgs._id)
  }

  /**
   * Fetch multiple shows
   */
  @Query(returns => [Show], { description: 'Get all shows.' })
  async shows(@Args() showsArgs: ShowsArgs): Promise<Show[]> {
    if (showsArgs.downloadsOnly) {
      const downloads = await this.downloadsService.getAllEpisodes()
      const shows = this.showsService.getShowIDsFromDownloads(downloads)

      return Promise.all(
        shows.map(async (show) => ({
          ...await this.show({ _id: show._id }),
          seasons: show.seasons
        }))
      )
    }

    return this.showsService.findAll(showsArgs)
  }

  /**
   * Get most watched shows
   */
  @Query(returns => [Show], { description: 'Get most watched shows.' })
  async mostWatchedShows(): Promise<Show[]> {
    let showIds = []

    try {
      const traktMostWatched = await this.trakt.shows.watched({
        period: 'weekly'
      })

      showIds = traktMostWatched.map((item) => item.show.ids.imdb)
    } catch (e) {
    }

    if (showIds.length === 0) {
      return []
    }

    const shows = await this.showsService.findAllWithIDS(showIds)

    return shows.sort((showA, showB) =>
      showIds.indexOf(showA._id) - showIds.indexOf(showB._id),
    )
  }

  /**
   * Fetches all seasons for a show
   */
  @ResolveField(type => [Season])
  seasons(@Parent() show: Show): Promise<Season[]> {
    // If we already have seasons then map true it and get full seasons
    if (show.seasons) {
      return Promise.all(
        show.seasons.map(async (season) => ({
          ...season,
          ...await this.seasonsService.findOne(season._id)
        }))
      )
    }

    return this.seasonsService.findAllForShow(show._id)
  }

}
