import { Module } from '@nestjs/common'
import { ShowsService } from '@pct-org/types/show'
import { EpisodesService } from '@pct-org/types/episode'

import { ShowsController } from './shows.controller'

@Module({
  providers: [
    ShowsService,
    EpisodesService
  ],
  controllers: [
    ShowsController
  ]
})
export class ShowsModule {
}
