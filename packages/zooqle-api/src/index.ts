// @ts-nocheck
import axios from 'axios'
import * as cheerio from 'cheerio'
import * as bytes from 'bytes'
import { URL, parse, Url } from 'url'

interface IsearchResults {
  filetype: string
  href: string
  title: string
  size: string
  seeders: number
  leechers: number
  magnet: string
  hash: string
  languages: string[]
  quality: string
}

interface IsearchResponse {
  searchResults: IsearchResults[]
  search: string
  pageSize: number
  total: number
}

interface IshowEpisodes {
  episodeNumber: string
  episodeTitle: string
  dataHref: string
}

interface IshowSeasons {
  season: string
  date: string
  episodes: IshowEpisodes[]
}

interface IshowResponse {
  title: string
  from: string
  to: string
  summary: string
  imdb: string
  imdbId: string
  seasons: IshowSeasons[]
}

interface Iresponse {
  type: string
  searchResponse?: IsearchResponse
  showResponse?: IshowResponse
  movieResponse?: ImovieResponse
  torrentResponse?: Itorrent
}

interface Idata {
  title: string
  metaUrl: string
  sound: string
  language: string
  quality: string
  magnet: string
  hash: string
  size: string
  seeders: number
  leechers: number
}

interface ImovieResults {
  title: string
  torrentHref: string
  sound: string
  language: string
  quality: string
  size: string
  seeders: number
  leechers: number
}

interface ImovieResponse {
  title: string
  summary: string
  imdb: string
  imdbId: string
  release: string
  results: ImovieResults[]
}

interface Itorrent {
  filetype: string
  title: string
  imdb?: string
  imdbId: string
  source?: string
  sourceUrl?: string
  magnet: string
  hash: string
  size: string
  date: string
}

interface Iload {
  $: CheerioStatic
  url: string
}

interface Isort {
  seeders: string
  date: string
  size: string
}

interface IsortType {
  descending: string
  ascending: string
}

interface IassignUrl {
  (url: string): string
}

class Enums {
  public SORT: Isort = {
    seeders: 's=ns',
    date: 's=dt',
    size: 's=sz'
  }
  public SORT_TYPE: IsortType = {
    descending: 'sd=d',
    ascending: 'sd=a'
  }
}

class Common {
  public static async load(url: string): Promise<Iload> {
    const result = await axios.get(url)

    return {
      $: cheerio.load(result.data),
      url: result.request.path
    }
  }

  public static magnetToHash(magnet: string) {
    return magnet.match(/:([\w\d]{40})/)[1]
  }

  public static assignUrl(endpoint: string, source: string) {
    const url = new URL(endpoint)
    const href = parse(source)
    url.pathname = href.pathname
    url.search = href.search
    return url.href
  }

  public static parseSeeders(seedersStr: string) {

    if (seedersStr) {
      const seedersMatch = seedersStr.match(/\d+/g)
      if (seedersMatch) {
        return seedersMatch.map(x => Number(x))
      }
    }

    return [0, 0]
  }

  public static iconToType(icon: Cheerio): string {
    switch (true) {
      case icon.hasClass('zqf-movies'):
        return 'movie'

      case icon.hasClass('zqf-tv'):
        return 'show'

      case icon.hasClass('zqf-anime'):
        return 'anime'

      case icon.hasClass('zqf-game'):
        return 'game'

      case icon.hasClass('zqf-app'):
        return 'app'

      case icon.hasClass('zqf-music'):
        return 'music'

      case icon.hasClass('zqf-book'):
        return 'book'

      case icon.hasClass('zqf-files'):
        return 'other'

      default:
        return 'unknown'
    }
  }
}

class Parser {
  public static parseSearch($: CheerioStatic, categories: string[] = []) {
    let [, search, pageSize, total]: string[] | number[] = $('.panel.zq-panel.zq-small .panel-heading')
      .text().trim().match(/"(.+)"\n{2}.+-\n(\d+)\nof (\d+[,]?\d+)/)

    pageSize = parseInt(pageSize, 10)
    total = parseInt(total.replace(',', ''), 10)

    const htmlResults = $('table > tbody > tr')
    const searchResults: IsearchResults[] = []
    htmlResults.each((i) => {
      const e = htmlResults.eq(i)
      const a = e.find('td a')

      const title = a.text()
      const progress = e.find('.progress')
      const magnet = e.find('.spr.dl-magnet')
        .first().parent().attr('href')

      const size = progress.eq(0).text()

      const seedersStr = progress.eq(1).attr('title')
      const [seeders, leechers] = Common.parseSeeders(seedersStr)

      const languages = e.find('[title="Detected languages"]').text()
      const [quality] = title.match(/\d{3,4}p/) || ['Str']

      const iconElement = $('.zqf.text-muted2.zqf-small.pad-r2').eq(i)
      const filetype = Common.iconToType(iconElement)

      // Only add it if it's a allowed category
      if (categories.length === 0 || categories.indexOf(filetype) > -1) {
        if (categories.length === 0
          || categories.indexOf('XXX') !== -1
          || title.indexOf('XXX') === -1
          || title.toLowerCase().indexOf('porn') === -1
        ) {
          // XXX is not in the categories so if the title contains it don't add it
          searchResults.push({
            filetype,
            href: a.attr('href'),
            title,
            languages: languages.split(','),
            quality,
            size: bytes(size),
            seeders,
            leechers,
            magnet,
            hash: Common.magnetToHash(magnet)
          })
        }
      }
    })

    const searchResponse: IsearchResponse = {
      searchResults,
      search,
      pageSize,
      total
    }

    const response: Iresponse = {
      type: 'search',
      searchResponse
    }

    return response
  }

  public static parseShow($: CheerioStatic, loadData?: boolean) {
    const title = $('td.h4.sh1').text()
    const [from, to] = $('.sh2 i').text().split('→').map(x => x.trim())
    const summary = $('td.small.text-muted.sh2').text()
    const imdb = $('.imdb_stars').attr('href')
    const [imdbId] = imdb.match(/\btt\d{7}\b/) || [null]

    let seasons: IshowSeasons[] = []
    const seasonsElement = $('.panel.panel-default.eplist')
    seasonsElement.each(i => {
      const seasonTitleElement = seasonsElement.eq(i).find('.panel-heading.text-nowrap').children()

      const season = seasonTitleElement.eq(0).text()
      const date = seasonTitleElement.eq(1).text()

      const episodes: IshowEpisodes[] = []
      const episodesListElement = seasonsElement.eq(i).find('ul.list-group.eplist').find('.list-group-item')

      episodesListElement.each(ei => {
        const episodeNumber = episodesListElement.eq(ei).find('span.smaller.text-muted.epnum').text()
        const episodeTitle = episodesListElement.eq(ei).find('a.pad-r2').text()
        const dataHref = episodesListElement.eq(ei).find('.collapse.epdiv').attr('data-href')

        episodes.push({
          episodeNumber,
          episodeTitle,
          dataHref
        })
      })

      seasons.push({
        season,
        date,
        episodes
      })
    })

    const showResponse: IshowResponse = {
      title,
      from,
      to,
      summary,
      imdb,
      imdbId,
      seasons
    }

    const response: Iresponse = {
      type: 'show',
      showResponse
    }

    return response
  }

  public static parseMovie($: CheerioStatic) {
    const moviesElement = $('td.text-nowrap.text-trunc')

    const title = $('h4.margin-top-10').text().trim()
    const summary = $('h4.margin-top-10').parent().find('p.small.text-muted').text().trim()
    const release = $('h4.margin-top-10').parent().find('h5.small.text-muted').text().trim().replace('Released • ', '')
    const imdb = $('.imdb_stars').attr('href')
    const [imdbId] = imdb.match(/\btt\d{7}\b/) || [null]

    let results: ImovieResults[] = []

    moviesElement.each(i => {
      const title = moviesElement.eq(i).find('a').text()
      const torrentHref = moviesElement.eq(i).find('a').attr('href')
      const sound = moviesElement.eq(i).find('span').eq(0).text()
      const language = moviesElement.eq(i).find('span').eq(1).text()
      const [quality] = title.match(/\d{3,4}p/) || ['Str']
      const size = moviesElement.eq(i).parent().find('.progress-bar.prog-blue').text()
      const seedersStr = moviesElement.eq(i).parent()
        .find('.progress-bar.prog-green').parent().attr('title')
      const [seeders, leechers] = Common.parseSeeders(seedersStr)

      results.push({
        title,
        torrentHref,
        sound,
        language,
        quality,
        size,
        seeders,
        leechers
      })
    })

    const movieResponse: ImovieResponse = {
      title,
      summary,
      imdb,
      imdbId,
      release,
      results
    }

    const response: Iresponse = {
      type: 'movie',
      movieResponse
    }

    return response
  }

  public static parseData($: CheerioStatic) {
    const data: Idata[] = []
    const titleLinks = $('td.text-nowrap.text-trunc a')

    titleLinks.each(i => {
      const title = titleLinks.eq(i).text()
      const metaUrl = titleLinks.eq(i).attr('href')

      let sound = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(0).text()
      let language = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(1).text().trim()
      let quality = titleLinks.eq(i).parent().find('div.text-nowrap span').eq(2).text().trim()

      if (sound === '') sound = 'Str'
      if (language === '') language = 'Str'
      if (quality === '') [quality] = title.match(/\d{3,4}p/) || ['Str']

      const magnet = $('.spr.dl-magnet').eq(i).parent().attr('href')
      const hash = Common.magnetToHash(magnet)
      const size = $('.progress-bar.prog-blue.prog-l').eq(i).text()
      const seedersStr = $('.progress-bar.smaller.prog-l').eq(i).parent().attr('title')
      const [seeders, leechers] = Common.parseSeeders(seedersStr)

      data.push({
        title,
        metaUrl,
        sound,
        language,
        quality,
        magnet,
        hash,
        size,
        seeders,
        leechers
      })
    })

    return data
  }

  public static parseTorrent($: CheerioStatic) {
    const title = $('#torname').text().replace(/ /g, '.')
    const sourceElement = $(':contains("– Indexed from –")').last().next()
    const iconElement = $('.tor-icon')
    const filetype = Common.iconToType(iconElement)
    const imdb = $('.imdb_stars').attr('href')
    const [imdbId] = imdb.match(/\btt\d{7}\b/) || [null]

    let source = sourceElement.text().trim()
    if (source === '') {
      source = null
    }

    const sourceUrl = sourceElement.attr('href') || null

    const magnet = $('.dl-magnet').parent().attr('href')
    const hash = Common.magnetToHash(magnet)

    const [size, date] = $('.zqf-files').last().parent()
      .contents().toArray().filter((x: any) => x.type === 'text')
      .map(x => x.data.trim())

    const torrent: Itorrent = {
      filetype,
      title,
      imdb,
      imdbId,
      source,
      sourceUrl,
      magnet,
      hash,
      size,
      date
    }

    return torrent
  }
}

export class Zooqle {

  lastRequest = null

  constructor() {
    this._assignUrl = Common.assignUrl.bind(null, this.endPoint)
  }

  private _endpoint = new URL('https://zooqle.com')
  private _assignUrl: IassignUrl

  public enums = new Enums()

  public get endPoint() {
    return this._endpoint.href
  }

  public set endPoint(url: string) {
    this._endpoint.host = url
  }

  public async search(query: string, parameters: string[] = [], categories: string[] = []) {
    return new Promise<Iresponse>((resolve, reject) => {
      const thisRequest = Date.now()
      let timeout = 0

      if (!this.lastRequest) {
        this.lastRequest = Date.now()
      }

      if ((this.lastRequest + 1000) > thisRequest) {
        timeout = (this.lastRequest + 1100) - thisRequest
      }

      // There is a 1 req a sec rate limit, let's not hit it
      setTimeout(() => {
        const url = new URL('https://zooqle.com')
        url.pathname = '/search'
        url.searchParams.append('q', query)

        parameters.forEach(param => {
          const [key, val] = param.split('=')
          url.searchParams.append(key, val)
        })

        Common.load(url.href)
          .then(res => {
            this.lastRequest = Date.now()

            switch (true) {
              case /\/tv\//.test(res.url):
                return resolve(Parser.parseShow(res.$)) // handle tv
              case /\/movie\//.test(res.url):
                return resolve(Parser.parseMovie(res.$)) // handle movie
              case /\/search/.test(res.url):
                return resolve(Parser.parseSearch(res.$, categories)) // handle search
              default:
                const torrentResponse = Parser.parseTorrent(res.$) // handle direct torrent
                const response: Iresponse = {
                  type: 'torrent',
                  torrentResponse
                }

                return resolve(response)
            }
          })
          .catch(reject)

      }, timeout)
    })
  }

  public async getData(dataHref: string) {
    return new Promise<Idata[]>((resolve, reject) => {
      const url = this._assignUrl(dataHref)
      Common.load(url).then(res => {
        resolve(Parser.parseData(res.$))
      })
        .catch(console.error)
    })
  }

  public async getTorrentData(torrentHref: string) {
    return new Promise<Itorrent>((resolve, reject) => {
      const url = this._assignUrl(torrentHref)
      Common.load(url).then(res => {
        resolve(Parser.parseTorrent(res.$))
      })
        .catch(console.error)
    })
  }
}

export const zooqle = new Zooqle()
