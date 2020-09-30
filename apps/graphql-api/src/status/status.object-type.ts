import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Disk {

  @Field({ description: 'The free size left available.' })
  free: string

  @Field({ description: 'The size of the downloads folder.' })
  used: string

  @Field({ description: 'The size of the disk.' })
  size: string

  @Field({ description: 'Percentage of the disk free.' })
  freePercentage: number

  @Field({ description: 'Percentage of the disk used for downloads.' })
  usedPercentage: number

  @Field({ description: 'Percentage of the disk used.' })
  sizePercentage: number

}

@ObjectType()
export class Status {

  @Field({ description: 'The current version of the api.' })
  version: string

  @Field({ description: 'The total amount of movies in the database.' })
  totalMovies: number

  @Field({ description: 'The total amount of shows in the database.' })
  totalShows: number

  @Field({ description: 'The total amount of episodes in the database.' })
  totalEpisodes: number

  @Field({ description: 'Stats of the download location.' })
  disk: Disk

}
