import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Torrent {

  @Field({ description: 'The title of the torrent.', nullable: true })
  title: string

  @Field({ description: 'The quality of the video (2160p, 1080p, 720p, 480p).' })
  quality: string

  @Field({ description: 'The type of torrent, scraped or searched.', defaultValue: 'scraped' })
  type: string

  @Field({ description: 'The website from which the torrent was obtained.' })
  provider: string

  @Field({ description: 'The language code describing the audio language of the video.' })
  language: string

  @Field({ description: 'The size of the video to which the torrent points (in bytes).', nullable: true })
  size: number

  @Field({ description: 'The size of the video to which the torrent points (human readable).', nullable: true })
  sizeString: string

  @Field({ description: 'The number of people seeding the torrent currently.' })
  seeds: number

  @Field({ description: 'The number of peers the torrent has.' })
  peers: number

  @Field({ description: 'The url pointing to the torrent.' })
  url: string

}
