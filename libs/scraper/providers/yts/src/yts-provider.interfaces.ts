export interface YtsTorrent {

  title: string

  imdb_code: string

  year: string

  language: string

  torrents: [{
    hash: string

    peers: number

    quality: string

    seeds: number

    size_bytes: number
  }]

}
