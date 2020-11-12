import { ArgsType, Field } from '@nestjs/graphql'
import { ContentsArgs } from '@pct-org/api/shared'

@ArgsType()
export class ShowsArgs extends ContentsArgs {

  @Field()
  downloadsOnly: boolean = false

}
