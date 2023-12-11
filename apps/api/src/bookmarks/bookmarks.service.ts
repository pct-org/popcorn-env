import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { MovieDocument, MOVIES_TYPE } from '@pct-org/types/movie'
import { ShowDocument, SHOWS_TYPE } from '@pct-org/types/show'
import { Content } from '@pct-org/types/shared'

import type { Model } from 'mongoose'

import { BookmarksArgs } from './dto/bookmarks.args'
import { NewBookmarkInput } from './dto/new-bookmark.input'

@Injectable()
export class BookmarksService {

  @InjectModel('Movies')
  private readonly movieModel: Model<MovieDocument>

  @InjectModel('Shows')
  private readonly showModel: Model<ShowDocument>

  public async findAll(bookmarksArgs: BookmarksArgs): Promise<Content[]> {
    const movies = ['none', MOVIES_TYPE].includes(bookmarksArgs.filter)
      ? await this.findAllMovies(bookmarksArgs)
      : []

    const shows = ['none', SHOWS_TYPE].includes(bookmarksArgs.filter)
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
    const update = {
      bookmarked: add,
      bookmarkedOn: add
        ? Number(new Date())
        : null
    }

    const options = {
      new: true, // Return the new updated object
      lean: true
    }

    if (addBookmarksArgs.type === 'movie') {
      return this.movieModel.findByIdAndUpdate(addBookmarksArgs._id, update, options)

    } else {
      return this.showModel.findByIdAndUpdate(addBookmarksArgs._id, update, options)
    }
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
          $regex: bookmarksArgs.query.trim()
            .split(' ')
            .join('.+'),
          $options: 'i'
        }
      }
    }

    return {
      bookmarked: true
    }
  }
}
