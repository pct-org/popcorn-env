import { Torrent, TorrentFile } from 'webtorrent'

export interface TorrentInterface {

  _id: string

  torrent: Torrent

  file: TorrentFile

  resolve: () => void

}

export interface ConnectingTorrentInterface {

  _id: string

  magnet?: {
    url: string
  }

  resolve: () => void

}
