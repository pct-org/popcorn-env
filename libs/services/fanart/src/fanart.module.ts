import { Module } from '@nestjs/common'

import { FanartService } from './fanart.service'

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
