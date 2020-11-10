import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Show, Season } from '@pct-org/mongo-models'
import { Inject } from '@nestjs/common'
import { TraktService } from '@pct-org/services/trakt'

import { ShowArgs } from './dto/show.args'
import { ShowsArgs } from './dto/shows.args'
import { ShowsService } from './shows.service'

import { SeasonsService } from '../seasons/seasons.service'
import { DownloadsService } from '../downloads/downloads.service'

@Resolver(of => Show)
export class ShowsResolver {

  @Inject()
  private readonly showsService: ShowsService

  @Inject()
  private readonly seasonsService: SeasonsService

  @Inject()
  private readonly downloadsService: DownloadsService

  @Inject()
  private readonly traktService: TraktService

  /**
   * Fetch one show
   */
  @Query(returns => Show, { description: 'Get one show by _id (imdb id)' })
  public show(@Args() showArgs: ShowArgs): Promise<Show> {
    return this.showsService.findOne(showArgs._id)
  }

  /**
   * Fetch multiple shows
   */
  @Query(returns => [Show], { description: 'Get all shows.' })
  public async shows(@Args() showsArgs: ShowsArgs): Promise<Show[]> {
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
  public async mostWatchedShows(): Promise<Show[]> {
    const showsIds = await this.traktService.mostWatchedWeeklyShows()
    const shows = await this.showsService.findAllWithIDS(showsIds)

    return shows.sort((showA, showB) => (
      showsIds.indexOf(showA._id) - showsIds.indexOf(showB._id)
    ))
  }

  /**
   * Fetches all seasons for a show
   */
  @ResolveField(type => [Season])
  public seasons(@Parent() show: Show): Promise<Season[]> {
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
