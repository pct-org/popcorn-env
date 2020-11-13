import { Module } from '@nestjs/common'
import { EpisodesService } from '@pct-org/types/episode'

import { SeasonsResolver } from './seasons.resolver'

@Module({
  providers: [
    SeasonsResolver,
    EpisodesService
  ]
})
export class SeasonsModule {
}
