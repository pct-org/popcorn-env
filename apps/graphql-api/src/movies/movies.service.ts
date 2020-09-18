import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Movie } from '@pct-org/mongo-models'

import { MovieArgs } from './dto/movie.args'
import { MoviesArgs } from './dto/movies.args'
import { ContentService } from '../shared/content/content.service'

@Injectable()
export class MoviesService extends ContentService {

  constructor(
    @InjectModel('Movies') private readonly movieModel: Model<Movie>
  ) {
    super()
  }

  findOne(id: string, lean = true): Promise<Movie> {
    return this.movieModel.findById(
      id,
      {},
      {
        lean
      }
    )
  }

  findAll(moviesArgs: MoviesArgs, lean = true): Promise<Movie[]> {
    return this.movieModel.find(
      this.getQuery(moviesArgs),
      {},
      this.getOptions(moviesArgs, lean)
    )
  }

  updateOne(movie: Movie): Promise<Movie> {
    return this.movieModel.findOneAndUpdate({
        _id: movie._id
      },
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
