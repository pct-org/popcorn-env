import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Season, SeasonModel } from '@pct-org/types/season'

@Injectable()
export class SeasonsService {

  @InjectModel('Seasons')
  private readonly seasonModel: SeasonModel

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
