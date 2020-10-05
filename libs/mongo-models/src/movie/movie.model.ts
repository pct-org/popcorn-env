import { model } from 'mongoose'

import { movieSchema } from './movie.schema'

export const MovieModel = model('Movie', movieSchema)
