import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class ShowArgs {

  @Field()
  _id: string

}
