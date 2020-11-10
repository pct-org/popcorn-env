import { Module } from '@nestjs/common'
import { MovieHelperModule } from '@pct-org/scraper/helpers/movie'

import { YtsProviderService } from './yts-provider.service'

@Module({
  imports: [
    MovieHelperModule
  ],
  providers: [
    YtsProviderService,
  ],
  exports: [
    YtsProviderService
  ]
})
export class YtsProviderModule {
}
