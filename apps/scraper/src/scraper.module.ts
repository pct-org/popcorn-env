import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common'
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose'
import { CronJob } from 'cron'
import * as pMap from 'p-map'
import { ModelsModule } from '@pct-org/mongo-models'
import { MovieHelperModule } from '@pct-org/scraper/movie-helper'

import { TraktModule } from '@pct-org/services/trakt'
import { TmdbModule } from '@pct-org/services/tmdb'
import { FanartModule } from '@pct-org/services/fanart'
import { OmdbModule } from '@pct-org/services/omdb'

import { ConfigModule } from './shared/config/config.module'
import { ConfigService } from './shared/config/config.service'
import { ProvidersModule } from './providers/providers.module'
import { ProvidersService } from './providers/providers.service'

@Module({
  imports: [
    ConfigModule,
    ModelsModule,

    MovieHelperModule,

    TraktModule,
    TmdbModule,
    FanartModule,
    OmdbModule,

    ProvidersModule,

    // Enable Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.databaseUri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
    }),

    ScheduleModule.forRoot()
  ]
})
export class ScraperModule implements OnApplicationBootstrap {

  public static JOB_NAME = 'scraper'

  private readonly logger = new Logger(ScraperModule.name)

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private configService: ConfigService,
    private providersService: ProvidersService
  ) {
  }

  public onApplicationBootstrap(): void {
    const job = new CronJob(this.configService.get('CRON_TIME'), this.scrapeConfigs)

    this.schedulerRegistry.addCronJob(ScraperModule.JOB_NAME, job)
    job.start()

    this.logger.log(`Enabled cron on '${this.configService.get('CRON_TIME')}'`)
  }

  private async scrapeConfigs(): Promise<void> {
    this.logger.log('Start scraping')

    await pMap(
      this.providersService.getProviders(),
      (provider) => provider.scrapeConfigs(),
      {
        concurrency: 1
      }
    )
  }

}
