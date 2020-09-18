import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Subtitle {

  @Field({ description: 'The location of the subtitle.' })
  location: string

  @Field({ description: 'The language of the subtitle' })
  language: string

  @Field({ description: 'The language code of the subtitle.' })
  code: string

  @Field({ description: 'The match score of the subtitle.' })
  score: number

}
