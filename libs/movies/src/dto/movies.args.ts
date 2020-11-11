import { ArgsType, Field } from '@nestjs/graphql'

import { ContentsArgs } from '../content/dto/contents.args'

@ArgsType()
export class MoviesArgs extends ContentsArgs {

  @Field()
  noWatched: boolean = false

}
