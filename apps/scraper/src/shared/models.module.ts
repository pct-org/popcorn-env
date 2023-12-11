import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { movieSchema } from '@pct-org/types/movie'
import { showSchema } from '@pct-org/types/show'
import { SEASONS_MONGOOSE_FEATURE } from '@pct-org/types/season'
import { EPISODES_MONGOOSE_FEATURE } from '@pct-org/types/episode'
import { DOWNLOADS_MONGOOSE_FEATURE } from '@pct-org/types/download'
import { BLACKLIST_MONGOOSE_FEATURE } from '@pct-org/types/blacklist'

@Global()
@Module({
  imports: [

    // TODO:: Refactor the models to decorators
    // https://docs.nestjs.com/techniques/mongodb#model-injection
    MongooseModule.forFeature([
        {
          name: 'Movies',
          schema: movieSchema
        },
        {
          name: 'Shows',
          schema: showSchema
        }
      ]
    ),

    SEASONS_MONGOOSE_FEATURE,
    EPISODES_MONGOOSE_FEATURE,
    DOWNLOADS_MONGOOSE_FEATURE,
    BLACKLIST_MONGOOSE_FEATURE
  ],
  exports: [
    MongooseModule
  ]
})
export class ModelsModule {
}
