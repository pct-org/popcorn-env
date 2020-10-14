import { HttpService, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { checkSync } from 'diskusage'
import * as getFolderSize from 'get-folder-size'

import { MovieModel, ShowModel, EpisodeModel } from '@pct-org/mongo-models'

import { Status } from './status.object-type'
import { StatusScraper } from './status-scraper.object-type'
import { ConfigService } from '../shared/config/config.service'
import { formatKbToString, formatMsToRemaining } from '../shared/utils'

@Injectable()
export class StatusService {

  @InjectModel('Movies')
  private readonly movieModel: MovieModel

  @InjectModel('Shows')
  private readonly showModel: ShowModel

  @InjectModel('Episodes')
  private readonly episodesModel: EpisodeModel

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async getStatus(): Promise<Status> {
    const disk = await checkSync(
      this.configService.get(ConfigService.DOWNLOAD_LOCATION)
    )

    const folderSize = await this.getFolderSize()

    const freePercentage = parseFloat(((disk.available / disk.total) * 100).toFixed(2))
    const usedPercentage = parseFloat(((folderSize / disk.total) * 100).toFixed(2))
    const sizePercentage = parseFloat((((disk.total - disk.available - folderSize) / disk.total) * 100).toFixed(2))

    return {
      version: 'unknown', // TODO:: Get git tag
      totalMovies: this.movieModel.countDocuments(),
      totalShows: this.showModel.countDocuments(),
      totalEpisodes: this.episodesModel.countDocuments(),
      disk: {
        free: formatKbToString(disk.available, false),
        used: formatKbToString(folderSize, false),
        size: formatKbToString(disk.total, false),

        freePercentage,
        usedPercentage,
        sizePercentage
      }
    }
  }

  async getScraperStatus(): Promise<StatusScraper> {
    try {
      const response = await this.httpService.get(
        `http://localhost:${this.configService.get(ConfigService.SCRAPER_PORT)}/status`
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

  private getFolderSize(): Promise<number> {
    return new Promise((resolve) => {
      getFolderSize(this.configService.get(ConfigService.DOWNLOAD_LOCATION), (err, size) => {
        resolve(err ? 0 : size)
      })
    })
  }

}
