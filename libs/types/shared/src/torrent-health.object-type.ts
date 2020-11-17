import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TorrentHealth {

  @Field({ description: 'Text version like: decent, healthy or poor.' })
  text: string

  @Field({ description: 'Color of the health.' })
  color: string

  @Field({ description: 'Number of the health like: 0, 1 or 2.' })
  number: number

  @Field({ description: 'Ratio of the torrent.' })
  ratio: number

}
