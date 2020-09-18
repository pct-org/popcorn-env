import { Module } from '@nestjs/common'

import { ShowsResolver } from './shows.resolver'
import { ShowsService } from './shows.service'

import { SeasonsService } from '../seasons/seasons.service'
import { DownloadsService } from '../downloads/downloads.service'

@Module({
  providers: [
    ShowsResolver,
    ShowsService,
    SeasonsService,
    DownloadsService
  ]
})
export class ShowsModule {
}
