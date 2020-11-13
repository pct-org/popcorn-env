import { Module } from '@nestjs/common'
import { ShowsService } from '@pct-org/api/shows'
import { EpisodesService } from '@pct-org/api/episodes'

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
