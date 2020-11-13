import { MongooseModule } from '@nestjs/mongoose'

export { Season } from './season.object-type'
export { SeasonModel } from './season.model'

import { seasonSchema } from './season.schema'

export const SEASONS_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Seasons', schema: seasonSchema }])
