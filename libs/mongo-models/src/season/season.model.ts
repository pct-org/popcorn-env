import { Model, Document } from 'mongoose'

import { Season } from './season.object-type'

export interface SeasonDocument extends Season, Document {

  _id: string

}

export type SeasonModel = Model<SeasonDocument>
