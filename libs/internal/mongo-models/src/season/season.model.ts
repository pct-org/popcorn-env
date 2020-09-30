import { model } from 'mongoose'

import { seasonSchema } from './season.schema'

export const SeasonModel = model('Season', seasonSchema)
