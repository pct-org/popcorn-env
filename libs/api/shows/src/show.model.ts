import { Model, Document } from 'mongoose'

import { Show } from './show.object-type'

export interface ShowDocument extends Show, Document {

  _id: string

}

export type ShowModel = Model<ShowDocument>
