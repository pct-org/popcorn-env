import { Module, Global } from '@nestjs/common'

import { TvdbService } from './tmdb.service'

@Global()
@Module({
  providers: [
    TvdbService
  ],
  exports: [
    TvdbService
  ]
})
export class TvdbModule {
}
