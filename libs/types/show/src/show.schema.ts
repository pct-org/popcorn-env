import { Schema } from 'mongoose'
import { contentSchema } from '@pct-org/types/shared'

/**
 * The schema object for the show model.
 * @type {object}
 */
export const showSchema = (new Schema(
  {
    ...contentSchema,
    tvdbId: Number,
    airInfo: {
      type: {
        network: String,
        country: String,
        day: String,
        time: String,
        status: String
      }
    },
    numSeasons: Number,
    latestEpisodeAired: Number,
    nextEpisodeAirs: Number
  },
  {
    collection: 'shows'
  }
)).index({
  'rating.watching': 1
}).index({
  'bookmarked': 1
}).index({
  'released': 1,
  'latestEpisode': 1
}).index({
  'createdAt': 1
}).index({
  'rating.votes': 1,
  'rating.percentage': 1,
  'rating.watching': 1,
}).index({
  'title': 1,
})
