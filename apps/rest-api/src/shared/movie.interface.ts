import { Torrents } from './torrents.interface'

export interface Movie {

  _id: string
  imdb_id: string
  title: string
  year: string
  synopsis: string
  runtime: string
  released: number
  trailer: string
  certification: string
  torrents: {
    en: Torrents
  }
  genres: string[]

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
