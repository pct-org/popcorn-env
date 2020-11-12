import { Module } from '@nestjs/common'
import { MoviesService } from '@pct-org/api/movies'

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
