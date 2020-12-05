import { Schema } from 'mongoose'
import { imagesSchema } from '@pct-org/types/image'

export const seasonSchema = (new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    showImdbId: String,
    tmdbId: Number,
    number: Number,
    title: String,
    synopsis: String,
    firstAired: Number,
    type: String,
    images: imagesSchema,
    createdAt: Number,
    updatedAt: Number
  },
  {
    collection: 'seasons'
  }
)).index({
  showImdbId: 1,
}).index({
  showImdbId: 1,
  number: 1,
})
