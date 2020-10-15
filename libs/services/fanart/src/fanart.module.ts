import { Module, Global } from '@nestjs/common'

import { FanartService } from './fanart.service'

@Global()
@Module({
  providers: [
    FanartService
  ],
  exports: [
    FanartService
  ]
})
export class FanartModule {
}
