import { Module } from '@nestjs/common'
import { EpisodesService } from '@pct-org/types/episode'

import { SeasonsResolver } from './seasons.resolver'
import { SeasonsService } from './seasons.service'

@Module({
  providers: [
    SeasonsResolver,
    SeasonsService,
    EpisodesService
  ]
})
export class SeasonsModule {
}
