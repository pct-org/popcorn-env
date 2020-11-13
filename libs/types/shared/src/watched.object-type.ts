import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Watched {

  @Field({ description: 'Did the user completely watched this item.', defaultValue: false })
  complete: boolean

  @Field({ description: 'Progress of the user watching this item.', defaultValue: 0 })
  progress: number

}
