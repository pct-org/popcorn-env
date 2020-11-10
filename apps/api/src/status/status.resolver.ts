import { Query, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'

import { StatusService } from './status.service'
import { Status } from './status.object-type'
import { StatusScraper } from './status-scraper.object-type'

@Resolver(of => Status)
export class StatusResolver {

  @Inject()
  private readonly statusService: StatusService

  @Query(returns => Status, { description: 'Get the status of the api.' })
  public status(): Promise<Status> {
    return this.statusService.getStatus()
  }

  @Query(returns => StatusScraper, {description: 'Get the status of the scraper.'})
  public scraper(): Promise<StatusScraper> {
    return this.statusService.getScraperStatus()
  }

}
