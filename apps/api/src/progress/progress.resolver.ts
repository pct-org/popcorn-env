import { Args, Mutation, createUnionType, Resolver } from '@nestjs/graphql'
import { Movie, Episode } from '@pct-org/mongo-models'
import { TYPE_MOVIE, TYPE_EPISODE } from '@pct-org/constants/item-types'
import { Inject } from '@nestjs/common'

import { MoviesService } from '../movies/movies.service'
import { EpisodesService } from '../episodes/episodes.service'

export const progressUnion = createUnionType({
  name: 'Progress',
  types: () => [Movie, Episode],
  resolveType(value) {
    if (value.type === TYPE_MOVIE) {
      return Movie

    } else if (value.type === TYPE_EPISODE) {
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

    if (type === TYPE_MOVIE) {
      item = await this.moviesService.findOne(_id, false)

    } else if (type === TYPE_EPISODE) {
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
