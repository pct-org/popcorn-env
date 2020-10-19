import { Inject, Injectable, Logger } from '@nestjs/common'
import { ScrapedShowTorrent } from '@pct-org/scraper/base-provider'
import { InjectModel } from '@nestjs/mongoose'
import { SeasonModel, Season } from '@pct-org/mongo-models'
import { TraktSeason } from '@pct-org/services/trakt'
import { EpisodeHelperService } from '@pct-org/scraper/helpers/episode'

@Injectable()
export class SeasonHelperService {

  @InjectModel('Seasons')
  private readonly seasonModel: SeasonModel

  @Inject()
  private readonly episodeHelperService: EpisodeHelperService

  protected readonly logger = new Logger('SeasonHelper')

  public formatTraktSeasons(traktSeasons: TraktSeason[], torrents: ScrapedShowTorrent[]): Season[] {
    const formattedSeasons = []
    let seasonNumbers = Object.keys(torrents)

    // If we don't have any episodes for specials then also remove it from trakt
    if (!seasonNumbers.includes('0') && !seasonNumbers.includes(0)) {
      traktSeasons = traktSeasons.filter((traktSeason) => traktSeason.number !== 0)
    }


    return []
  }

  public async enhanceSeasons(seasons: Season[]): Promise<Season[]> {
    return seasons
  }

  public async addSeasonsToDatabase(seasons: Season[]): Promise<void> {
    await Promise.all(seasons.map(this.addSeasonToDatabase))
  }

  public async updateSeasonsInDatabase(seasons: Season[]): Promise<void> {
    await Promise.all(seasons.map(async (season) => {
      const existingSeason = await this.seasonModel.findById(season._id)

      if (existingSeason) {
        await this.updateSeasonInDatabase(season, existingSeason)

      } else {
        await this.addSeasonToDatabase(season)
      }
    }))
  }

  private async addSeasonToDatabase(season: Season): Promise<void> {
    const episodes = season.episodes
    delete season.episodes

    await this.seasonModel.create(season)
    await this.episodeHelperService.addEpisodesToDatabase(episodes)
  }

  private async updateSeasonInDatabase(season: Season, existingSeason: Season): Promise<void> {
    const episodes = season.episodes
    delete season.episodes

    season.updatedAt = Number(new Date())
    season.createdAt = existingSeason.createdAt

    await this.seasonModel.findByIdAndUpdate(season._id, season)
    await this.episodeHelperService.updateEpisodesInDatabase(episodes)
  }

}
