import { Field, ObjectType } from '@nestjs/graphql'

import { Season } from '../season/season.object-type'
import { Content } from '../shared/content.object-type'
import { AirInformation } from '../shared/air-Information.object-type'

@ObjectType()
export class Show extends Content {

  @Field({ description: 'The tvdb id for the show.' })
  tvdbId: number

  @Field(type => AirInformation, { description: 'Information about when the show airs.' })
  airInfo: AirInformation

  @Field(type => [Season], { description: 'The seasons in the show.' })
  seasons: Season[]

  @Field({ description: 'The total amount of seasons.' })
  numSeasons: number

  @Field({ description: 'The airtime of the latest episode.' })
  latestEpisodeAired: number

  @Field({ description: 'The airtime of the next episode.', nullable: true })
  nextEpisodeAirs: number

}
