import { Module } from '@nestjs/common'

import { MoviesResolver } from './movies.resolver'
import { MoviesService } from './movies.service'

@Module({
  providers: [MoviesResolver, MoviesService]
})
export class MoviesModule {
}
