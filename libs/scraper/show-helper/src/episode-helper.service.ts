import {  Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { EpisodeModel, Episode } from '@pct-org/mongo-models'

@Injectable()
export class EpisodeHelperService {

  @InjectModel('Episodes')
  private readonly episodeModel: EpisodeModel

  protected readonly logger = new Logger('EpisodeHelper')

  public async addEpisodesInDatabase(episodes: Episode[]): Promise<void> {
    await Promise.all(episodes.map(this.addEpisodeInDatabase))
  }

  public async updateEpisodesInDatabase(episodes: Episode[]): Promise<void> {
    await Promise.all(episodes.map(async(episode) => {
      // TODO:: check if episode exists, if not then update else create

      await this.updateEpisodeInDatabase(episode)
    }))
  }

  private async addEpisodeInDatabase(episode: Episode): Promise<void> {
    await this.episodeModel.create(episode)
  }

  private async updateEpisodeInDatabase(episode: Episode): Promise<void> {
    episode.updatedAt = Number(new Date())

    await this.episodeModel.findByIdAndUpdate(episode._id, episode)
  }

}
