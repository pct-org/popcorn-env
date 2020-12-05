import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Download, DownloadModel } from '@pct-org/types/download'
import { EPISODE_TYPE } from '@pct-org/types/episode'

import { DownloadsArgs } from './dto/downloads.args'
import { NewDownloadInput } from './dto/new-download.input'
import { TorrentService } from '../shared/torrent/torrent.service'

@Injectable()
export class DownloadsService {

  @InjectModel('Downloads')
  private readonly downloadModel: DownloadModel

  /**
   * Add's one download
   */
  public addOne(newDownloadData: NewDownloadInput): Promise<Download> {
    return this.downloadModel.create({
      ...newDownloadData,
      status: TorrentService.STATUS_QUEUED,
      progress: 0,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date())
    })
  }

  /**
   * Find one download, for downloads lean is false as there is a bigger change we are going to edit it
   */
  public async findOne(id: string, lean = false): Promise<Download> {
    return this.downloadModel.findById(
      id,
      {},
      {
        lean
      }
    )
  }

  /**
   * Get all downloads
   */
  public async findAll(downloadsArgs: DownloadsArgs): Promise<Download[]> {
    return this.downloadModel.find(
      {},
      {},
      {
        skip: downloadsArgs.offset,
        limit: downloadsArgs.limit,
        lean: true
      }
    )
  }

  /**
   * Get all the downloads with a certain id
   */
  public async findAllWithIds(ids: string[]): Promise<Download[]> {
    return this.downloadModel.find(
      {
        _id: {
          $in: ids
        }
      },
      {},
      {
        lean: true
      }
    )
  }

  /**
   * Get all downloads
   */
  public async getAllEpisodes(): Promise<Download[]> {
    return this.downloadModel.find(
      {
        itemType: EPISODE_TYPE
      },
      {},
      {
        lean: true
      }
    )
  }

}
