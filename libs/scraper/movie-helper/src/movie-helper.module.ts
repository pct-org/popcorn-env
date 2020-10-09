import { Module, Global } from '@nestjs/common'

import { MovieHelperService } from './movie-helper.service'

@Global()
@Module({
  providers: [MovieHelperService],
  exports: [MovieHelperService]
})
export class MovieHelperModule {
}
