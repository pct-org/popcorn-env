export interface TraktMovie {

  ids: {
    imdb: string

    tmdb: number

    slug: string

    trakt: number
  }

  title: string

  year: number

  tagline: string

  overview: string

  released: string

  runtime: number

  country: string

  trailer: string

  homepage: string

  status: string

  rating: number

  votes: number

  comment_count: number

  updated_at: string

  language: string

  genres: string[]

  certification: string
}
