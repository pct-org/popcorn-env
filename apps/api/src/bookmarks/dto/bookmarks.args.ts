import { Max, Min } from 'class-validator'
import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class BookmarksArgs {

  @Field()
  @Min(0)
  offset: number = 0

  @Field()
  @Min(1)
  @Max(50)
  limit: number = 25

  @Field({ nullable: true })
  query: string = null

}
