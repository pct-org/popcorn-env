import { Args, Query, Resolver } from '@nestjs/graphql'

import { Movie } from '@pct-org/mongo-models'

import { MovieArgs } from './dto/movie.args'
import { MoviesArgs } from './dto/movies.args'
import { MoviesService } from './movies.service'
import { TraktService } from '../shared/trakt/trakt.service'

@Resolver(of => Movie)
export class MoviesResolver {

  constructor(
    private readonly moviesService: MoviesService,
    private readonly traktService: TraktService
  ) {}

  @Query(returns => Movie)
  movie(@Args() movieArgs: MovieArgs): Promise<Movie> {
    return this.moviesService.findOne(movieArgs._id)
  }

  @Query(returns => [Movie])
  movies(@Args() moviesArgs: MoviesArgs): Promise<Movie[]> {
    return this.moviesService.findAll(moviesArgs)
  }

  @Query(returns => [Movie])
  relatedMovies(
    @Args({ name: '_id', description: 'Id of the movie to find related movies for.' }) _id: string
  ): Promise<Movie[]> {
    return this.traktService.findRelatedMovies(_id)
  }

}
