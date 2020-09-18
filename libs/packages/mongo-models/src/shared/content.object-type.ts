import { Field, ObjectType } from '@nestjs/graphql'

import { Runtime } from './runtime.object-type'
import { Rating } from './rating.object-type'
import { Images } from './images.object-type'

@ObjectType()
export class Content {

  @Field({ description: 'The imdb id of the content.' })
  _id: string

  @Field({ description: 'The imdb id of the content.' })
  imdbId: string

  @Field({ description: 'The tmdb id of the content.' })
  tmdbId: number

  @Field({ description: 'The title of the content.' })
  title: string

  @Field({ description: 'The release date of the content.' })
  released: number

  @Field({ description: 'The certification of the content.' })
  certification: string

  @Field({ description: 'The slug of the content.' })
  slug: string

  @Field({ description: 'A brief summary of the content.' })
  synopsis: string

  @Field(type => Runtime, { description: 'How long the content is.' })
  runtime: Runtime

  @Field(type => Rating, { description: 'The rating of the content.' })
  rating: Rating

  @Field({ description: 'Is the item bookmarked by the user', nullable: true })
  bookmarked: boolean

  @Field({ description: 'The time the user bookmarked the item', nullable: true })
  bookmarkedOn?: number

  @Field(type => Images, { description: 'The images for the content.' })
  images: Images

  @Field(type => [String], { description: 'The genres describing the content.' })
  genres: string[]

  @Field({ description: 'The type of the content.' })
  type: string

  @Field({ description: 'The content\'s trailer', nullable: true })
  trailer?: string

  @Field({ description: 'The content\'s trailer id', nullable: true })
  trailerId?: string

  @Field({ description: 'The time at which the content was created.' })
  createdAt: number

  @Field({ description: 'The time at which the content was last updated.' })
  updatedAt: number

}
