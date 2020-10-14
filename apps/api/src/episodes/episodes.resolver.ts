import { Query, Resolver, ResolveField, Parent, Args } from '@nestjs/graphql'
import { Episode, Show } from '@pct-org/mongo-models'

import { EpisodesService } from './episodes.service'
import { BookmarksService } from '../bookmarks/bookmarks.service'
import { ShowsService } from '../shows/shows.service'

@Resolver(of => Episode)
export class EpisodesResolver {

  constructor(
    private readonly bookmarksService: BookmarksService,
    private readonly episodesService: EpisodesService,
    private readonly showsService: ShowsService
  ) {}

  @Query(returns => [Episode], { description: 'Get episodes from bookmarks that have aired in the past 7 days.' })
  myEpisodes(): Promise<Episode[]> {
    return this.episodesService.findMyEpisodes(this.bookmarksService)
  }

  @Query(returns => Episode, { description: 'Get one episode.' })
  episode(
    @Args('_id') _id: string
  ): Promise<Episode> {
    return this.episodesService.findOne(_id)
  }

  @ResolveField(type => Show, { description: 'Get the show of the episode.' })
  show(@Parent() episode: Episode): Promise<Show> {
    return this.showsService.findOne(episode.showImdbId)
  }

}
