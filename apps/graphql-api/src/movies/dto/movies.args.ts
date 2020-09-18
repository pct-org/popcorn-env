import { ArgsType, Field } from '@nestjs/graphql'

import { ContentsArgs } from '../../shared/content/dto/contents.args'

@ArgsType()
export class MoviesArgs extends ContentsArgs {

  @Field()
  noWatched: boolean = false

}
