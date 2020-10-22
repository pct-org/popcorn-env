export const MovieType = 'movie'

export const ShowType = 'show'

export type ScraperContentType = 'movie' | 'show'

export interface ScraperProvider {

  name?: string

  maxWebRequests?: number

  configs: ScraperProviderConfig[]

}

export interface ScraperProviderConfigRegex {

  regex: RegExp

}

export interface ScraperProviderConfig {

  contentType: ScraperContentType

  query?: any,

  regexps?: ScraperProviderConfigRegex[]

  language?: string

}

export interface ScrapedTorrent {

  quality: string

  provider: string

  language: string

  size: number

  sizeString?: string

  seeds: number

  peers: number

  url: string

}

export interface ScrapedSeasonTorrent {

  [episode: number]: ScrapedTorrent[]
}

export interface ScrapedShowTorrent {

  [season: number]: ScrapedSeasonTorrent[]

}

export interface ScrapedItem<Torrents = ScrapedTorrent> {

  // eztv
  id?: number

  // eztv / yts
  title: string

  // eztv / yts
  slug: string

  // yts
  imdb?: string

  // yts
  year?: string

  // eztv / yts
  torrents?: Torrents[]

}
