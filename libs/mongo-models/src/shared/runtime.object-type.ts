import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Runtime  {

  @Field({ description: 'Full string of runtime 43 minutes.' })
  full: string

  @Field({ description: 'Short string of runtime 43 min.' })
  short: string

  @Field({ description: 'Amount of hours.' })
  hours: number

  @Field({ description: 'Amount of minutes.' })
  minutes: number

}
