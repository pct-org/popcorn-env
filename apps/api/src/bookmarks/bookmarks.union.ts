import { createUnionType } from '@nestjs/graphql'
import { Movie, MOVIE_TYPE } from '@pct-org/types/movie'
import { Show, SHOW_TYPE } from '@pct-org/types/show'

export const BookmarksUnion = createUnionType({
  name: 'Bookmark',
  types: () => [Movie, Show],
  resolveType(value) {
    if (value.type === MOVIE_TYPE) {
      return Movie
    }

    if (value.type === SHOW_TYPE) {
      return Show
    }

    return null
  }
})
