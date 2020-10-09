import { Inject, Injectable, Logger } from '@nestjs/common'
import { BaseHelper } from '@pct-org/scraper/base-helper'
import { MovieType, ScrapedItem, ScrapedMovieTorrent } from '@pct-org/scraper/base-provider'
import { InjectModel } from '@nestjs/mongoose'
import { MovieModel, Movie, Show } from '@pct-org/mongo-models'
import { TraktService } from '@pct-org/services/trakt'
import { TmdbService } from '@pct-org/services/tmdb'
import { formatTorrents } from '@pct-org/torrent/utils'

@Injectable()
export class MovieHelperService extends BaseHelper {

  @InjectModel('Movies')
  private readonly movieModel: typeof MovieModel

  @Inject()
  private readonly traktService: TraktService

  @Inject()
  private readonly tmdbService: TmdbService

  protected readonly logger = new Logger('MovieHelper')

  public async getItem(imdb: string = null, slug: string = null): Promise<Movie | undefined> {
    const item = await this.movieModel.findOne({
        [imdb ? '_id' : 'slug']: imdb || slug
      },
      {},
      { lean: true }
    )

    if (item) {
      return item as Movie
    }

    return undefined
  }

  public shouldUpdateExistingItem(item: Movie): boolean {
    // TODO:: Determine if we need to update the trakt info / images

    return true
  }

  public updateTraktInfo(item: Movie): Promise<Movie> {
    return Promise.resolve(item)
  }

  /**
   * Add trakt info to the scraped item
   */
  public async addTraktInfo(item: ScrapedItem): Promise<Movie | undefined> {
    const traktMovie = await this.traktService.getMovieSummary(item.imdb)

    if (!traktMovie) {
      return
    }

    const traktWatchers = await this.traktService.getMovieWatching(item.imdb)
    const ratingPercentage = Math.round(traktMovie.rating * 10)

    return {
      _id: traktMovie.ids.imdb,
      imdbId: traktMovie.ids.imdb,
      tmdbId: traktMovie.ids.tmdb,
      slug: traktMovie.ids.slug,
      title: traktMovie.title,
      released: new Date(traktMovie.released).getTime(),
      certification: traktMovie.certification,
      synopsis: traktMovie.overview,
      runtime: this.formatRuntime(traktMovie.runtime),
      rating: {
        stars: parseFloat(((ratingPercentage / 100) * 5).toFixed(2)),
        votes: traktMovie.votes,
        watching: traktWatchers?.length ?? 0,
        percentage: ratingPercentage
      },
      images: {
        backdrop: BaseHelper.DefaultImageSizes,
        poster: BaseHelper.DefaultImageSizes
      },
      genres: traktMovie.genres
        ? traktMovie.genres
        : ['unknown'],
      trailer: traktMovie.trailer,
      trailerId: traktMovie.trailer
        ? traktMovie.trailer.split('v=').reverse().shift()
        : null,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
      type: MovieType,
      torrents: [],
      searchedTorrents: [],
      watched: {
        complete: false,
        progress: 0
      },
      download: {
        downloadComplete: false,
        downloading: false,
        downloadStatus: null,
        downloadedOn: null,
        downloadQuality: null
      },
      bookmarked: false,
      bookmarkedOn: null
    }
  }

  public async addImages(item: Movie): Promise<Movie> {
    return this.addTmdbImages(item)
      // .catch(item => this.addOmdbImages(item))
      // .catch(item => this.addFanartImages(item))
      .catch((item) => item)
  }

  public addTorrents(item: Movie, torrents: ScrapedMovieTorrent[]): Promise<Movie | Show> {
    item.torrents = formatTorrents(item.torrents, torrents)

    return Promise.resolve(item)
  }

  public async addItemToDatabase(item: Movie): Promise<void> {
    this.logger.log(`'${item.title}' is a new movie!`)

    await this.movieModel.create(item)
  }

  public async updateItemInDatabase(item: Movie): Promise<void> {
    this.logger.log(`'${item.title}' is an existing movie.`)

    // Also update the updated at timestamp
    item.updatedAt = Number(new Date())

    await this.movieModel.findByIdAndUpdate(item._id, item)
  }

  private async addTmdbImages(item: Movie): Promise<Movie | Show> {
    item.images = await this.tmdbService.getMovieImages(item)

    return this.checkImages(item)
  }

  // private addOmdbImages(item: Movie): Promise<Movie | Show> {
  //
  // }
  //
  // private addFanartImages(item: Movie): Promise<Movie | Show> {
  //
  // }

}
