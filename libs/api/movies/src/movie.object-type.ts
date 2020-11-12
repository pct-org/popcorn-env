import { Field, ObjectType } from '@nestjs/graphql'
import { Content, Torrent, Watched, DownloadInfo } from '@pct-org/api/shared'

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
