// @ts-nocheck
const bytes = require('bytes')
const cheerio = require('cheerio')
const debug = require('debug')
const got = require('got')
const { stringify } = require('querystring')

const { name } = require('./package')

/**
 * @typedef {Object} Response
 * @property {Date} response_time The response_time of the response.
 * @property {number} page The page of the response.
 * @property {number} total_results The total_results of the response.
 * @property {number} total_pages The total_pages of the response.
 * @property {Array<Torrent>} results The results of the response.
 */

/**
 * The model of the torrent object
 * @typedef {Object} Torrent
 * @property {string} title The title of the torrent.
 * @property {string} category The category of the torrent.
 * @property {string} link The link of the torrent.
 * @property {boolean} verified The verified of the torrent.
 * @property {number} comments The comments of the torrent.
 * @property {string} torrentLink The torrentLink of the torrent.
 * @property {string} fileSize The fileSize of the torrent.
 * @property {number} size The size of the torrent.
 * @property {number} seeds The seeds of the torrent.
 * @property {number} leechs The leechs of the torrent.
 * @property {number} peers The peers of the torrent.
 */

/**
 * A KickassTorrents API wrapper.
 * @type {KatApi}
 */
module.exports = class KatApi {

  /**
   * Create a new instance of the module.
   * @param {!Object} config={} - The configuration object for the module.
   * @param {!string} baseUrl=https://katcr.co/ - The base url of katcr.
   * @type {String}
   */
  constructor({ baseUrl = 'https://katcr.co/' } = {}) {
    /**
     * The base url of katcr.
     * @type {string}
     */
    this._baseUrl = baseUrl
    /**
     * Show extra output.
     * @type {Function}
     */
    this._debug = debug(name)
    /**
     * The available categories to search for.
     * @type {Object}
     */
    this._category = {
      movies: 'movies',
      tv: 'tv',
    }
    this._subcate = {
      hd: 'hd',
      ultrahd: 'ultrahd',
    }
    /**
     * The available languages to search for.
     * @type {Object}
     */
    this._lang = {
      all: 0,
      english: 1,
      bengali: 10,
      chinese: 11,
      dutch: 12,
      french: 2,
      german: 3,
      greek: 13,
      hindi: 9,
      italian: 4,
      japanese: 14,
      korean: 15,
      russian: 7,
      spanish: 6,
      tamil: 16,
      telegu: 17,
      turkish: 18,
      unknown: 8,
    }
    /**
     * The available ways to sort the results by.
     * @type {Object}
     */
    this._sort = {
      id: 'id',
      name: 'name',
      comments: 'comments',
      size: 'size',
      completed: 'times_completed',
      seeders: 'seeders',
      leechers: 'leechers',
    }
    /**
     * The available ways to order the results by.
     * @type {Object}
     */
    this._order = {
      asc: 'asc',
      desc: 'desc',
    }
  }

  /**
   * Make a get request to kat.co.
   * @param {!string} endpoint - The endpoint to make the request to.
   * @param {?Object} query - The query parameters of the HTTP request.
   * @returns {Promise<Function, Error>} - The response body wrapped in
   * cheerio.
   */
  _get(endpoint, query) {
    const uri = `${this._baseUrl}${endpoint}`
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        cookie: 'katsearch=',
      },
      query,
    }

    this._debug(`Making request to: '${uri}?${stringify(query)}'`)
    return got.get(uri, opts)
      .then(({ body }) => cheerio.load(body))
    // .then(({ body }) => body)
  }

  /**
   * Format the result page in the response object.
   * @param {!Object} $ - The cheerio loaded body.
   * @param {!number} page - The page of the torrent to find.
   * @param {!Object} filters - Filters filter the torrents on
   * @param {!Date} date - The date the query was started.
   * @returns {Response} - The response of a query.
   */
  _formatPage($, page, filters, date) {
    const data = $('a.button.button--gray').last().text()
    const hasNext = data.toLowerCase() === 'next'
    const findLimit = $('.row .justify-content-between').first().text().match(/([0-9]+ limit [0-9][,]?[0-9]+)/)

    const limitText = findLimit.shift()
    let totalPages = null

    if (limitText) {
      const limitParts = limitText.split(' ')
      const pageSize = parseInt(limitParts.shift(), 10)
      const totalItems = parseInt(limitParts.reverse().shift().replace(',', ''), 10)

      totalPages = parseInt(`${totalItems / pageSize}`, 10)
    }

    const result = {
      responseTime: date,
      totalPages,
      page,
      hasNext,
    }

    // TODO:: Make it possible to filter on these
    const { verified, language } = filters

    const self = this
    result.results = $('table.torrents_table')
      .children('tbody')
      .find('tr')
      .map(function() {
        const entry = $(this)

        const title = entry.find('a.torrents_table__torrent_title > b').text()
        const link = entry.find('a.torrents_table__torrent_title').attr('href')

        const category = entry.find('span.torrents_table__upload_info')
          .find('a > strong')
          .last()
          .text()

        const torrentVerified = entry.find('i.kf__crown').length > 0

        const comments = parseInt(
          entry.find('a.button.button--small[title="Comments"]').text(), 10,
        )

        const torrentLink = entry
          .find('a.button.button--small[title="Torrent magnet link"]')
          .attr('href')

        const fileSize = entry.find('td.text--nowrap.text--center')
          .eq(0)
          .text()
        const size = bytes(fileSize)

        const seeds = parseInt(
          entry.find('td.text--nowrap.text--center.text--success').eq(0).text(),
          10,
        )

        const leechs = parseInt(
          entry.find('td.text--nowrap.text--center.text--error').eq(0).text(),
          10,
        )
        const peers = seeds + leechs

        if (verified && !torrentVerified) {
          return false
        }

        return {
          title,
          category,
          link: `${self._baseUrl}/${link}`,
          verified: torrentVerified,
          comments,
          torrentLink,
          fileSize,
          size,
          seeds,
          leechs,
          peers,
        }
      })
      .filter(Boolean)
      .get()

    return result
  }

  /**
   * Make an advanced search.
   * @param {!Object} config - The config of the advanced query object.
   * @param {!string} [config.category] - The category of the torrents to find.
   * @param {!string} [config.subcate] - The sub category of the torrents to find.
   * @param {?number} [config.page=1] - The page of the torrent to find.
   * @param {?number} [config.verified] - Should the torrent be verified.
   * @param {?number} [config.language] - The language of the torrents to find.
   * @param {!Date} date - The date the query was started.
   * @returns {Promise<Resonse, Error>} - The response of an advanced search.
   */
  _getData({
    category,
    subcate = null,
    page = 1,
    verified,
    language,
  }, date) {
    let err
    if (category && !this._category[category]) {
      err = new Error(`'${category}' is not a valid value for category`)
    }

    if (subcate && !this._subcate[subcate]) {
      err = new Error(`'${subcate}' is not a valid value for subcate`)
    }

    if (err) {
      return Promise.reject(err)
    }

    const cat = this._category[category]
    const sbcate = subcate ? `/subcate/${this._subcate[subcate]}` : null

    return this._get(`category/${cat}${sbcate}/page/${page}`)
      .then(res => this._formatPage(
        res,
        page,
        {
          verified,
          language,
        },
        Date.now() - date),
      )

    /* return this._get(`katsearch/page/${page}/${query}`, {
     cat,
     lang,
     sort,
     order
     }).then(res => this._formatPage(res, page, Date.now() - date))*/
  }

  /**
   * Search for content on katcr.co.
   * @param {Object|string} query - Object for advanced search, string for
   * simple search.
   * @returns {Promise<Response, Error>} - The response object of the query.
   */
  search(query) {
    this.lastRequestTime = Date.now()

    if (typeof query === 'string') {
      return this._getData({ query }, this.lastRequestTime)

    } else if (typeof query === 'object') {
      return this._getData(query, this.lastRequestTime)
    }

    const err = new Error('search needs an object or string as a parameter!')
    return Promise.reject(err)
  }

}
