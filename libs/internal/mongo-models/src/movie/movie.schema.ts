import { Schema } from 'mongoose'

import { contentSchema } from '../shared/content.schema'
import { torrentSchema } from '../shared/torrent.schema'
import { watchedSchema } from '../shared/watched.schema'
import { downloadInfoSchema } from '../shared/download-info.schema'

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
})