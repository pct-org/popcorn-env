import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StatusScraper {

  @Field({ description: 'The current version of the scraper.' })
  version: string

  @Field({ description: 'The current version of the scraper.' })
  status: string

  @Field({ description: 'The date when the scraper last updated.' })
  updated: string

  @Field({ description: 'The date when the scraper is going to update.' })
  nextUpdate: string

  @Field({ description: 'The time the scraper is online.' })
  uptime: string

}
