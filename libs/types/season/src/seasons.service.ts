import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import type { Model } from 'mongoose'

import { Season } from './season.object-type'
import { SeasonDocument } from './season.model'

@Injectable()
export class SeasonsService {

  @InjectModel('Seasons')
  private readonly seasonModel: Model<SeasonDocument>

  public async findAllForShow(id: string, lean = true): Promise<Season[]> {
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

  public async findOne(id: string, lean = true): Promise<Season> {
    return this.seasonModel.findById(
      id,
      {},
      {
        lean
      }
    )
  }

}
