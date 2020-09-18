import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class NewBookmarkInput {

  @Field({ description: 'The IMDB ID of the movie or show.' })
  _id: string

  @Field({ description: 'Type of the bookmark: movie or show.' })
  type: string

}
