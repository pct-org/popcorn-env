import { Schema } from 'mongoose'

import { torrentSchema } from '../shared/torrent.schema'
import { watchedSchema } from '../shared/watched.schema'
import { imagesSchema } from '../shared/images.schema'
import { downloadInfoSchema } from '../shared/download-info.schema'

export const episodeSchema = (new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    showImdbId: String,
    tmdbId: Number,
    number: Number,
    season: Number,
    title: String,
    synopsis: String,
    firstAired: Number,
    type: String,
    ...watchedSchema,
    ...downloadInfoSchema,
    images: imagesSchema,
    torrents: {
      type: [torrentSchema]
    },
    searchedTorrents: {
      type: [torrentSchema]
    },
    createdAt: Number,
    updatedAt: Number
  },
  {
    collection: 'episodes'
  }
)).index({
  showImdbId: 1,
  season: 1,
  number: 1,
})
