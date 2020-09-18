import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Season } from '@pct-org/mongo-models'

@Injectable()
export class SeasonsService {

  constructor(
    @InjectModel('Seasons') private readonly seasonModel: Model<Season>
  ) {}

  findAllForShow(id: string, lean = true): Promise<Season[]> {
    return this.seasonModel.find(
      {
        showImdbId: id,
        firstAired: {
          $gt: 0
        }
      },
      {},
      {
        // skip: showsArgs.offset,
        // limit: showsArgs.limit,
        sort: {
          number: 0 // Sort on season number
        },
        lean
      }
    )
  }

  findOne(id: string, lean = true): Promise<Season[]> {
    return this.seasonModel.findById(
      id,
      {},
      {
        // skip: showsArgs.offset,
        // limit: showsArgs.limit,
        sort: {
          number: 0 // Sort on season number
        },
        lean
      }
    )
  }

}
