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

  title: string

  slug: string

  imdb?: string

  year?: string

  torrents: Torrents[]

}
