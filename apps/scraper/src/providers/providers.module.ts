import { Module } from '@nestjs/common'
import { YtsProviderModule } from '@pct-org/scraper/yts-provider'
import { EztvProviderModule } from '@pct-org/scraper/eztv-provider'

import { ProvidersService } from './providers.service'

@Module({
  imports: [
    YtsProviderModule,
    EztvProviderModule
  ],
  providers: [
    ProvidersService
  ],
  exports: [
    ProvidersService
  ]
})
export class ProvidersModule {
}
