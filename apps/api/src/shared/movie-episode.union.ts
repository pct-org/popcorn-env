import { createUnionType } from '@nestjs/graphql'
import { Movie, MOVIE_TYPE } from '@pct-org/types/movie'
import { Episode, EPISODE_TYPE } from '@pct-org/types/episode'

export const MovieEpisodeUnion = createUnionType({
  name: 'MovieOrEpisode',
  description: 'Movie or Episode',
  types: () => [Movie, Episode],
  resolveType(value) {
    if (value.type === MOVIE_TYPE) {
      return Movie

    } else if (value.type === EPISODE_TYPE) {
      return Episode
    }

    return null
  }
})
