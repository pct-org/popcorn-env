import { Module } from '@nestjs/common'
import { YtsProviderModule } from '@pct-org/scraper/yts-provider'

import { ProvidersService } from './providers.service'

@Module({
  imports: [
    YtsProviderModule
  ],
  providers: [ProvidersService],
  exports: [ProvidersService]
})
export class ProvidersModule {
}
