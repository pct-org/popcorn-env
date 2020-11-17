import { ArgsType, Field } from '@nestjs/graphql'
import { ContentsArgs } from '@pct-org/types/shared'

@ArgsType()
export class ShowsArgs extends ContentsArgs {

  @Field()
  downloadsOnly: boolean = false

}
