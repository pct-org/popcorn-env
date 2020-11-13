import { MongooseModule } from '@nestjs/mongoose'

export { EpisodesService } from './episodes.service'
export { EpisodeModel } from './episode.model'
export { Episode } from './episode.object-type'

import { episodeSchema } from './episode.schema'

export const EPISODES_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Episodes', schema: episodeSchema }])
