import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Blacklist {

  @Field({ description: 'The id of the item that is blacklisted.' })
  _id: string

  @Field({ description: 'The title of the item that is blacklisted.' })
  title: string

  @Field({ description: 'The type of the blacklisted item, movie or show.' })
  type: string

  @Field({ description: 'The reason why this item was added to the blacklist.' })
  reason: string

  @Field({ description: 'The time at which the blacklist item was created.' })
  createdAt: number

  @Field({ description: 'The time at which the blacklist item was last updated.' })
  updatedAt: number

  @Field({ description: 'The time at which the blacklist item expires.' })
  expires: number

}
