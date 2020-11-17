import { Field, ObjectType } from '@nestjs/graphql'
import { TraktSeason } from '@pct-org/services/trakt'
import { Season } from '@pct-org/types/season'
import { Content } from '@pct-org/types/shared'

import { AirInformation } from './air-information/air-information.object-type'

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

  /**
   * Internally used only!
   * For the scraper
   */
  _traktSeasons?: TraktSeason[]

}
