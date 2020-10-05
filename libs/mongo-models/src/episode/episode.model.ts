import { model } from 'mongoose'

import { episodeSchema } from './episode.schema'

export const EpisodeModel = model('Episode', episodeSchema)
