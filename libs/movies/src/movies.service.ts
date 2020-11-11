import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Movie, MovieModel } from '@pct-org/mongo-models'

import { MoviesArgs } from './dto/movies.args'
import { ContentService } from './content/content.service'

@Injectable()
export class MoviesService extends ContentService {

  @InjectModel('Movies')
  private readonly movieModel: MovieModel

  public async count(): Promise<number> {
    return this.movieModel.count({})
  }

  public async findOne(id: string, lean = true): Promise<Movie> {
    return this.movieModel.findById(
      id,
      {},
      {
        lean
      }
    )
  }

  public async findAll(moviesArgs: MoviesArgs, lean = true): Promise<Movie[]> {
    return this.movieModel.find(
      this.getQuery(moviesArgs),
      {},
      this.getOptions(moviesArgs, lean)
    )
  }

  public async findAllWithIDS(ids: string[], lean = true): Promise<Movie[]> {
    return this.movieModel.find(
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

  public async updateOne(movie: Partial<Movie>): Promise<Movie> {
    return this.movieModel.findByIdAndUpdate(
      movie._id,
      movie,
      {
        new: true
      }
    )
  }

  protected getQuery(moviesArgs: MoviesArgs): object {
    let query = super.getQuery(moviesArgs)

    if (moviesArgs.noWatched) {
      query = {
        ...query,
        'watched.complete': false
      }
    }

    return query
  }

}
