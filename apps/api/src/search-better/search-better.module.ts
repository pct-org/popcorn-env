import { Module } from '@nestjs/common'
import { MoviesService } from '@pct-org/types/movie'
import { ShowsService } from '@pct-org/types/show'
import { EpisodesService } from '@pct-org/types/episode'

import { SearchBetterResolver } from './search-better.resolver'

import { SearchModule } from '../shared/search/search.module'

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
