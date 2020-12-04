import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Movie, MOVIE_TYPE } from '@pct-org/types/movie'
import { Episode, EPISODE_TYPE } from '@pct-org/types/episode'

import { MovieEpisodeUnion } from '../shared/movie-episode.union'
import { WatchedService } from './watched.service'

@Resolver(of => MovieEpisodeUnion)
export class WatchedResolver {

  @Inject()
  private readonly watchedService: WatchedService

  @Mutation(returns => MovieEpisodeUnion, { description: 'Mark movie or episode watched.' })
  public markWatched(
    @Args('_id') _id: string,
    @Args('type') type: string
  ): Promise<Movie | Episode> {
    if (type === MOVIE_TYPE) {
      return this.watchedService.markMovie(_id, true)

    } else if (type === EPISODE_TYPE) {
      return this.watchedService.markEpisode(_id, true)
    }

    return null
  }

  @Mutation(returns => MovieEpisodeUnion, { description: 'Mark movie or episode unwatched.' })
  public markUnwatched(
    @Args('_id') _id: string,
    @Args('type') type: string
  ): Promise<Movie | Episode> {
    if (type === MOVIE_TYPE) {
      return this.watchedService.markMovie(_id, false)

    } else if (type === EPISODE_TYPE) {
      return this.watchedService.markEpisode(_id, false)
    }

    return null
  }

}
