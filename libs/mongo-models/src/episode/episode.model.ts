import { Model, Document } from 'mongoose'

import { Episode } from './episode.object-type'

export interface EpisodeDocument extends Episode, Document {

  _id: string

}

export type EpisodeModel = Model<EpisodeDocument>
