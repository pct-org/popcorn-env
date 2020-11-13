import { Global, Module } from '@nestjs/common'
import { MOVIES_MONGOOSE_FEATURE } from '@pct-org/types/movie'
import { SHOWS_MONGOOSE_FEATURE } from '@pct-org/types/show'
import { EPISODES_MONGOOSE_FEATURE } from '@pct-org/types/episode'

@Global()
@Module({
  imports: [
    MOVIES_MONGOOSE_FEATURE,
    SHOWS_MONGOOSE_FEATURE,
    EPISODES_MONGOOSE_FEATURE
  ],
  exports: [
    MOVIES_MONGOOSE_FEATURE,
    SHOWS_MONGOOSE_FEATURE,
    EPISODES_MONGOOSE_FEATURE
  ]
})
export class ModelsModule {
}
