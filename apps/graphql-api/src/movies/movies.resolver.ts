import { Args, Query, Resolver } from '@nestjs/graphql'

import { Movie } from '@pct-org/mongo-models'

import { MovieArgs } from './dto/movie.args'
import { MoviesArgs } from './dto/movies.args'
import { MoviesService } from './movies.service'

@Resolver(of => Movie)
export class MoviesResolver {

  constructor(private readonly moviesService: MoviesService) {}

  @Query(returns => Movie)
  movie(@Args() movieArgs: MovieArgs): Promise<Movie> {
    return this.moviesService.findOne(movieArgs._id)
  }

  @Query(returns => [Movie])
  movies(@Args() moviesArgs: MoviesArgs): Promise<Movie[]> {
    return this.moviesService.findAll(moviesArgs)
  }

}
