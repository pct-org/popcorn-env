import { model } from 'mongoose'

import { showSchema } from './show.schema'

export const ShowModel = model('Show', showSchema)
