import { Module, Global } from '@nestjs/common'

import { OmdbService } from './omdb.service'

@Global()
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
