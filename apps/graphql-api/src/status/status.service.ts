import { HttpService, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Movie, Show, Episode } from '@pct-org/mongo-models'

import { ConfigService } from '../shared/config/config.service'
import { Status } from './status.object-type'
import { StatusScraper } from './status-scraper.object-type'
import { formatMsToRemaining } from '../shared/utils'

@Injectable()
export class StatusService {

  constructor(
    @InjectModel('Movies')
    private readonly movieModel: Model<Movie>,
    @InjectModel('Shows')
    private readonly showModel: Model<Show>,
    @InjectModel('Episodes')
    private readonly episodesModel: Model<Episode>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async getStatus(): Promise<Status> {
    return {
      version: this.configService.version,
      totalMovies: this.movieModel.countDocuments(),
      totalShows: this.showModel.countDocuments(),
      totalEpisodes: this.episodesModel.countDocuments()
    }
  }

  async getScraperStatus(): Promise<StatusScraper> {
    try {
      const response = await this.httpService.get(
        `${this.configService.get('SCRAPER_URL')}/status`
      ).toPromise()

      return {
        version: response.data.version,
        status: response.data.status,
        updated: response.data.updated,
        nextUpdate: response.data.nextUpdate,
        uptime: formatMsToRemaining(response.data.uptime * 1000)
      }

    } catch (e) {
      return {
        version: 'unknown',
        status: `offline - ${e.message || e}`,
        updated: 'unknown',
        nextUpdate: 'unknown',
        uptime: 'unknown'
      }
    }
  }

}
