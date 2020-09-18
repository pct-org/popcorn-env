import { Args, Mutation, createUnionType, Resolver } from '@nestjs/graphql'
import { Movie, Episode } from '@pct-org/mongo-models'

import { MoviesService } from '../movies/movies.service'
import { EpisodesService } from '../episodes/episodes.service'

export const progressUnion = createUnionType({
  name: 'Progress',
  types: () => [Movie, Episode],
  resolveType(value) {
    if (value.type === 'movie') {
      return Movie

    } else if (value.type === 'episode') {
      return Episode
    }

    return null
  }
})

@Resolver()
export class ProgressResolver {

  constructor(
    private readonly moviesService: MoviesService,
    private readonly episodesService: EpisodesService
  ) {}

  @Mutation(returns => progressUnion)
  async progress(
    @Args('_id') _id: string,
    @Args('type') type: string,
    @Args('progress') progress: number
  ): Promise<Movie | Episode> {
    let item = null

    if (type === 'movie') {
      item = await this.moviesService.findOne(_id, false)

    } else if (type === 'episode') {
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
