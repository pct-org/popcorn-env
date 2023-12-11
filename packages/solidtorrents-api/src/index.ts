// @ts-nocheck
const bytes = require('bytes')
const debug = require('debug')
const got = require('got') // TODO:: Change to axios
const { stringify } = require('querystring')

const { name } = require('../package')

/**
 * A SolidTorrents API wrapper.
 * @type {SolidTorrentsApi}
 */
module.exports = class SolidTorrentsApi {

  /**
   * Create a new instance of the module.
   * @param {!Object} config={} - The configuration object for the module.
   * @param {!string} baseUrl=https://katcr.co/ - The base url of katcr.
   * @type {String}
   */
  constructor({ baseUrl = 'https://solidtorrents.net/api/v1/' } = {}) {
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
      video: 'Video',
    }

    /**
     * The available ways to sort the results by.
     * @type {Object}
     */
    this._sort = {
      seeders: 'seeders',
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
      },
      query,
    }

    this._debug(`Making request to: '${uri}?${stringify(query)}'`)
    return got.get(uri, opts)
      .then(({ body }) => JSON.parse(body))
  }

  /**
   * Format the result page in the response object.
   */
  _formatResponse(response, page, { verified = true }, date) {
    return {
      responseTime: date,
      totalPages: parseInt(response.hits.value / 20, 10), // 20 is their page limit
      page,
      results: response.results.map((torrent) => {
        if (!torrent.swarm.verified && verified) {
          return false
        }

        return {
          _id: torrent._id,
          title: torrent.title,
          category: torrent.category,
          magnet: torrent.magnet,
          fileSize: torrent.size,
          size: torrent.size,
          ...torrent.swarm,
        }
      }).filter(Boolean),
    }
  }

  /**
   * Make an advanced search.
   */
  _getData({
    category,
    page = 1,
    query,
    verified = null,
    language,
  }, date) {
    let err
    if (category && !this._category[category]) {
      err = new Error(`'${category}' is not a valid value for category`)
    }

    if (err) {
      return Promise.reject(err)
    }

    const args = {
      fuv: verified === null || verified ? 'yes' : 'no',
      q: query,
      sort: 'seeders',
    }

    if (category) {
      args.category = this._category[category]
    }

    if (page > 1) {
      args.skip = (page - 1) * 20
    }

    return this._get('search', args)
      .then(res => this._formatResponse(
        res,
        page,
        { verified },
        Date.now() - date,
        ),
      )

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
