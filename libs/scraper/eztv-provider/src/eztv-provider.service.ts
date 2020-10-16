import { Injectable, Logger } from '@nestjs/common'
import { BaseProvider, ScrapedItem, ScraperProviderConfig, ShowType } from '@pct-org/scraper/base-provider'
import * as Eztv from '@pct-org/eztv-api'
import * as pMap from 'p-map'

@Injectable()
export class EztvProviderService extends BaseProvider {

  name = 'EZTV'

  maxWebRequests = 2

  logger = new Logger(this.name)

  configs: ScraperProviderConfig[] = [{
    contentType: ShowType
  }]

  api

  constructor() {
    super()

    this.api = new Eztv()
  }

  protected async scrapeConfig(config: ScraperProviderConfig): Promise<void> {
    this.setConfig(config)

    const contents: ScrapedItem[] = await this.api.getAll()

    this.logger.log(`${this.name}: Found ${contents.length} ${this.contentType}s.`)

    await pMap(
      contents,
      async (content) => {
        const isInBlacklist = await this.isItemBlackListed(content)

        // Only get data for this item if it's not in the blacklist
        if (!isInBlacklist) {
          try {
            // Get full show data
            const show: ScrapedItem = this.api.getShowData(content)

            // Enhance and import the show
            await this.enhanceAndImport(show)

          } catch (err) {
            const errorMessage = err.message || err

            this.logger.error(`BaseProvider.scrapeConfig`, err)

            // Log the content so it can be better debugged from logs
            if (errorMessage.includes('Could not find any data with slug')) {
              this.logger.error(JSON.stringify(content))
            }
          }
        }
      },
      {
        concurrency: this.maxWebRequests
      }
    )
  }

  extractContent({ torrent, regex, lang }: { torrent: any; regex: any; lang: any }): undefined {
    return undefined
  }

}
