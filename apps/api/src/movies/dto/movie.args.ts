import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class MovieArgs {

  @Field()
  _id: string

}
