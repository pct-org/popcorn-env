import { Module } from '@nestjs/common'
import { TraktModule } from '@pct-org/services/trakt'
import { ShowsService } from '@pct-org/types/show'
import { SeasonsService } from '@pct-org/types/season'

import { ShowsResolver } from './shows.resolver'

import { DownloadsService } from '../downloads/downloads.service'

@Module({
  imports: [
    TraktModule,
  ],
  providers: [
    ShowsResolver,
    ShowsService,
    SeasonsService,
    DownloadsService
  ]
})
export class ShowsModule {
}
