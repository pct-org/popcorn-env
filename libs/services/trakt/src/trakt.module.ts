import { Module } from '@nestjs/common'

import { TraktService } from './trakt.service'

@Module({
  providers: [TraktService],
  exports: [TraktService]
})
export class TraktModule {
}
