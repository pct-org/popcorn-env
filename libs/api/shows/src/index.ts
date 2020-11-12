import { MongooseModule } from '@nestjs/mongoose'

export { ShowsService } from './shows.service'
export { ShowsArgs } from './dto/shows.args'
export { ShowArgs } from './dto/show.args'

import { showSchema } from './show.schema'

export const SHOWS_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Shows', schema: showSchema }])
