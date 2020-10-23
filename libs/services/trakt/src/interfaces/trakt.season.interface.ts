import { TraktEpisode } from './trakt.episode.interface'

export interface TraktSeason {

  ids: {
    trakt: number

    tvdb: number

    tmdb: number

    // tvrage: object
  }

  number: number

  rating: number

  votes: number

  episode_count: number

  aired_episodes: number

  title: string

  overview: string

  first_aired: string

  network: string

  episodes: TraktEpisode[]

}
