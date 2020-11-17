export interface Show {

  title: string

  id: number

  slug: string

}

export interface ShowWithEpisodes extends Show {

  imdb: string

  episodes: {
    [season: number]: {
      [episode: number]: [{
        title: string
        url: string
        seeds: number
        peers: 0,
        provider: string
        size: number
        quality: string
      }]
    }
  }

}
