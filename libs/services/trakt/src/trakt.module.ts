import { Module, Global } from '@nestjs/common'

import { TraktService } from './trakt.service'

@Global()
@Module({
  providers: [TraktService],
  exports: [TraktService]
})
export class TraktModule {
}
