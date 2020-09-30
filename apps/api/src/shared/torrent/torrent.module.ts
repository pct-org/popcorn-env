import { Global, Module } from '@nestjs/common'

import { TorrentService } from './torrent.service'
import { SubtitlesModule } from '../subtitles/subtitles.module'

@Global()
@Module({
  imports: [SubtitlesModule],
  providers: [TorrentService],
  exports: [TorrentService]
})
export class TorrentModule {
}
