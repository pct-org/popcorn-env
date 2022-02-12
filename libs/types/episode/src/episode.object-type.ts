import { Field, ObjectType } from '@nestjs/graphql'

import { Show } from '@pct-org/types/show'
import { Images } from '@pct-org/types/image'
import { Torrent, Watched, DownloadInfo } from '@pct-org/types/shared'

@ObjectType()
export class Episode {

  @Field({ description: 'The id of the episode.' })
  _id: string

  @Field({ description: 'The imdb id of the show.' })
  showImdbId: string

  @Field({ description: 'The tmdb_id of the episode.' })
  tmdbId: number

  @Field({ description: 'The episode number of the current episode.' })
  number: number

  @Field({ description: 'Number of season the episode is in.' })
  season: number

  @Field({ description: 'The title of the episode.' })
  title: string

  @Field({
    description: 'A brief summary of the episode.',
    nullable: true
  })
  synopsis: string

  @Field({ description: 'The date on which the episode was first aired.' })
  firstAired: number

  @Field(() => Watched, { description: 'Did the user watched this episode already.' })
  watched: Watched

  @Field({ description: 'The type of the content.' })
  type: string

  @Field(() => Images, { description: 'The still for the current episode.' })
  images: Images

  @Field(() => [Torrent], { description: 'The episode\'s torrents.' })
  torrents: Torrent[]

  @Field(() => [Torrent], {
    description: 'The episode\'s torrents that where found by search.',
    defaultValue: []
  })
  searchedTorrents: Torrent[]

  @Field(() => DownloadInfo, { description: 'Download info' })
  download: DownloadInfo

  @Field({ description: 'The time at which the content was created.' })
  createdAt: number

  @Field({ description: 'The time at which the content was last updated.' })
  updatedAt: number

  @Field(() => Show, { description: 'The show this episode belongs to.' })
  show?: Show

}
