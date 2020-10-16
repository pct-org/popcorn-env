import { Inject, Injectable, Logger } from '@nestjs/common'
import { ScrapedShowTorrent } from '@pct-org/scraper/base-provider'
import { InjectModel } from '@nestjs/mongoose'
import { SeasonModel, Season } from '@pct-org/mongo-models'
import { TraktSeason } from '@pct-org/services/trakt'
import { EpisodeHelperService } from './episode-helper.service'

@Injectable()
export class SeasonHelperService {

  @InjectModel('Seasons')
  private readonly seasonModel: SeasonModel

  @Inject()
  private readonly episodeHelperService: EpisodeHelperService

  protected readonly logger = new Logger('SeasonHelper')

  public formatTraktSeasons(seasons: TraktSeason[], torrents: ScrapedShowTorrent[]): Season[] {

    return []
  }

  public async enhanceSeasons(seasons: Season[]): Promise<Season[]> {
    return seasons
  }

  public async addSeasonsInDatabase(seasons: Season[]): Promise<void> {
    await Promise.all(seasons.map(this.addSeasonInDatabase))
  }

  public async updateSeasonsInDatabase(seasons: Season[]): Promise<void> {
    await Promise.all(seasons.map(async (season) => {
      // TODO:: check if season exists, if not then update else create

      await this.updateSeasonInDatabase(season)
    }))
  }

  private async addSeasonInDatabase(season: Season): Promise<void> {
    const episodes = season.episodes
    delete season.episodes

    await this.seasonModel.create(season)
    await this.episodeHelperService.addEpisodesInDatabase(episodes)
  }

  private async updateSeasonInDatabase(season: Season): Promise<void> {
    const episodes = season.episodes
    delete season.episodes

    season.updatedAt = Number(new Date())
    await this.seasonModel.findByIdAndUpdate(season._id, season)
    await this.episodeHelperService.updateEpisodesInDatabase(episodes)
  }

}
