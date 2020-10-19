import { Inject, Injectable, Logger } from '@nestjs/common'
import { BaseHelper } from '@pct-org/scraper/helpers/base'
import { MovieType, ScrapedItem, ScrapedTorrent } from '@pct-org/scraper/base-provider'
import { InjectModel } from '@nestjs/mongoose'
import { MovieModel, Movie, Show } from '@pct-org/mongo-models'
import { TraktService } from '@pct-org/services/trakt'
import { TmdbService } from '@pct-org/services/tmdb'
import { FanartService } from '@pct-org/services/fanart'
import { OmdbService } from '@pct-org/services/omdb'
import { formatTorrents } from '@pct-org/torrent/utils'

@Injectable()
export class MovieHelperService extends BaseHelper {

  @InjectModel('Movies')
  private readonly movieModel: MovieModel

  @Inject()
  private readonly traktService: TraktService

  @Inject()
  private readonly tmdbService: TmdbService

  @Inject()
  private readonly fanartService: FanartService

  @Inject()
  private readonly omdbService: OmdbService

  protected readonly logger = new Logger('MovieHelper')

  public async getItem(imdb: string = null, slug: string = null): Promise<Movie | undefined> {
    return this.movieModel.findOne({
        [imdb ? '_id' : 'slug']: imdb || slug
      },
      {},
      { lean: true }
    )
  }

  /**
   * We only want to update the Movie metadata every 3 weeks so we can
   * check here if the lastMetadataUpdate is older then 3 weeks
   */
  public shouldUpdateExistingItem(item: Movie): boolean {
    const threeWeeksAgo = new Date(Date.now() - (6.04e+8 * 3))

    return threeWeeksAgo.getTime() > item.lastMetadataUpdate
  }

  public async updateTraktInfo(item: Movie): Promise<Movie> {
    // Get new trakt item
    const traktItem = await this.addTraktInfo({
      imdb: item.imdbId,
      slug: item.slug,
      title: item.title
    })

    if (!traktItem) {
      return item
    }

    // Restore props that don't need to change
    traktItem.createdAt = item.createdAt
    traktItem.watched = item.watched
    traktItem.bookmarked = item.bookmarked
    traktItem.bookmarkedOn = item.bookmarkedOn
    traktItem.download = item.download
    traktItem.searchedTorrents = item.searchedTorrents

    return traktItem
  }

  /**
   * Add trakt info to the scraped item
   */
  public async addTraktInfo(item: Pick<ScrapedItem, 'imdb' | 'slug' | 'title'>): Promise<Movie | undefined> {
    const traktMovie = await this.traktService.getMovieSummary(item.imdb)

    if (!traktMovie) {
      // Try again in 1 week
      await this.addToBlacklist(item, MovieType, '404', 1)

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
      lastMetadataUpdate: Number(new Date()),
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

  public addImages(item: Movie): Promise<Movie> {
    return this.addTmdbImages(item)
      .catch((item) => this.addOmdbImages(item))
      .catch((item) => this.addFanartImages(item))
      .catch((item) => item)
  }

  public addTorrents(item: Movie, torrents: ScrapedTorrent[]): Promise<Movie> {
    item.torrents = formatTorrents(item.torrents, torrents)

    return Promise.resolve(item)
  }

  public async addItemToDatabase(item: Movie): Promise<void> {
    this.logger.log(`'${item.title}' is a new movie!`)

    await this.movieModel.create(item)
  }

  public async updateItemInDatabase(item: Movie, hadMetadataUpdate = false): Promise<void> {
    this.logger.log(`'${item.title}' is an existing movie!`)

    // Also update the updated at timestamp
    item.updatedAt = Number(new Date())

    if (hadMetadataUpdate) {
      item.lastMetadataUpdate = Number(new Date())
    }

    await this.movieModel.findByIdAndUpdate(item._id, item)
  }

  private async addTmdbImages(item: Movie): Promise<Movie | Show> {
    item.images = await this.tmdbService.getMovieImages(item)

    return this.checkImages(item)
  }

  private async addOmdbImages(item: Movie): Promise<Movie | Show> {
    item.images = await this.omdbService.getMovieImages(item)

    return this.checkImages(item)
  }

  private async addFanartImages(item: Movie): Promise<Movie | Show> {
    item.images = await this.fanartService.getMovieImages(item)

    return this.checkImages(item)
  }

}
