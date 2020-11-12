import { Torrents } from './torrents.interface'

export interface ShowClean {

  _id: string
  imdb_id: string
  tvdb_id: string
  title: string
  year: string
  slug: string
  num_seasons: number

  images: {
    poster: string
    fanart: string
    banner: string
  },

  rating: {
    percentage: number
    watching: number
    votes: number
    loved: number
    hated: number
  }

}

export interface Show extends ShowClean {

  synopsis: string
  runtime: string
  country: string
  network: string
  air_day: string
  air_time: string
  status: string
  last_updated: number
  genres: string[]

  episodes: ShowEpisode[]
}

export interface ShowEpisode {

  torrents: Torrents

  watched: {
    watched: boolean
  }

  first_aired: number
  date_based: false
  overview: string
  title: string
  episode: number
  season: number
  tvdb_id: number

}
