import { Query, Resolver, ResolveField, Parent, Args } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Show, ShowsService } from '@pct-org/types/show'
import { Episode, EpisodesService } from '@pct-org/types/episode'

import { BookmarksService } from '../bookmarks/bookmarks.service'

@Resolver(of => Episode)
export class EpisodesResolver {

  @Inject()
  private readonly bookmarksService: BookmarksService

  @Inject()
  private readonly episodesService: EpisodesService

  @Inject()
  private readonly showsService: ShowsService

  @Query(returns => [Episode], { description: 'Get episodes from bookmarks that have aired in the past 7 days.' })
  public async myEpisodes(): Promise<Episode[]> {
    const shows = await this.bookmarksService.findAllShows({
      offset: 0,
      limit: 1000,
      query: null
    })

    return this.episodesService.findMyEpisodes(shows.map((show) => show._id))
  }

  @Query(returns => Episode, { description: 'Get one episode.' })
  public episode(@Args('_id') _id: string): Promise<Episode> {
    return this.episodesService.findOne(_id)
  }

  @ResolveField(type => Show, { description: 'Get the show of the episode.' })
  public show(@Parent() episode: Episode): Promise<Show> {
    return this.showsService.findOne(episode.showImdbId)
  }

}
