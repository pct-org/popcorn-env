import { Module } from '@nestjs/common'

import { SearchBetterResolver } from './search-better.resolver'

import { MoviesService } from '../movies/movies.service'
import { EpisodesService } from '../episodes/episodes.service'
import { SearchModule } from '../shared/search/search.module'
import { ShowsService } from '../shows/shows.service'

@Module({
  imports: [
    SearchModule
  ],
  providers: [
    SearchBetterResolver,
    MoviesService,
    EpisodesService,
    ShowsService,
  ]
})
export class SearchBetterModule {
}
