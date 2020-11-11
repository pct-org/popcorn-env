import { Module } from '@nestjs/common'
import { MoviesService } from '@pct-org/movies'

import { MoviesController } from './movies.controller'

@Module({
  providers: [
    MoviesService
  ],
  controllers: [
    MoviesController
  ]
})
export class MoviesModule {
}
