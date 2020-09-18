import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class WatchOnTv {

  @Field({ description: 'The id of the item to watch, also id of the movie or episode.', nullable: true })
  _id?: string

  @Field({ description: 'The item\'s of the download, episode or movie.', nullable: true })
  itemType?: string

  @Field({ description: 'The type of torrent, scraped or searched.', nullable: true })
  torrentType?: string

  @Field({ description: 'The quality of the item to watch.', nullable: true })
  quality?: string

  @Field({ description: 'The command that is send / retrieved.' })
  command: string

}
