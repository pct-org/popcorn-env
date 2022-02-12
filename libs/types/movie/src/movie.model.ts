import { Model, Document } from 'mongoose'

import { Movie } from './movie.object-type'

export interface MovieDocument extends Movie, Document {

  _id: string

}
