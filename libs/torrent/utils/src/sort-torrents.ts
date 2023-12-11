import type { Torrent } from '@pct-org/types/shared'

// The order that we want it in
const order = ['2160p', '3D', '1080p', '1080p-bl', '720p', '720p-ish', '480p']

export const sortTorrents = (torrents: Torrent[]): Torrent[] => {
  // Return all merged torrents
  return torrents.sort(
    (torrentA, torrentB) =>
      order.indexOf(torrentA.quality) - order.indexOf(torrentB.quality)
  )
}
