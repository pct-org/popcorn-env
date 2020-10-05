import { Field, ObjectType } from '@nestjs/graphql'

import { Content } from '../shared/content.object-type'
import { Torrent } from '../shared/torrent.object-type'
import { Watched } from '../shared/watched.object-type'
import { DownloadInfo } from '../shared/download-info.object-type'

@ObjectType()
export class Movie extends Content {

  @Field(type => Watched, { description: 'Did the user watched this movie already.' })
  watched: Watched

  @Field(type => [Torrent], { description: 'The movie\'s torrents.' })
  torrents: Torrent[]

  @Field(type => [Torrent], {
    description: 'The movie\'s torrents that where found by search.',
    defaultValue: []
  })
  searchedTorrents: Torrent[]

  @Field(type => DownloadInfo, { description: 'Download info' })
  download: DownloadInfo

}
