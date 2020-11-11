import { Schema } from 'mongoose'

import { contentSchema, torrentSchema, watchedSchema, downloadInfoSchema } from '@pct-org/mongo-models'

export const movieSchema = (new Schema(
  {
    ...contentSchema,
    ...watchedSchema,
    ...downloadInfoSchema,
    torrents: {
      type: [torrentSchema]
    },
    searchedTorrents: {
      type: [torrentSchema]
    }
  },
  {
    collection: 'movies'
  }
)).index({
  'watched.complete': 1,
  'rating.watching': 1
}).index({
  'rating.watching': 1
}).index({
  'bookmarked': 1
}).index({
  'released': 1
}).index({
  'year': 1
}).index({
  'createdAt': 1
}).index({
  'rating.votes': 1,
  'rating.percentage': 1,
  'rating.watching': 1
}).index({
  'title': 1
})
