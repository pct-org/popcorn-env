import { Args, Mutation, createUnionType, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Movie, MoviesService, MOVIE_TYPE } from '@pct-org/types/movie'
import { Episode, EpisodesService, EPISODE_TYPE } from '@pct-org/types/episode'

export const progressUnion = createUnionType({
  name: 'Progress',
  types: () => [Movie, Episode],
  resolveType(value) {
    if (value.type === TYPE_MOVIE) {
      return Movie

    } else if (value.type === EPISODE_TYPE) {
      return Episode
    }

    return null
  }
})

@Resolver()
export class ProgressResolver {

  @Inject()
  private readonly moviesService: MoviesService

  @Inject()
  private readonly episodesService: EpisodesService

  @Mutation(returns => progressUnion, { description: 'Update the viewing progress of movie or episode.' })
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
        newWatched.progress = 100
        newWatched.complete = true
      }

      item.watched = newWatched
      item.updatedAt = Number(new Date())

      await item.save()
    }

    return item
  }

}
