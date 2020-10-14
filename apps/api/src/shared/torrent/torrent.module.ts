import { Global, Module } from '@nestjs/common'

import { TorrentService } from './torrent.service'
import { SubtitlesModule } from '../subtitles/subtitles.module'
import { MoviesModule } from '../../movies/movies.module'
import { EpisodesModule } from '../../episodes/episodes.module'

@Global()
@Module({
  imports: [
    SubtitlesModule,
    MoviesModule,
    EpisodesModule
  ],
  providers: [TorrentService],
  exports: [TorrentService]
})
export class TorrentModule {
}
