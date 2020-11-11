import { Global, Module } from '@nestjs/common'
import { MOVIES_MONGOOSE_FEATURE } from '@pct-org/movies'


@Global()
@Module({
  imports: [
    MOVIES_MONGOOSE_FEATURE
  ],
  exports: [
    MOVIES_MONGOOSE_FEATURE
  ]
})
export class ModelsModule {
}
