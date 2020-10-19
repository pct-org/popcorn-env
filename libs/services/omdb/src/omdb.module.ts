import { Module } from '@nestjs/common'

import { OmdbService } from './omdb.service'

@Module({
  providers: [
    OmdbService
  ],
  exports: [
    OmdbService
  ]
})
export class OmdbModule {
}
