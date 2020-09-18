import { Schema } from 'mongoose'

import { subtitleSchema } from '../shared/subtitle.schema'

export const downloadSchema = (new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    type: String,
    itemType: String,
    torrentType: String,
    quality: String,
    progress: Number,
    status: {
      type: String,
      default: 'queued'
    },
    timeRemaining: Number,
    speed: Number,
    numPeers: Number,
    createdAt: Number,
    updatedAt: Number,
    subtitles: {
      type: [subtitleSchema]
    },
  },
  {
    collection: 'downloads'
  }
))
