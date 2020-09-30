import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Show, Download } from '@pct-org/mongo-models'

import { ContentService } from '../shared/content/content.service'

import { ShowsArgs } from './dto/shows.args'

@Injectable()
export class ShowsService extends ContentService {

  constructor(
    @InjectModel('Shows') private readonly showModel: Model<Show>
  ) {
    super()
  }

  findOne(id: string, lean = true): Promise<Show> {
    return this.showModel.findById(
      id,
      {},
      {
        lean
      }
    )
  }

  findAll(contentArgs: ShowsArgs, lean = true): Promise<Show[]> {
    return this.showModel.find(
      this.getQuery(contentArgs),
      {},
      this.getOptions(contentArgs, lean)
    )
  }

  findAllWithIDS(ids: string[], lean = true): Promise<Show[]> {
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
   * @param {array<Download>} downloads - Downloads from mongo db
   */
  getShowIDsFromDownloads(downloads: Download[]) {
    let shows = []

    // Flatten the id's of shows to a usable list for graph
    downloads
      .forEach((download) => {
        const ids = download._id.split('-')
        const showId = ids.shift()
        const seasonNr = ids.shift()

        // Check if the show is already added
        const showExists = shows.find(item => item._id === showId)

        // If the show does not exist yet add it
        if (!showExists) {
          shows.push({
            _id: showId,
            createdAt: download.createdAt,
            seasons: [{
              _id: `${showId}-${seasonNr}`,
              episodes: [{
                _id: download._id
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
                          _id: download._id
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
                    _id: download._id
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
