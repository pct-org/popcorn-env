import * as pMap from 'p-map'
import * as pTimes from 'p-times'
import { Inject, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BlacklistModel } from '@pct-org/mongo-models'
import { formatTorrents } from '@pct-org/torrent/utils'
import { BaseHelper } from '@pct-org/scraper/base-helper'
import { MovieHelperService } from '@pct-org/scraper/movie-helper'
import { ShowHelperService } from '@pct-org/scraper/show-helper'

import {
  MovieType,
  ShowType,
  ScrapedItem,
  ScraperContentType,
  ScraperProviderConfig,
  ScraperProviderConfigRegex
} from './base.interfaces'

/**
 * Base class for scraping content from various sources.
 */
export abstract class BaseProvider {

  @InjectModel('Blacklist')
  private readonly blackListModel: typeof BlacklistModel

  @Inject('MovieHelperService')
  protected readonly movieHelper: MovieHelperService

  // @Inject('ShowHelperService')
  // protected readonly showHelper: ShowHelperService

  abstract readonly logger: Logger

  /**
   * The name of the abstract provider.
   */
  abstract name: string

  /**
   * The max allowed concurrent web requests.
   */
  abstract maxWebRequests: number

  /**
   * The configs for the abstract provider.
   */
  abstract configs: ScraperProviderConfig[]

  abstract api: {
    search: (options: any) => any
  }

  /**
   * The type of content for the abstract provider.
   */
  contentType: ScraperContentType

  query: any

  language: string

  regexps?: ScraperProviderConfigRegex[]

  /**
   * Starts scraping the provided configs
   */
  async scrapeConfigs(): Promise<void> {
    this.logger.log(`Started scraping...`)

    await pMap(
      this.configs,
      (config) => this.scrapeConfig(config),
      {
        concurrency: 1
      }
    )

    this.logger.log(`Done scraping`)
  }

  /**
   * Set the configuration to scrape with.
   */
  private setConfig({ query, contentType, regexps = [], language = 'en' }: ScraperProviderConfig): void {
    this.contentType = contentType
    this.query = query
    this.language = language
    this.regexps = regexps
  }

  /**
   * Get the contents for a configuration.
   */
  protected async scrapeConfig(config: ScraperProviderConfig): Promise<void> {
    try {
      // Set the config
      this.setConfig(config)

      const totalPages = await this.getTotalPages()

      if (!totalPages) {
        return this.logger.error(
          `getTotalPages returned: '${totalPages}'`
        )
      }

      this.logger.log(`Total pages ${totalPages}`)

      const torrents = await this.getAllTorrents(totalPages)
      const allContent = await this.getAllContent(torrents)

      this.logger.log(`Total content ${allContent.length}`)

      await pMap(
        allContent,
        async (content) => {
          const isInBlacklist = await this.isItemBlackListed(content)

          // Only get data for this item if it's not in the blacklist
          if (!isInBlacklist) {
            try {
              await this.enhanceAndImport(content)

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
    } catch (err) {
      this.logger.error(`Catch BaseProvider.scrapeConfig: ${err.message || err}`)
    }
  }

  // /**
  //  * Gets information about a show from Trakt.tv and insert the show into the
  //  * MongoDB database.
  //  * @protected
  //  * @param {!Object} content - The show information.
  //  * @returns {Promise<Object | Error>} - A show object.
  //  */
  // _getShowContent(content: object): Promise<object> {
  //   const { episodes, slug } = content
  //
  //   if (!episodes || episodes.length === 0) {
  //     return logger.warn(
  //       `${this.name}: '${slug}' has no torrents`
  //     )
  //   }
  //
  //   return this.helper.getTraktInfo(content).then((res) => {
  //     if (res && res.imdbId) {
  //       return this.helper.addEpisodes(res, episodes, slug)
  //     }
  //   })
  // }

  /**
   * Checks if the item is blacklisted, if so we skip it until the blacklist expires
   * @param content - The content information.
   * @returns {Promise<Boolean|Error>}
   */
  private async isItemBlackListed(content: ScrapedItem): Promise<boolean | Error> {
    const { slug, imdb } = content

    const blacklistedItem = await this.blackListModel.findOne({ _id: imdb || slug })

    if (blacklistedItem) {
      if (blacklistedItem.get('expires') > Date.now()) {
        const expires = new Date(blacklistedItem.get('expires'))

        this.logger.warn(
          `'${imdb || slug}' is in the blacklist until '${expires}' because of reason '${blacklistedItem.get('reason')}', skipping...`
        )

        return true

      } else {
        // Item is expired delete it
        blacklistedItem.deleteOne()
      }
    }

    return false
  }

  /**
   * Enhances the item with info from Trakt.tv / TMDB / OMDB / Fanart etc and inserts
   * it into the MongoDB database.
   */
  protected async enhanceAndImport(item: ScrapedItem): Promise<void> {
    let helper: BaseHelper = null
    if (this.contentType === MovieType) {
      helper = this.movieHelper

    } else if (this.contentType === ShowType) {
      // helper = this.showHelper
    }

    if (!helper) {
      return Promise.reject(new Error(`'${this.contentType}' is not a valid value for ContentTypes!`))
    }

    const existingItem = await helper.getItem(item.imdb, item.slug)
    const updateExistingItem = existingItem && helper.shouldUpdateExistingItem(existingItem)

    let newItem
    if (updateExistingItem) {
      newItem = await helper.updateTraktInfo(existingItem)

    } else {
      newItem = await helper.addTraktInfo(item)
    }

    let used = process.memoryUsage()
    for (let key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
    }

    // If Trakt could not find the item then add it to the blacklist
    if (!newItem) {
      // Try again in 1 week
      await helper.addToBlacklist(
        item,
        this.contentType,
        '404',
        1
      )

      return Promise.resolve()
    }

    // Only add images if should we don't have a existing item or
    // we need to update it
    if (!existingItem || updateExistingItem) {
      newItem = await helper.addImages(newItem)
    }

    newItem = await helper.addTorrents(newItem, item.torrents)

    if (!existingItem) {
      await helper.addItemToDatabase(newItem)

    } else {
      await helper.updateItemInDatabase(newItem)
    }

    return Promise.resolve()
  }

  /**
   * Extract content information based on a regex.
   */
  abstract extractContent({ torrent, regex, lang }): ScrapedItem | undefined

  /**
   * Get content info from a given torrent.
   */
  protected getContentData(torrent: any): ScrapedItem | undefined {
    const regex = this.regexps.find(
      r => r.regex.test(torrent.title)
        || r.regex.test(torrent.name)
        || r.regex.test(torrent.filename)
    )

    if (regex) {
      return this.extractContent({
        torrent,
        regex,
        lang: this.language
      })
    }

    this.logger.warn(`Could not extract data from torrent: '${torrent.title}'`)
  }

  /**
   * Put all the found content from the torrents in an array.
   */
  protected getAllContent(torrents: any): Promise<Array<ScrapedItem>> {
    const items = new Map()

    return pMap(torrents, (torrent) => {
      if (!torrent) {
        return
      }

      const item = this.getContentData(torrent)

      if (!item) {
        return
      }

      const { slug } = item

      // If we already have the movie merge the torrents together
      if (items.has(slug)) {
        // Reset the movies torrents
        item.torrents = formatTorrents(
          items.get(slug).torrents,
          item.torrents
        )
      }

      return items.set(slug, item)
    }, {
      concurrency: 1
    }).then(() => Array.from(items.values()))
  }

  /**
   * Get's the torrents for one page
   * @param {!number} page - The page number to get
   * @param {boolean} retry - If we are allowed to retry when a error happens
   * @returns {Promise<*|[]|undefined>}
   */
  private async getOnePage(page: number, retry = true) {
    this.query.page = page

    try {
      const res = await this.api.search(this.query)

      return res.results
        ? res.results // Kat & ET
        : res.data
          ? res.data.movies // YTS
          : []

    } catch (e) {
      // If we are allowed to retry then do else throw the error
      if (retry) {
        this.logger.warn(`On page ${page} "${e}", going to retry.`)
        return this.getOnePage(page, false)

      } else {
        this.logger.error(`On page ${page} "${e}"`)
        throw e
      }
    }
  }

  /**
   * Get all the torrents of a given torrent provider.
   * @protected
   * @param {!number} totalPages - The total pages of the query.
   * @returns {Promise<Array<Object>>} - A list of all the queried torrents.
   */
  getAllTorrents(totalPages: number): Promise<Array<any>> {
    let torrents = []

    return pTimes(totalPages, async (page) => {
      this.logger.debug(`Started searching ${this.name} on page ${page + 1} out of ${totalPages}`)

      // Get the page
      const data = await this.getOnePage(page + 1)

      // Add it to the torrent collection
      torrents = torrents.concat(data)

    }, {
      concurrency: 1,
      stopOnError: false
    }).then(() => {
      this.logger.log(`Found ${torrents.length} torrents.`)

      return Promise.resolve(torrents)
    }).catch((err) => {
      // Only log the errors
      this.logger.error(`Catch BaseProvider.getAllTorrents: ${err.message || err}`)

      // We still want to resolve all the pages that did go well
      return Promise.resolve(torrents)
    })
  }

  /**
   * Get the total pages to scrape for the provider query.
   * @protected
   * @returns {Promise<number>} - The number of total pages to scrape.
   */
  protected async getTotalPages(): Promise<number> {
    this.logger.debug('Getting total pages')

    const result = await this.api.search(this.query)

    if (result.data) { // Yts
      return Math.ceil(result.data.movie_count / (this.query?.limit ?? 50))

    } else if (result.total_pages) { // eztv
      return result.total_pages
    }

    return result.totalPages
  }

  // async scrapedConfigs(scraped) {
  //   try {
  //     if (this.contentType === BaseProvider.ContentTypes.Show) {
  //       // TODO:: Do post call to the GraphQL api to check and start downloading new my episodes
  //       logger.info(`Calling GraphQL to update my episodes`)
  //
  //     } else if (this.contentType === BaseProvider.ContentTypes.Movie) {
  //       // TODO:: Do post call to the GraphQL api to check and start downloading better qualities
  //       logger.info(`Calling GraphQL to qualities of downloaded movies`)
  //     }
  //   } catch (e) {
  //
  //   }
  //
  //   return scraped
  // }
}