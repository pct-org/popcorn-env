import { ArgsType, Field } from '@nestjs/graphql'
import { Max, Min } from 'class-validator'

@ArgsType()
export class ContentsArgs {

  @Field()
  @Min(0)
  offset: number = 0

  @Field()
  @Min(1)
  @Max(50)
  limit: number = 25

  @Field()
  sort: string = 'trending'

  @Field()
  noBookmarks: boolean = false

  @Field({ nullable: true })
  query: string = null

}
