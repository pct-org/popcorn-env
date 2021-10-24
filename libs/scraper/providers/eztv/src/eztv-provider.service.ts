import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  BaseProvider,
  ScrapedItem,
  ScraperProviderConfig
} from '@pct-org/scraper/providers/base'
import { EztvApi } from '@pct-org/eztv-api'
import pLimit from 'p-limit'
import { ShowHelperService } from '@pct-org/scraper/helpers/show'
import { SHOW_TYPE } from '@pct-org/types/show'

@Injectable()
export class EztvProviderService extends BaseProvider {
  @Inject()
  protected readonly showHelper: ShowHelperService

  protected readonly name = 'EZTV'

  protected readonly maxWebRequests = 2

  protected logger = new Logger(this.name)

  protected readonly configs: ScraperProviderConfig[] = [
    {
      contentType: SHOW_TYPE
    }
  ]

  protected api

  constructor() {
    super()

    this.api = new EztvApi()
  }

  protected async scrapeConfig(config: ScraperProviderConfig): Promise<void> {
    this.setConfig(config)

    const contents: ScrapedItem[] = await this.api.getAllShows()

    this.logger.log(
      `${this.name}: Found ${contents.length} ${this.contentType}s.`
    )

    const limit = pLimit(this.maxWebRequests)

    await Promise.all(
      contents.map((content) =>
        limit(async () => {
          const isInBlacklist = await this.isItemBlackListed(content)

          // Only get data for this item if it's not in the blacklist
          if (!isInBlacklist) {
            try {
              // Get full show data
              const show: ScrapedItem = await this.api.getShowData(content)

              // Enhance and import the show
              await this.enhanceAndImport(show)
            } catch (err) {
              const errorMessage = err.message || err

              this.logger.error(
                `EztvProviderService.scrapeConfig: ${errorMessage}`,
                err.stack
              )

              // Log the content so it can be better debugged from logs
              if (errorMessage.includes('Could not find any data with slug')) {
                this.logger.error(JSON.stringify(content))
              }
            }
          }
        })
      )
    )
  }

  extractContent({
    torrent,
    regex,
    lang
  }: {
    torrent: any
    regex: any
    lang: any
  }): undefined {
    return undefined
  }
}
