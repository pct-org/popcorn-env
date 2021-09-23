import type { ScrapedTorrent } from '@pct-org/scraper/providers/base'
import type { Torrent } from '@pct-org/types/shared'

import { formatBytes } from './format-bytes'
import { sortTorrents } from './sort-torrents'

export type Torrents = ScrapedTorrent[] | Torrent[]

export const formatTorrents = (torrents: Torrents, foundTorrents: Torrents = []): Torrent[] => {
  const allTorrents = [
    ...torrents,
    ...foundTorrents
  ]

  let newTorrents = []

  // Loop true all torrents
  allTorrents.forEach((torrent) => {
    let add = true
    const match = newTorrents.find(
      t => t.quality === torrent.quality
    )

    // If we have a match we need additional checks to determine witch one to keep
    if (match) {
      // Put add to false
      add = false

      // For 2160p we get the smallest one
      if (torrent.quality === '2160p') {
        // Check fi existing torrent is bigger then the new one
        if (torrent.size < match.size) {
          add = true
        }

      } else if (match.seeds < torrent.seeds) {
        add = true
      }
    }

    // Only add if we are allowed and quality is not null
    if (add && torrent.quality !== null) {
      // If add was true and we have a match we need to remove the old one
      if (match) {
        newTorrents = newTorrents.filter(
          t => t.quality !== torrent.quality
        )
      }

      // Add the sizeString attribute
      torrent.sizeString = formatBytes(torrent.size)

      newTorrents.push(torrent)
    }
  })

  // Return all merged torrents
  return sortTorrents(newTorrents)
}
