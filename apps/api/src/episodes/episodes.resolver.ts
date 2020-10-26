import { Query, Resolver, ResolveField, Parent, Args } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Episode, Show } from '@pct-org/mongo-models'

import { EpisodesService } from './episodes.service'
import { BookmarksService } from '../bookmarks/bookmarks.service'
import { ShowsService } from '../shows/shows.service'

@Resolver(of => Episode)
export class EpisodesResolver {

  @Inject()
  private readonly bookmarksService: BookmarksService

  @Inject()
  private readonly episodesService: EpisodesService

  @Inject()
  private readonly showsService: ShowsService

  @Query(returns => [Episode], { description: 'Get episodes from bookmarks that have aired in the past 7 days.' })
  public myEpisodes(): Promise<Episode[]> {
    return this.episodesService.findMyEpisodes(this.bookmarksService)
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
