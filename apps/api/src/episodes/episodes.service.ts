import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Episode } from '@pct-org/mongo-models'

import { BookmarksService } from '../bookmarks/bookmarks.service'

@Injectable()
export class EpisodesService {

  constructor(
    @InjectModel('Episodes') private readonly episodeModel: Model<Episode>
  ) {}

  /**
   * Returns all the episodes for the user that he did not watch
   * from shows he bookmarked
   */
  async findMyEpisodes(bookmarksService: BookmarksService, lean = true): Promise<Episode[]> {
    const shows = await bookmarksService.findAllShows({
      offset: 0,
      limit: 1000,
      query: null
    })

    const eightDaysAgo = new Date(new Date().getTime() - (8 * 24 * 60 * 60 * 1000)).getTime()

    return this.episodeModel.find(
      {
        showImdbId: {
          $in: shows.map(show => show._id)
        },
        firstAired: {
          $gt: eightDaysAgo
        },
        $where: 'this.torrents.length > 0'
      },
      {},
      {
        sort: {
          firstAired: -1
        },
        lean
      }
    )
  }

  findOne(id: string, lean = true): Promise<Episode> {
    return this.episodeModel.findById(
      id,
      {},
      {
        lean
      }
    )
  }

  findAllForSeason(imdbId: string, seasonNumber: number, lean = true): Promise<Episode[]> {
    return this.episodeModel.find(
      {
        showImdbId: imdbId,
        season: seasonNumber,
        firstAired: {
          $gt: 0
        }
      },
      {},
      {
        // skip: showsArgs.offset,
        // limit: showsArgs.limit,
        sort: {
          number: 0 // Sort on episode number
        },
        lean
      }
    )
  }

  findAllWithIDS(ids: string[], lean = true): Promise<Episode[]> {
    return this.episodeModel.find(
      {
        _id: {
          $in: ids
        }
      },
      {},
      {
        // skip: showsArgs.offset,
        // limit: showsArgs.limit,
        sort: {
          number: 0 // Sort on episode number
        },
        lean
      }
    )
  }

  findForCalendar(showImdbId, lean = true): Promise<Episode[]> {
    const fourteenDaysAgo = new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000)).getTime()

    return this.episodeModel.find(
      {
        showImdbId,
        firstAired: {
          $gt: fourteenDaysAgo
        }
      },
      {},
      {
        sort: {
          number: 0 // Sort on episode number
        },
        lean
      }
    )
  }

  updateOne(episode: Episode): Promise<Episode> {
    return this.episodeModel.findOneAndUpdate({
        _id: episode._id
      },
      episode,
      {
        new: true,
      },
    )
  }

}
