import { Module } from '@nestjs/common'

import { EpisodeHelperService } from './episode-helper.service'

@Module({
  providers: [
    EpisodeHelperService
  ],
  exports: [
    EpisodeHelperService
  ]
})
export class EpisodeHelperModule {
}
