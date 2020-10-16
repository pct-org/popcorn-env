import { Module } from '@nestjs/common'

import { EztvProviderService } from './yts-provider.service'

@Module({
  providers: [EztvProviderService],
  exports: [EztvProviderService]
})
export class EztvProviderModule {
}
