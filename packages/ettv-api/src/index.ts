import debug from 'debug'
import https from 'https'
import { createGunzip } from 'zlib'
import { URL, URLSearchParams } from 'url'

import { name } from '../package.json'

export interface Torrent {
  hash: string

  magnet: string

  title: string

  category: string

  link: string
}

export class EttvApi {
  /**
   * The base url of ettv.
   */
  private readonly baseUrl: string

  /**
   * The default trackers to use for the hash.
   */
  private readonly trackers = [
    'udp%3A%2F%2Ftracker.coppersurfer.tk:6969/announce&',
    'udp%3A%2F%2F9.rarbg.to:2710/announce&',
    'udp%3A%2F%2F9.rarbg.me:2710/announce&',
    'udp%3A%2F%2FIPv6.open-internet.nl:6969/announce&',
    'udp%3A%2F%2Ftracker.internetwarriors.net:1337/announce&',
    'udp%3A%2F%2Ftracker.opentrackr.org:1337/announce&',
    'udp%3A%2F%2Fp4p.arenabg.com:1337/announce&',
    'udp%3A%2F%2Feddie4.nl:6969/announce&',
    'udp%3A%2F%2Fshadowshq.yi.org:6969/announce&',
    'udp%3A%2F%2Ftracker.leechers-paradise.org:6969/announce&',
    'udp%3A%2F%2Fexplodie.org:6969/announce&',
    'udp%3A%2F%2Ftracker.tiny-vps.com:6969/announce&',
    'udp%3A%2F%2Finferno.demonoid.pw:3391/announce&',
    'udp%3A%2F%2Fipv4.tracker.harry.lu:80/announce&',
    'udp%3A%2F%2Fpeerfect.org:6969/announce&',
    'udp%3A%2F%2Ftracker.pirateparty.gr:6969/announce&',
    'udp%3A%2F%2Ftracker.vanitycore.co:6969/announce&',
    'udp%3A%2F%2Fopen.stealth.si:80/announce&',
    'udp%3A%2F%2Ftracker.torrent.eu.org:451&',
    'udp%3A%2F%2Ftracker.zer0day.to:1337/announce&',
    'udp%3A%2F%2Ftracker.open-internet.nl:6969/announce'
  ]

  private readonly debug = debug(name)

  /**
   * Create a new instance of the module.
   * @param {!Object} [options={}] - The options for the module.
   * @param {!string} [options.baseUrl=https://www.ettv.tv/] - The base url of
   * ettv.tv
   * @param {!Array<string>} [options.trackers=exprts.defaultTrackers] - A list
   * of trackers to add to the hahs of the torrents.
   */
  constructor({ baseUrl = 'https://www.ettv.to/', trackers = null } = {}) {
    this.baseUrl = baseUrl

    if (trackers) {
      this.trackers = trackers
    }
  }

  /**
   * Make a GET request to ettv.tv.
   */
  private get(endpoint: string): Promise<string | Error> {
    return new Promise((resolve, reject) => {
      this.debug(`Making GET request to: '${endpoint}'`)

      return https.get(
        endpoint,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Linux) AppleWebkit/534.30 (KHTML, like Gecko) PT/3.8.0'
          }
        },
        (res) => {
          let data = ''

          res
            .pipe(createGunzip())
            .on('error', reject)
            .on('data', (chunk) => {
              data += chunk
            })
            .on('end', () => resolve(data))
        }
      )
    })
  }

  /**
   * Convert one chunk line to a more accessable JSON object.
   * @param {!Array<string>} chunk - The chunk to convert to an object.
   * @returns {Torrent} - The chunk converted to a torrent object.
   */
  private convertChunk(chunk): Torrent {
    const line = chunk.split('|')
    const headers = ['hash', 'title', 'category', 'link']
    const torrent = headers.reduce((acc, curr, i) => {
      acc[curr] = line[i]
      return acc
    }, {}) as Torrent

    const qs = new URLSearchParams({
      xt: `urn:btih:${torrent.hash}`,
      dn: torrent.title,
      tr: this.trackers
    })

    torrent.magnet = `$magnet:?${qs}`

    return torrent
  }

  /**
   * Convert the database dump from ettv.tv to an array with Torrent objects.
   */
  protected convertToTorrents(res: string): Torrent[] {
    return res
      .split('\n')
      .filter((line) => line !== '')
      .map(this.convertChunk)
  }

  /**
   * Filters the torrents to only return the allowed categories
   */
  protected filterCategories(
    torrents: Torrent[],
    categories: string[]
  ): Torrent[] {
    // If no categories provided return everything
    if (categories.length === 0) {
      return torrents
    }

    return torrents.filter(
      (torrent) => categories.indexOf(torrent.category) > -1
    )
  }

  /**
   * Get the database dump file from ettv.tv and convert it to an array of
   * Torrent object.
   */
  protected getFile(file, categories: string[]) {
    const { href } = new URL(`dumps/ettv_${file}.txt.gz`, this.baseUrl)

    return this.get(href)
      .then(this.convertToTorrents)
      .then((torrents) => this.filterCategories(torrents, categories))
  }

  /**
   * Get the daily database dump from ettv.tv.
   * @returns {Promise<Array<Torrent>, Error>} - The torrents from the database
   * dump.
   */
  getDaily(categories = []) {
    return this.getFile('daily', categories)
  }

  /**
   * Get the full database dump from ettv.tv.
   * @returns {Promise<Array<Torrent>, Error>} - The torrents from the database
   * dump.
   */
  getFull(categories = []) {
    return this.getFile('full', categories)
  }
}
