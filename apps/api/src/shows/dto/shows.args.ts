import { ArgsType, Field } from '@nestjs/graphql'

import { ContentsArgs } from '../../shared/content/dto/contents.args'

@ArgsType()
export class ShowsArgs extends ContentsArgs {

  @Field()
  downloadsOnly: boolean = false

}
