import { TmdbEpisode } from './tmdb.episode.interface'

export interface TmdbSeason {

  _id: string

  id: number

  airDate: string

  name: string

  overview: string

  posterPath: string

  seasonNumber: number

  episodes: TmdbEpisode[]

}
