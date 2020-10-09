import { Module } from '@nestjs/common'

import { YtsProviderService } from './yts-provider.service'

@Module({
  providers: [YtsProviderService],
  exports: [YtsProviderService]
})
export class YtsProviderModule {
}
