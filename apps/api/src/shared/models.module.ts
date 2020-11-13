import { Global, Module } from '@nestjs/common'

import { MOVIES_MONGOOSE_FEATURE } from '@pct-org/types/movie'
import { SHOWS_MONGOOSE_FEATURE } from '@pct-org/types/show'
import { SEASONS_MONGOOSE_FEATURE } from '@pct-org/types/season'
import { EPISODES_MONGOOSE_FEATURE } from '@pct-org/types/episode'
import { DOWNLOADS_MONGOOSE_FEATURE } from '@pct-org/types/download'
import { BLACKLIST_MONGOOSE_FEATURE } from '@pct-org/types/blacklist'

@Global()
@Module({
  imports: [
    MOVIES_MONGOOSE_FEATURE,
    SHOWS_MONGOOSE_FEATURE,
    SEASONS_MONGOOSE_FEATURE,
    EPISODES_MONGOOSE_FEATURE,
    DOWNLOADS_MONGOOSE_FEATURE,
    BLACKLIST_MONGOOSE_FEATURE
  ],
  exports: [
    MOVIES_MONGOOSE_FEATURE,
    SHOWS_MONGOOSE_FEATURE,
    SEASONS_MONGOOSE_FEATURE,
    EPISODES_MONGOOSE_FEATURE,
    DOWNLOADS_MONGOOSE_FEATURE,
    BLACKLIST_MONGOOSE_FEATURE
  ]
})
export class ModelsModule {
}
