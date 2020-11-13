import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Episode } from './episode.object-type'
import { EpisodeModel } from './episode.model'

// import { BookmarksService } from '../bookmarks/bookmarks.service'

@Injectable()
export class EpisodesService {

  @InjectModel('Episodes')
  private readonly episodeModel: EpisodeModel

  /**
   * Returns all the episodes for the user that he did not watch
   * from shows he bookmarked
   */
  // async findMyEpisodes(bookmarksService: BookmarksService, lean = true): Promise<Episode[]> {
  //   const shows = await bookmarksService.findAllShows({
  //     offset: 0,
  //     limit: 1000,
  //     query: null
  //   })
  //
  //   const eightDaysAgo = new Date(new Date().getTime() - (8 * 24 * 60 * 60 * 1000)).getTime()
  //
  //   return this.episodeModel.find(
  //     {
  //       showImdbId: {
  //         $in: shows.map(show => show._id)
  //       },
  //       firstAired: {
  //         $gt: eightDaysAgo
  //       },
  //       $where: 'this.torrents.length > 0'
  //     },
  //     {},
  //     {
  //       sort: {
  //         firstAired: -1
  //       },
  //       lean
  //     }
  //   )
  // }

  public async findOne(id: string, lean = true): Promise<Episode> {
    return this.episodeModel.findById(
      id,
      {},
      {
        lean
      }
    )
  }

  public async findAllForShow(imdbId: string, lean = true): Promise<Episode[]> {
    return this.episodeModel.find(
      {
        showImdbId: imdbId,
        firstAired: {
          $gt: 0
        }
      },
      {},
      {
        // skip: showsArgs.offset,
        // limit: showsArgs.limit,
        sort: {
          season: 0,
          number: 0 // Sort on episode number
        },
        lean
      }
    )
  }

  public async findAllForSeason(imdbId: string, seasonNumber: number, lean = true): Promise<Episode[]> {
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

  public async findAllWithIDS(ids: string[], lean = true): Promise<Episode[]> {
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

  public async findForCalendar(showImdbId: string, lean = true): Promise<Episode[]> {
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

  public async updateOne(episode: Partial<Episode>): Promise<Episode> {
    return this.episodeModel.findByIdAndUpdate(
      episode._id,
      episode,
      {
        new: true
      }
    )
  }

}
