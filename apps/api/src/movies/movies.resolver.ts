import { Args, Query, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import { TraktService } from '@pct-org/services/trakt'
import { Movie, MoviesService, MoviesArgs, MovieArgs } from '@pct-org/types/movie'

@Resolver(of => Movie)
export class MoviesResolver {

  @Inject()
  private readonly moviesService: MoviesService

  @Inject()
  private readonly traktService: TraktService

  @Query(returns => Movie, { description: 'Get one movie.' })
  public movie(@Args() movieArgs: MovieArgs): Promise<Movie> {
    return this.moviesService.findOne(movieArgs._id)
  }

  @Query(returns => [Movie], { description: 'Get all movies.' })
  public movies(@Args() moviesArgs: MoviesArgs): Promise<Movie[]> {
    return this.moviesService.findAll(moviesArgs)
  }

  @Query(returns => [Movie], { description: 'Get related movies for an movie.' })
  public async relatedMovies(
    @Args({ name: '_id', description: 'Id of the movie to find related movies for.' }) _id: string
  ): Promise<Movie[]> {
    const relatedMovieIds = await this.traktService.findRelatedMovies(_id)

    const movies = await this.moviesService.findAllWithIDS(relatedMovieIds)

    return movies.sort((movieA, movieB) => (
      relatedMovieIds.indexOf(movieA._id) - relatedMovieIds.indexOf(movieB._id)
    ))
  }

}
