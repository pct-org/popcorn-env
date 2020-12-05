import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Movie, MoviesService, MOVIE_TYPE } from '@pct-org/types/movie'
import { Episode, EpisodesService, EPISODE_TYPE } from '@pct-org/types/episode'

import { MovieEpisodeUnion } from '../shared/movie-episode.union'

@Resolver()
export class ProgressResolver {

  @Inject()
  private readonly moviesService: MoviesService

  @Inject()
  private readonly episodesService: EpisodesService

  @Mutation(returns => MovieEpisodeUnion, { description: 'Update the viewing progress of movie or episode.' })
  public async progress(
    @Args('_id') _id: string,
    @Args('type') type: string,
    @Args('progress') progress: number
  ): Promise<Movie | Episode> {
    let item = null

    if (type === MOVIE_TYPE) {
      item = await this.moviesService.findOne(_id, false)

    } else if (type === EPISODE_TYPE) {
      item = await this.episodesService.findOne(_id, false)
    }

    if (item) {
      const newWatched = {
        progress,
        complete: item.watched.complete
      }

      if (progress >= 95) {
        newWatched.complete = true
      }

      item.watched = newWatched
      item.updatedAt = Number(new Date())

      await item.save()
    }

    return item
  }

}
