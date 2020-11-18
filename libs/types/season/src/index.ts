import { MongooseModule } from '@nestjs/mongoose'

export * from './season.object-type'
export * from './season.model'
export * from './seasons.service'

import { seasonSchema } from './season.schema'

export const SEASONS_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Seasons', schema: seasonSchema }])

export const SEASON_TYPE = 'season'
export const SEASONS_TYPE = 'seasons'
