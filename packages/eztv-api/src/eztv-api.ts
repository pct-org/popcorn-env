import * as cheerio from 'cheerio'
import type { CheerioAPI } from 'cheerio'
import debug from 'debug'
import got from 'got'
import bytes from 'bytes'

import { name } from '../package.json'
import slugMap from './slug-map'
import imdbMap from './imdb-map'
import formatMap from './format-map'
import { Show, ShowWithEpisodes } from './interfaces'

/**
 * An EZTV API wrapper to get data from eztv.ag.
 * @type {EztvApi}
 */
export class EztvApi {
  /**
   * The base url of eztv.
   * @type {string}
   */
  private readonly baseUrl: string

  private debug = debug(name)

  /**
   * Create a new instance of the module.
   * @param {!Object} config={} - The configuration object for the module.
   * @param {!string} baseUrl=https://eztv.ag/ - The base url of eztv.
   */
  constructor({ baseUrl = 'https://eztv.re/' } = {}) {
    this.baseUrl = baseUrl
  }

  /**
   * Make a get request to eztv.ag.
   * @param {!string} endpoint - The endpoint to make the request to.
   * @param {?boolean} raw - Get the raw body of the response.
   * @returns {Promise<Function, Error>} - The response body wrapped in
   * cheerio.
   */
  private get(endpoint: string): Promise<CheerioAPI> {
    const uri = `${this.baseUrl}${endpoint}`

    this.debug(`Making request to: '${uri}'`)

    return got.get(uri).then(({ body }) => {
      return cheerio.load(body)
    })
  }

  /**
   * Get additional data from a show, like imdb codes and episodes.
   */
  private getEpisodeData(data, $): ShowWithEpisodes {
    let imdb = $('div[itemtype="http://schema.org/AggregateRating"]')
      .find('a[target="_blank"]')
      .attr('href')

    imdb = imdb ? imdb.match(/\/title\/(.*)\//)[1] : undefined
    imdb = imdb in imdbMap ? imdbMap[imdb] : imdb

    if (imdb) {
      data.imdb = imdb
    }

    const table = 'tr.forum_header_border[name="hover"]'
    $(table).each(function () {
      const entry = $(this)
      const magnet = entry
        .children('td')
        .eq(2)
        .children('a.magnet')
        .first()
        .attr('href')

      if (!magnet) {
        return
      }

      const seasonBased = /S?0*(\d+)[xE]0*(\d+)/i
      const dateBased = /(\d{4}).(\d{2}.\d{2})/i
      const title = entry.children('td').eq(1).text().replace('x264', '')
      let season
      let episode

      if (title.match(seasonBased)) {
        season = parseInt(title.match(seasonBased)[1], 10)
        episode = parseInt(title.match(seasonBased)[2], 10)
        data.dateBased = false
      } else if (title.match(dateBased)) {
        // If a item becomes data based check if the name of the show is in the
        // item this prevents wrongly mapped items to be added
        if (
          !data.dateBased &&
          !title.toLowerCase().includes(data.title.toLowerCase())
        ) {
          return
        }

        season = title.match(dateBased)[1]
        episode = title.match(dateBased)[2].replace(/\s/g, '-')
        data.dateBased = true
      } else {
        season = null
        episode = null
      }

      if (season !== null && episode !== null) {
        if (!data.torrents) {
          data.torrents = {}
        }

        if (!data.torrents[season]) {
          data.torrents[season] = {}
        }

        if (!data.torrents[season][episode]) {
          data.torrents[season][episode] = []
        }

        const quality = title.match(/(\d{3,4})p/)
          ? title.match(/(\d{3,4})p/)[0]
          : '480p'

        const seeds = parseInt(entry.children('td').last().text(), 10)

        const sizeText = entry.children('td').eq(3).text().toUpperCase()

        const size = bytes(sizeText.trim())

        data.torrents[season][episode].push({
          title,
          url: magnet,
          seeds: isNaN(seeds) ? 0 : seeds,
          peers: 0,
          provider: 'EZTV',
          size: isNaN(size) ? 0 : size,
          quality
        })
      }
    })

    return data
  }

  /**
   * Get all the available shows from eztv.
   */
  public async getAllShows(): Promise<Show[]> {
    const shows = await this.get('showlist/').then(($) => {
      const regex = /\/shows\/(.*)\/(.*)\//

      return $('.thread_link')
        .map(function () {
          const entry = $(this)
          const href = entry.attr('href')

          const title = entry.text()
          const id = parseInt(href.match(regex)[1], 10)

          let slug = href.match(regex)[2]
          slug = slug in slugMap ? slugMap[slug] : slug

          return {
            title,
            id,
            slug
          }
        })
        .get()
    })

    // Loop through all shows to see if they have a additional show in it
    shows.forEach((show) => {
      if (show.slug in formatMap) {
        shows.push(formatMap[show.slug].additionalShow)
      }
    })

    return shows
  }

  /**
   * Get episodes for a show.
   * @param {Show} data - Teh show to get episodes for.
   * @returns {Promise<Show, Error>} - The show with additional data.
   */
  public async getShowData(data: Show): Promise<ShowWithEpisodes> {
    let showId = data.id
    let showSlug = data.slug

    // Check if the slug is in the format map, if so get the original id and slug
    if (data.slug in formatMap) {
      showId = formatMap[showSlug].id
      showSlug = formatMap[showSlug].slug
    }

    const showData = await this.get(`shows/${showId}/${showSlug}/`).then(($) =>
      this.getEpisodeData(data, $)
    )

    // If the slug is inside the format map and has formatShow then return the formatted show
    if (data.slug in formatMap && formatMap[data.slug].formatShow) {
      return formatMap[showData.slug].formatShow(showData)
    }

    return showData
  }
}
