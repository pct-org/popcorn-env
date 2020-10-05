import { model } from 'mongoose'

import { blacklistSchema } from './blacklist.schema'

export const BlacklistModel = model('Blacklist', blacklistSchema)
