import { ArgsType, Field } from '@nestjs/graphql'
import { ContentsArgs } from '@pct-org/types/shared'

@ArgsType()
export class MoviesArgs extends ContentsArgs {

  @Field()
  noWatched: boolean = false

}
