import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Show } from '@pct-org/types/show'
import { Episode, EPISODE_TYPE, EpisodeDocument } from '@pct-org/types/episode'
import { IMAGES_DEFAULT } from '@pct-org/types/image'
import { TraktEpisode } from '@pct-org/services/trakt'
import { formatTorrents } from '@pct-org/torrent/utils'
import { ScrapedTorrent } from '@pct-org/scraper/providers/base'

import type { Model } from 'mongoose'

@Injectable()
export class EpisodeHelperService {

  @InjectModel('Episodes')
  private readonly episodeModel: Model<EpisodeDocument>

  protected readonly logger = new Logger('EpisodeHelper')

  private getEmptyEpisode(): Episode {
    return {
      _id: null,
      firstAired: 0,
      number: null,
      season: null,
      showImdbId: null,
      title: null,
      tmdbId: null,
      synopsis: null,
      images: IMAGES_DEFAULT,
      torrents: [],
      searchedTorrents: [],
      type: EPISODE_TYPE,
      watched: {
        complete: false,
        progress: 0
      },
      download: {
        downloadComplete: false,
        downloading: false,
        downloadStatus: null,
        downloadQuality: null,
        downloadedOn: null
      },
      createdAt: Number(new Date()),
      updatedAt: Number(new Date())
    }
  }

  public formatTraktEpisode(show: Show, episode: TraktEpisode, torrents: ScrapedTorrent[]): Episode {
    return {
      ...this.getEmptyEpisode(),

      _id: `${show._id}-${episode.season}-${episode.number}`,
      showImdbId: show._id,
      tmdbId: episode.ids.tmdb,
      number: episode.number,
      season: episode.season,
      title: episode.title,
      synopsis: episode.overview,
      firstAired: Number(new Date(episode.first_aired)) ?? 0,
      torrents: formatTorrents(torrents)
    }
  }

  public formatUnknownEpisode(show: Show, seasonNr: number, episodeNr: number, torrents: ScrapedTorrent[]): Episode {
    return {
      ...this.getEmptyEpisode(),

      _id: `${show._id}-${seasonNr}-${episodeNr}`,
      showImdbId: show._id,
      number: episodeNr,
      season: seasonNr,
      title: `Episode ${episodeNr}`,
      // Use the createdAt date, otherwise it wont show in the app, will be overwritten when
      // metadata becomes available
      firstAired: Number(new Date()),
      torrents: formatTorrents(torrents)
    }
  }

  public async addEpisodesToDatabase(episodes: Episode[]): Promise<void> {
    await Promise.all(episodes.map((episode) => this.addEpisodeToDatabase(episode)))
  }

  public async updateEpisodesInDatabase(episodes: Episode[]): Promise<void> {
    await Promise.all(episodes.map(async (episode) => {
      const existingEpisode = await this.episodeModel.findById(episode._id)

      if (existingEpisode) {
        await this.updateEpisodeInDatabase(episode, existingEpisode)

      } else {
        await this.addEpisodeToDatabase(episode)
      }
    }))
  }

  private async addEpisodeToDatabase(episode: Episode): Promise<void> {
    await this.episodeModel.create(episode)
  }

  private async updateEpisodeInDatabase(episode: Episode, existingEpisode: Episode): Promise<void> {
    episode.updatedAt = Number(new Date())

    // Keep some old props
    episode.createdAt = existingEpisode.createdAt
    episode.download = existingEpisode.download
    episode.watched = existingEpisode.watched
    episode.searchedTorrents = existingEpisode.searchedTorrents

    await this.episodeModel.findByIdAndUpdate(episode._id, episode)
  }

}
