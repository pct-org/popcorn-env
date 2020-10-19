import { Module } from '@nestjs/common'

import { TvdbService } from './tvdb.service'

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
