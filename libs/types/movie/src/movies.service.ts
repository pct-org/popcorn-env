import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ContentService } from '@pct-org/types/shared'

import type { Model } from 'mongoose'

import { MoviesArgs } from './dto/movies.args'
import { MovieDocument } from './movie.model'
import { Movie } from './movie.object-type'

@Injectable()
export class MoviesService extends ContentService {

  @InjectModel('Movies')
  private readonly movieModel: Model<MovieDocument>

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
