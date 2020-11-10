import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { TYPE_MOVIES, TYPE_SHOWS } from '@pct-org/constants/item-types'
import { MovieModel, ShowModel, Content } from '@pct-org/mongo-models'

import { BookmarksArgs } from './dto/bookmarks.args'
import { NewBookmarkInput } from './dto/new-bookmark.input'

@Injectable()
export class BookmarksService {

  @InjectModel('Movies')
  private readonly movieModel: MovieModel

  @InjectModel('Shows')
  private readonly showModel: ShowModel

  public async findAll(bookmarksArgs: BookmarksArgs): Promise<Content[]> {
    const movies = ['none', TYPE_MOVIES].includes(bookmarksArgs.filter)
      ? await this.findAllMovies(bookmarksArgs)
      : []

    const shows = ['none', TYPE_SHOWS].includes(bookmarksArgs.filter)
      ? await this.findAllShows(bookmarksArgs)
      : []

    // Return all bookmarks at once
    return [
      ...movies,
      ...shows
    ]
      .sort((itemA, itemB) => {
        // Use [] to get around typescript error
        const itemACompare = itemA?.['latestEpisodeAired'] ?? itemA.bookmarkedOn
        const itemBCompare = itemB?.['latestEpisodeAired'] ?? itemB.bookmarkedOn

        return itemBCompare - itemACompare
      })
  }

  public async findAllMovies(bookmarksArgs: BookmarksArgs): Promise<Content[]> {
    return this.movieModel.find(
      this.getQuery(bookmarksArgs),
      {},
      {
        lean: true
      }
    )
  }

  public async findAllShows(bookmarksArgs: BookmarksArgs): Promise<Content[]> {
    return this.showModel.find(
      this.getQuery(bookmarksArgs),
      {},
      {
        lean: true
      }
    )
  }

  /**
   * Updates an movie or show to be bookmarked
   * @param addBookmarksArgs
   * @param {boolean} add - Do we need to add or remove the bookmark
   */
  public async updateBookmark(addBookmarksArgs: NewBookmarkInput, add: boolean): Promise<Content> {
    return (
      addBookmarksArgs.type === 'movie'
        ? this.movieModel
        : this.showModel

    ).findByIdAndUpdate(
      addBookmarksArgs._id,
      {
        bookmarked: add,
        bookmarkedOn: add
          ? Number(new Date())
          : null
      },
      {
        new: true, // Return the new updated object
        lean: true
      }
    )
  }

  /**
   * Get's the correct query to get the correct bookmarks
   * @param bookmarksArgs
   */
  private getQuery(bookmarksArgs: BookmarksArgs): {
    bookmarked?: boolean,
    title?: {
      $regex: string,
      $options: string
    }
  } {
    if (bookmarksArgs.query && bookmarksArgs.query.trim().length > 0) {
      return {
        bookmarked: true,
        title: {
          // Update the query to make it better searchable
          $regex: bookmarksArgs.query.trim().split(' ').join('.+'),
          $options: 'i'
        }
      }
    }

    return {
      bookmarked: true
    }
  }
}
