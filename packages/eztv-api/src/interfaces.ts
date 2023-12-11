export interface Show {
  title: string

  id: number

  slug: string
}

export interface Torrent {
  title: string
  url: string
  seeds: number
  peers: 0
  provider: string
  size: number
  quality: string
}

export interface ShowWithEpisodes extends Show {
  imdb: string

  torrents: {
    [season: number]: {
      [episode: number]: Torrent[]
    }
  }
}
