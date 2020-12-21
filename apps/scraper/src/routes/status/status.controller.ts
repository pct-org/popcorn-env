import { Controller, Get, Inject, OnApplicationBootstrap } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { formatMsToRemaining } from '@pct-org/torrent/utils'

import { ConfigService } from '../../shared/config/config.service'

@Controller()
export class StatusController implements OnApplicationBootstrap {

  @Inject()
  private schedulerRegistry: SchedulerRegistry

  @Inject()
  private configService: ConfigService

  private bootedSince: number

  public onApplicationBootstrap(): void {
    this.bootedSince = Date.now()
  }

  @Get('status')
  public watch() {
    const cron = this.schedulerRegistry.getCronJob('scraper')

    return {
      status: 'ok',
      version: this.configService.version,
      updated: cron.lastDate() || 'never',
      nextUpdate: cron.nextDates(),
      uptime: formatMsToRemaining(Date.now() - this.bootedSince)
    }
  }

}
