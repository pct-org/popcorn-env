import { Args, Query, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { Movie } from '@pct-org/mongo-models'
import { TraktService } from '@pct-org/services/trakt'

import { MovieArgs } from './dto/movie.args'
import { MoviesArgs } from './dto/movies.args'
import { MoviesService } from './movies.service'

@Resolver(of => Movie)
export class MoviesResolver {

  @Inject()
  private readonly moviesService: MoviesService

  @Inject()
  private readonly traktService: TraktService

  @Query(returns => Movie, { description: 'Get one movie.' })
  movie(@Args() movieArgs: MovieArgs): Promise<Movie> {
    return this.moviesService.findOne(movieArgs._id)
  }

  @Query(returns => [Movie], { description: 'Get all movies.' })
  movies(@Args() moviesArgs: MoviesArgs): Promise<Movie[]> {
    return this.moviesService.findAll(moviesArgs)
  }

  @Query(returns => [Movie], { description: 'Get related movies for an movie.' })
  async relatedMovies(
    @Args({ name: '_id', description: 'Id of the movie to find related movies for.' }) _id: string
  ): Promise<Movie[]> {
    const relatedMovieIds = await this.traktService.findRelatedMovies(_id)

    const movies = await this.moviesService.findAllWithIDS(relatedMovieIds)

    return movies.sort((movieA, movieB) => (
      relatedMovieIds.indexOf(movieA._id) - relatedMovieIds.indexOf(movieB._id)
    ))
  }

}
