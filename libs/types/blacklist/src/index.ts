import { MongooseModule } from '@nestjs/mongoose'

export { Blacklist } from './blacklist.object-type'
export { BlacklistModel } from './blacklist.model'

import { blacklistSchema } from './blacklist.schema'

export const BLACKLIST_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Blacklist', schema: blacklistSchema }])
