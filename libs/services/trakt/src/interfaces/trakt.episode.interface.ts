export interface TraktEpisode {

  ids: {
    trakt: number

    tvdb: number

    imdb: string

    tmdb: number

    tvrage: number
  },

  season: number

  number: number

  title: string

  number_abs: number

  overview: string

  rating: number

  votes: number

  comment_count: number

  first_aired: string

  updated_at: string

  available_translations: string[]

  runtime: number

}
