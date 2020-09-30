import { Field, ObjectType } from '@nestjs/graphql'

import { Torrent } from '../shared/torrent.object-type'
import { Images } from '../shared/images.object-type'
import { Watched } from '../shared/watched.object-type'
import { DownloadInfo } from '../shared/download-info.object-type'
import { Show } from '../show/show.object-type'

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

  @Field({ description: 'A brief summary of the episode.', nullable: true })
  synopsis: string

  @Field({ description: 'The date on which the episode was first aired.' })
  firstAired: number

  @Field(type => Watched, { description: 'Did the user watched this episode already.' })
  watched: Watched

  @Field({ description: 'The type of the content.' })
  type: string

  @Field(type => Images, { description: 'The still for the current episode.' })
  images: Images

  @Field(type => [Torrent], { description: 'The episode\'s torrents.' })
  torrents: Torrent[]

  @Field(type => [Torrent], {
    description: 'The episode\'s torrents that where found by search.',
    defaultValue: []
  })
  searchedTorrents: Torrent[]

  @Field(type => DownloadInfo, { description: 'Download info' })
  download: DownloadInfo

  @Field({ description: 'The time at which the content was created.' })
  createdAt: number

  @Field({ description: 'The time at which the content was last updated.' })
  updatedAt: number

  @Field(tye => Show, { description: 'The show this episode belongs to.' })
  show: Show

}
