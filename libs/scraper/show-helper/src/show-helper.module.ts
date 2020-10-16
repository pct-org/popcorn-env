import { Module, Global } from '@nestjs/common'

import { ShowHelperService } from './show-helper.service'
import { SeasonHelperService } from './season-helper.service'
import { EpisodeHelperService } from './episode-helper.service'

@Global()
@Module({
  providers: [
    ShowHelperService,
    SeasonHelperService,
    EpisodeHelperService
  ],
  exports: [
    ShowHelperService
  ]
})
export class ShowHelperModule {
}
