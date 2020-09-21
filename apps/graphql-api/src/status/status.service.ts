import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Movie, Show, Episode } from '@pct-org/mongo-models'

import { Status } from './status.object-type'
import { StatusScraper } from './status-scraper.object-type'

@Injectable()
export class StatusService {

  constructor(
    @InjectModel('Movies')
    private readonly movieModel: Model<Movie>,
    @InjectModel('Shows')
    private readonly showModel: Model<Show>,
    @InjectModel('Episodes')
    private readonly episodesModel: Model<Episode>,
  ) {}

  async getStatus(): Promise<Status> {
    return {
      version: 'unknown', // TODO:: Get git tag
      totalMovies: this.movieModel.countDocuments(),
      totalShows: this.showModel.countDocuments(),
      totalEpisodes: this.episodesModel.countDocuments()
    }
  }

  /**
   * @deprecated will be removed in the next major version
   */
  getScraperStatus(): StatusScraper {
    return {
      version: 'unknown',
      status: `unknown`,
      updated: 'unknown',
      nextUpdate: 'unknown',
      uptime: 'unknown'
    }
  }

}
