import { Document } from 'mongoose'

import { Download } from './download.object-type'

export interface DownloadDocument extends Download, Document {

  _id: string

}
