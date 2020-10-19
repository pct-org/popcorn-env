import { Module } from '@nestjs/common'
import { ShowHelperModule } from '@pct-org/scraper/helpers/show'

import { EztvProviderService } from './eztv-provider.service'

@Module({
  imports: [
    ShowHelperModule
  ],
  providers: [
    EztvProviderService
  ],
  exports: [
    EztvProviderService
  ]
})
export class EztvProviderModule {
}
