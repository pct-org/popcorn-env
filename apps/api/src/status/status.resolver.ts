import { Query, Resolver } from '@nestjs/graphql'

import { StatusService } from './status.service'
import { Status } from './status.object-type'
import { StatusScraper } from './status-scraper.object-type'

@Resolver(of => Status)
export class StatusResolver {

  constructor(private readonly statusService: StatusService) {}

  @Query(returns => Status, { description: 'Get the status of the api.' })
  status(): Promise<Status> {
    return this.statusService.getStatus()
  }

  @Query(returns => StatusScraper, {description: 'Get the status of the scraper.'})
  scraper(): Promise<StatusScraper> {
    return this.statusService.getScraperStatus()
  }

}
