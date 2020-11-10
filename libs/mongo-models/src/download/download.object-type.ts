import { Field, ObjectType } from '@nestjs/graphql'

import { Episode } from '../episode/episode.object-type'
import { Movie } from '../movie/movie.object-type'
import { Subtitle } from '../shared/subtitle.object-type'

@ObjectType()
export class Download {

  @Field({ description: 'The id of the download, also id of the movie or episode.' })
  _id: string

  @Field({ description: 'The type of the download, stream or download' })
  type: string

  @Field({ description: 'The item\'s of the download, episode or movie.' })
  itemType: string

  @Field({ description: 'The type of torrent, default or searched.', defaultValue: 'scraped' })
  torrentType?: string

  @Field(type => Episode, {
    description: 'The episode if type === "episode".',
    defaultValue: null,
    nullable: true
  })
  episode?: Episode

  @Field(type => Movie, {
    description: 'The movie if type === "movie".',
    defaultValue: null,
    nullable: true
  })
  movie?: Movie

  @Field({ description: 'The quality of the download.' })
  quality: string

  @Field({ description: 'The progress of the download.' })
  progress: number

  @Field({ description: 'Status of the download.', defaultValue: 'queued' })
  status?: string

  @Field({ description: 'Remaining time for the download.', nullable: true })
  timeRemaining?: string

  @Field({ description: 'Formatted download speed.', nullable: true })
  speed?: string

  @Field({ description: 'Number of peers of the download.', nullable: true })
  numPeers?: number

  @Field({ description: 'The time at which the download was created.' })
  createdAt: number

  @Field({ description: 'The time at which the download was last updated.' })
  updatedAt: number

  @Field(type => [Subtitle], { description: 'Subtitles for the download.', defaultValue: [] })
  subtitles?: Subtitle[] = []

}
