import { Inject, Logger, Module, OnApplicationBootstrap } from '@nestjs/common'
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose'
import { CronJob } from 'cron'
import * as pMap from 'p-map'

import { ModelsModule } from './shared/models.module'
import { ConfigModule } from './shared/config/config.module'
import { ConfigService } from './shared/config/config.service'
import { ProvidersModule } from './providers/providers.module'
import { ProvidersService } from './providers/providers.service'

import { StatusModule } from './routes/status/status.module'

@Module({
  imports: [
    ConfigModule,
    ModelsModule,

    ProvidersModule,
    StatusModule,

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

  @Inject()
  private schedulerRegistry: SchedulerRegistry

  @Inject()
  private configService: ConfigService

  @Inject()
  private providersService: ProvidersService

  public onApplicationBootstrap(): void {
    const job = new CronJob(this.configService.get('CRON_TIME'), () => {
      this.scrapeConfigs
    })

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
