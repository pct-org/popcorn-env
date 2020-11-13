import { MongooseModule } from '@nestjs/mongoose'

export { EpisodesService } from './episodes.service'

import { episodeSchema } from './episode.schema'

export const EPISODES_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Episodes', schema: episodeSchema }])
