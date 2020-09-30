import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Episode, Movie, Download } from '@pct-org/mongo-models'

import { DownloadsArgs } from './dto/downloads.args'
import { DownloadArgs } from './dto/download.args'
import { NewDownloadInput } from './dto/new-download.input'
import { TorrentService } from '../shared/torrent/torrent.service'

@Injectable()
export class DownloadsService {

  constructor(
    @InjectModel('Movies') private readonly movieModel: Model<Movie>,
    @InjectModel('Episodes') private readonly episodeModel: Model<Episode>,
    @InjectModel('Downloads') private readonly downloadModel: Model<Download>
  ) {}

  /**
   * Add's one download
   */
  addOne(newDownloadData: NewDownloadInput): Promise<Download> {
    return new this.downloadModel({
      ...newDownloadData,
      status: TorrentService.STATUS_QUEUED,
      progress: 0,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date())
    }).save()
  }

  /**
   * Find one download, for downloads lean is false as there is a bigger change we are going to edit it
   */
  findOne(id: string, lean = false): Promise<Download> {
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
  findAll(downloadsArgs: DownloadsArgs): Promise<Download[]> {
    return this.downloadModel.find(
      {},
      {},
      {
        skip: downloadsArgs.offset,
        limit: downloadsArgs.limit
      }
    )
  }

  /**
   * Get all the downloads with a certain id
   */
  findAllWithIds(ids: string[]): Promise<Download[]> {
    return this.downloadModel.find(
      {
        _id: {
          $in: ids
        }
      }
    )
  }

  /**
   * Get all downloads
   */
  getAllEpisodes(): Promise<Download[]> {
    return this.downloadModel.find({
      // TODO:: Constants?
      itemType: 'episode'
    })
  }

}
