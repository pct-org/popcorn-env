import { ArgsType, Field } from '@nestjs/graphql'
import { Max, Min } from 'class-validator'

@ArgsType()
export class ContentsArgs {

  @Field()
  @Min(0)
  offset = 0

  @Field()
  @Min(1)
  @Max(50)
  limit = 25

  @Field()
  sort = 'trending'

  @Field({ nullable: true })
  query: string = null

  // Used in rest
  keywords: string = null

}
