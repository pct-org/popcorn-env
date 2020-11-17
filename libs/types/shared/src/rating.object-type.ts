import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Rating {

  @Field({ description: 'Amount of stars.' })
  stars: number

  @Field({ description: 'How many people rated the content.' })
  votes: number

  @Field({ description: 'How many people are currently watching the content.' })
  watching: number

  @Field({ description: 'The rating of the content, expressed as a percentage.' })
  percentage: number

}
