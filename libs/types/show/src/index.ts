import { MongooseModule } from '@nestjs/mongoose'

export * from './show.object-type'
export * from './show.model'
export * from './shows.service'
export * from './dto/shows.args'
export * from './dto/show.args'
export * from './air-information/air-information.object-type'

import { showSchema } from './show.schema'

export const SHOWS_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Shows', schema: showSchema }])

export const SHOW_TYPE = 'show'
export const SHOWS_TYPE = 'shows'
