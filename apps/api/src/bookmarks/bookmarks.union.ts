import { createUnionType } from '@nestjs/graphql'
import { Movie, Show } from '@pct-org/mongo-models'

export const BookmarksUnion = createUnionType({
  name: 'Bookmark',
  types: () => [Movie, Show],
  resolveType(value) {
    if (value.type === 'movie') {
      return Movie
    }

    if (value.type === 'show') {
      return Show
    }

    return null
  }
})
