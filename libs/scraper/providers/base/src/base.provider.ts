import * as pMap from 'p-map'
import * as pTimes from 'p-times'
import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BlacklistModel } from '@pct-org/mongo-models'
import { formatTorrents } from '@pct-org/torrent/utils'
import { MovieHelperService } from '@pct-org/scraper/helpers/movie'
import { ShowHelperService } from '@pct-org/scraper/helpers/show'
import { BaseHelper } from '@pct-org/scraper/helpers/base'

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

  protected readonly movieHelper: MovieHelperService | undefined

  protected readonly showHelper: ShowHelperService | undefined

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
  protected setConfig({ query, contentType, regexps = [], language = 'en' }: ScraperProviderConfig): void {
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

              this.logger.error(`BaseProvider.scrapeConfig: ${errorMessage}`, err.stack)

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
      this.logger.error(`Catch BaseProvider.scrapeConfig: ${err.message || err}`, err.stack)
    }
  }

  /**
   * Checks if the item is blacklisted, if so we skip it until the blacklist expires
   * @param content - The content information.
   * @returns {Promise<Boolean|Error>}
   */
  protected async isItemBlackListed(content: ScrapedItem): Promise<boolean | Error> {
    const { slug, imdb } = content

    const blacklistedItem = await this.blackListModel.findOne({
      $or: [
        { _id: imdb },
        { _id: slug }
      ]
    })

    if (blacklistedItem) {
      if (blacklistedItem.get('expires') > Date.now()) {
        const expires = new Date(blacklistedItem.get('expires'))

        this.logger.debug(
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
    if (this.contentType === MovieType && this.movieHelper) {
      helper = this.movieHelper

    } else if (this.contentType === ShowType && this.showHelper) {
      helper = this.showHelper
    }

    if (!helper) {
      return Promise.reject(new Error(`'${this.contentType}' is not a valid value for ContentTypes!`))
    }

    // Double check if the item has torrents
    if (!item.torrents || item.torrents.length === 0) {
      this.logger.warn(`'${item.slug}' has no torrents`)

      return Promise.resolve()
    }

    const existingItem = await helper.getItem(item.imdb, item.slug)
    const updateExistingItem = existingItem && helper.shouldUpdateExistingItem(existingItem)

    let newItem
    // Check if we have a existing item
    if (existingItem) {
      // Only update the item if we need to
      if (updateExistingItem) {
        newItem = await helper.updateTraktInfo(existingItem)

      } else {
        // Use existing item
        newItem = existingItem
      }

    } else {
      // Add trakt info to the item, will return null if trakt could not find it
      newItem = await helper.addTraktInfo(item)
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

    // Add the torrents to the item
    newItem = await helper.addTorrents(newItem, item.torrents)

    if (!existingItem) {
      await helper.addItemToDatabase(newItem)

    } else {
      await helper.updateItemInDatabase(newItem, updateExistingItem)
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

    } catch (err) {
      // If we are allowed to retry then do else throw the error
      if (retry) {
        this.logger.warn(`On page ${page} "${err}", going to retry.`)

        return this.getOnePage(page, false)

      } else {
        this.logger.error(`On page ${page} "${err}"`)

        throw err
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

}
