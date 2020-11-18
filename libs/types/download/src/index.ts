import { MongooseModule } from '@nestjs/mongoose'

export { Download } from './download.object-type'
export { DownloadModel } from './download.model'

import { downloadSchema } from './download.schema'

export const DOWNLOADS_MONGOOSE_FEATURE = MongooseModule.forFeature([{ name: 'Downloads', schema: downloadSchema }])

export const DOWNLOAD_TYPE = 'download'
