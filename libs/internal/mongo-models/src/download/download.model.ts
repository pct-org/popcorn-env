import { model } from 'mongoose'

import { downloadSchema } from './download.schema'

export const DownloadModel = model('Download', downloadSchema)
