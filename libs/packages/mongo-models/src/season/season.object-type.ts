import { Field, ObjectType } from '@nestjs/graphql'

import { Episode } from '../episode/episode.object-type'
import { Images } from '../shared/images.object-type'

@ObjectType()
export class Season {

  @Field({ description: 'The id of the show.' })
  _id: string

  @Field({ description: 'The imdb id of the show.' })
  showImdbId: string

  @Field({ description: 'The tmdb_id of the season.' })
  tmdbId: number

  @Field({ description: 'The season number.' })
  number: number

  @Field({ description: 'The title of the season.' })
  title: string

  @Field({ description: 'A brief summary of the season.', nullable: true })
  synopsis: string

  @Field({ description: 'The date on which the first episode of the season first aired.' })
  firstAired: number

  @Field(type => Images, { description: 'The season poster for the current season.' })
  images: Images

  @Field({ description: 'The type of the content.' })
  type: string

  @Field(type => [Episode], { description: 'The episodes in the season.' })
  episodes: Episode[]

  @Field({ description: 'The time at which the content was created.' })
  createdAt: number

  @Field({ description: 'The time at which the content was last updated.' })
  updatedAt: number

}
