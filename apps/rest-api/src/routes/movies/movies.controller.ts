import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { MoviesService, MoviesArgs, Movie } from '@pct-org/api/movies'
import { Movie as OldMovie } from '../../shared/movie.interface'

@Controller()
export class MoviesController {

  @Inject()
  private readonly moviesService: MoviesService

  @Get('/movies')
  public async getMovies(): Promise<string[]> {
    const totalMovies = await this.moviesService.count()

    return Array(Math.round(totalMovies / 50)).fill(null).map((empty, index) => (
      `/movies/${index + 1}`
    ))
  }

  @Get('/movies/:page')
  public async getMoviesPage(
    @Param('page') page: number,
    @Query() args: MoviesArgs
  ): Promise<OldMovie[]> {
    args.offset = (page - 1) * args.limit
    args.query = args.keywords

    const movies = await this.moviesService.findAll(args)

    return movies.map(this.formatMovie)
  }

  @Get('/movie/:imdbId')
  public async getMovie(
    @Param('imdbId') imdbId: string
  ): Promise<OldMovie> {
    const movie = await this.moviesService.findOne(imdbId)

    return this.formatMovie(movie)
  }

  private formatMovie(movie: Movie): OldMovie {
    return {
      _id: movie._id,
      imdb_id: movie._id,
      title: movie.title + 'test ',
      year: `${(new Date(movie.released)).getFullYear()}`,
      synopsis: movie.synopsis,
      runtime: `${(movie.runtime.hours * 60) + movie.runtime.minutes}`,
      released: movie.released,
      trailer: movie.trailer,
      certification: '',
      torrents: {
        en: {
          ...movie.torrents.reduce((newTorrents, torrent) => {
            newTorrents[torrent.quality] = {
              url: torrent.url,
              seed: torrent.seeds,
              peer: torrent.peers,
              size: torrent.size,
              fileSize: torrent.sizeString,
              provider: torrent.provider
            }

            return newTorrents
          }, {})
        }
      },
      genres: movie.genres,
      images: {
        poster: movie.images.poster.medium,
        fanart: movie.images.backdrop.medium,
        banner: movie.images.poster.medium
      },
      rating: {
        percentage: movie.rating.percentage,
        watching: movie.rating.watching,
        votes: movie.rating.votes,
        loved: 100,
        hated: 100
      }
    }
  }

}
