import { createUnionType } from '@nestjs/graphql'
import { Movie, Show } from '@pct-org/mongo-models'
import { TYPE_MOVIE, TYPE_SHOW } from '@pct-org/constants/item-types'

export const BookmarksUnion = createUnionType({
  name: 'Bookmark',
  types: () => [Movie, Show],
  resolveType(value) {
    if (value.type === TYPE_MOVIE) {
      return Movie
    }

    if (value.type === TYPE_SHOW) {
      return Show
    }

    return null
  }
})
