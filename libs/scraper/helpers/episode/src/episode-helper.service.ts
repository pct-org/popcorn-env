import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { EpisodeModel, Episode } from '@pct-org/mongo-models'
import { defaultEpisodeImages } from '@pct-org/constants/default-image-sizes'
import { TYPE_EPISODE } from '@pct-org/constants/item-types'

@Injectable()
export class EpisodeHelperService {

  @InjectModel('Episodes')
  private readonly episodeModel: EpisodeModel

  protected readonly logger = new Logger('EpisodeHelper')

  public getEmptyEpisode(): Episode {
    return {
      _id: null,
      firstAired: 0,
      number: null,
      season: null,
      showImdbId: null,
      title: null,
      tmdbId: null,
      synopsis: null,
      images: defaultEpisodeImages,
      torrents: [],
      searchedTorrents: [],
      type: TYPE_EPISODE,
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

  public async addEpisodesToDatabase(episodes: Episode[]): Promise<void> {
    await Promise.all(episodes.map(this.addEpisodeToDatabase))
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
