import { Module } from '@nestjs/common'
import { YtsProviderModule } from '@pct-org/scraper/providers/yts'
import { EztvProviderModule } from '@pct-org/scraper/providers/eztv'

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
