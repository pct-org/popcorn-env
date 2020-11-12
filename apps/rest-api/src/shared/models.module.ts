import { Global, Module } from '@nestjs/common'
import { MOVIES_MONGOOSE_FEATURE } from '@pct-org/api/movies'
import { SHOWS_MONGOOSE_FEATURE } from '@pct-org/api/shows'

@Global()
@Module({
  imports: [
    MOVIES_MONGOOSE_FEATURE,
    SHOWS_MONGOOSE_FEATURE
  ],
  exports: [
    MOVIES_MONGOOSE_FEATURE,
    SHOWS_MONGOOSE_FEATURE
  ]
})
export class ModelsModule {
}
