import { Schema } from 'mongoose'

import { contentSchema } from '../shared/content.schema'

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
  title: 'text',
  synopsis: 'text',
  _id: 1
})
