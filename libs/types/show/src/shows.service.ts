import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ContentService } from '@pct-org/types/shared'

import type { Model } from 'mongoose'

import { ShowsArgs } from './dto/shows.args'
import { Show } from './show.object-type'
import { ShowDocument } from './show.model'

@Injectable()
export class ShowsService extends ContentService {

  @InjectModel('Shows')
  private readonly showModel: Model<ShowDocument>

  public async count(): Promise<number> {
    return this.showModel.count({})
  }

  public async findOne(id: string, lean = true): Promise<Show> {
    return this.showModel.findById(
      id,
      {},
      {
        lean
      }
    )
  }

  public async findAll(contentArgs: ShowsArgs, lean = true): Promise<Show[]> {
    return this.showModel.find(
      this.getQuery(contentArgs),
      {},
      this.getOptions(contentArgs, lean)
    )
  }

  public async findAllWithIDS(ids: string[], lean = true): Promise<Show[]> {
    return this.showModel.find(
      {
        _id: {
          $in: ids
        }
      },
      {},
      {
        lean
      }
    )
  }

  /**
   * Formats the id's from downloads so we can get
   * all the shows / seasons / episodes that are downloaded
   *
   * @param {array<string>} downloadIDs - IDs from the downloads
   */
  public getShowIDsFromDownloadIDs(downloadIDs: string[]) {
    let shows = []

    // Flatten the id's of shows to a usable list for graph
    downloadIDs
      .forEach((downloadId) => {
        const ids = downloadId.split('-')
        const showId = ids.shift()
        const seasonNr = ids.shift()

        // Check if the show is already added
        const showExists = shows.find(item => item._id === showId)

        // If the show does not exist yet add it
        if (!showExists) {
          shows.push({
            _id: showId,
            seasons: [{
              _id: `${showId}-${seasonNr}`,
              episodes: [{
                _id: downloadId
              }]
            }]
          })
        } else {
          // Show exists so let's update it
          shows = shows.map((show) => {
            if (show._id === showId) {
              const seasonId = `${showId}-${seasonNr}`
              const seasonExists = show.seasons.find(({ _id }) => _id === seasonId)

              let seasons = show.seasons

              // If the season already exists then add the episode to it
              if (seasonExists) {
                seasons = show.seasons.map((season) => {
                  if (season._id === seasonId) {
                    return {
                      ...season,
                      episodes: [
                        ...season.episodes,
                        {
                          _id:downloadId
                        }
                      ]
                    }
                  }

                  return season
                })
              } else {
                // Add new season
                seasons.push({
                  _id: seasonId,
                  episodes: [{
                    _id: downloadId
                  }]
                })
              }

              return {
                ...show,
                seasons
              }
            }

            return show
          })
        }
      })

    return shows
  }

}
