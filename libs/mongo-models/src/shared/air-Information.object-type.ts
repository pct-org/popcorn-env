import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AirInformation {

  @Field({ description: 'The name of the network on which the show airs.', nullable: true })
  network: string

  @Field({ description: 'The country in which the show airs.', nullable: true })
  country: string

  @Field({
    description: 'The name of the day (in English), on which the show airs. (Will be null if the show has stopped airing).',
    nullable: true
  })
  day: string

  @Field({
    description: 'The time at which the show airs. (Will be null if the show has stopped airing).',
    nullable: true
  })
  time: string

  @Field({
    description: 'The status of the show\'s airing (returning series, in production, planned, cancelled, ended)',
    nullable: true
  })
  status: string

}
