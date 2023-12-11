import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { InjectModel } from '@nestjs/mongoose'
import { checkSync } from 'diskusage'
import { formatBytes } from '@pct-org/torrent/utils'
import { MovieDocument } from '@pct-org/types/movie'
import { ShowDocument } from '@pct-org/types/show'
import { EpisodeDocument } from '@pct-org/types/episode'
import fastFolderSizeSync from 'fast-folder-size/sync'

import type { Model } from 'mongoose'

import { Status } from './status.object-type'
import { StatusScraper } from './status-scraper.object-type'
import { ConfigService } from '../shared/config/config.service'

@Injectable()
export class StatusService {

  @InjectModel('Movies')
  private readonly movieModel: Model<MovieDocument>

  @InjectModel('Shows')
  private readonly showModel: Model<ShowDocument>

  @InjectModel('Episodes')
  private readonly episodesModel: Model<EpisodeDocument>

  @Inject()
  private readonly configService: ConfigService

  @Inject()
  private readonly httpService: HttpService

  public async getStatus(): Promise<Status> {
    const disk = await checkSync(
      this.configService.get(ConfigService.DOWNLOAD_LOCATION)
    )

    const folderSize = fastFolderSizeSync(this.configService.get(ConfigService.DOWNLOAD_LOCATION))

    const freePercentage = parseFloat(
      ((disk.available / disk.total) * 100).toFixed(2)
    )
    const usedPercentage = parseFloat(
      ((folderSize / disk.total) * 100).toFixed(2)
    )
    const sizePercentage = parseFloat(
      (((disk.total - disk.available - folderSize) / disk.total) * 100).toFixed(
        2
      )
    )

    return {
      version: this.configService.version,
      totalMovies: await this.movieModel.countDocuments(),
      totalShows: await this.showModel.countDocuments(),
      totalEpisodes: await this.episodesModel.countDocuments(),
      disk: {
        free: formatBytes(disk.available),
        used: formatBytes(folderSize),
        size: formatBytes(disk.total),

        freePercentage,
        usedPercentage,
        sizePercentage
      }
    }
  }

  public async getScraperStatus(): Promise<StatusScraper> {
    try {
      const response = await this.httpService
        .get(`http://localhost:${this.configService.get(ConfigService.SCRAPER_PORT)}/status`)
        .toPromise()

      return {
        version: response.data.version,
        status: response.data.status,
        updated: response.data.updated,
        nextUpdate: response.data.nextUpdate,
        uptime: response.data.uptime
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
