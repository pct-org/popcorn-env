import { Module } from '@nestjs/common'

import { SeasonsResolver } from './seasons.resolver'
import { SeasonsService } from './seasons.service'

import { EpisodesService } from '../episodes/episodes.service'

@Module({
  providers: [
    SeasonsResolver,
    SeasonsService,
    EpisodesService
  ]
})
export class SeasonsModule {
}
