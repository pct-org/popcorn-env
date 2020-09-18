import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Status {

  @Field({ description: 'The current version of the api.' })
  version: string

  @Field({ description: 'The total amount of movies in the database.' })
  totalMovies: number

  @Field({ description: 'The total amount of shows in the database.' })
  totalShows: number

  @Field({ description: 'The total amount of episodes in the database.' })
  totalEpisodes: number

}
