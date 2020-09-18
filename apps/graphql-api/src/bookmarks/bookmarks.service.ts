import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Movie, Show, Content } from '@pct-org/mongo-models'

import { BookmarksArgs } from './dto/bookmarks.args'
import { NewBookmarkInput } from './dto/new-bookmark.input'

@Injectable()
export class BookmarksService {

  constructor(
    @InjectModel('Movies') private readonly movieModel: Model<Movie>,
    @InjectModel('Shows') private readonly showModel: Model<Show>
  ) {}

  async findAll(bookmarksArgs: BookmarksArgs): Promise<Content[]> {
    const movies = await this.findAllMovies(bookmarksArgs)
    const shows = await this.findAllShows(bookmarksArgs)

    // Return all bookmarks at once
    return [
      ...movies,
      ...shows
    ].sort((itemA, itemB) => itemB.bookmarkedOn - itemA.bookmarkedOn)
    // .slice(bookmarksArgs.offset, bookmarksArgs.offset + bookmarksArgs.limit)
  }

  async findAllMovies(bookmarksArgs: BookmarksArgs): Promise<Content[]> {
    return this.movieModel.find(
      this.getQuery(bookmarksArgs),
      {},
      {
        lean: true
      }
    )
  }

  async findAllShows(bookmarksArgs: BookmarksArgs): Promise<Content[]> {
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
  async updateBookmark(addBookmarksArgs: NewBookmarkInput, add): Promise<Content> {
    return await (
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
        new: true // Return the new updated object
      }
    )
  }

  /**
   * Get's the correct query to get the correct bookmarks
   * @param bookmarksArgs
   */
  private getQuery(bookmarksArgs: BookmarksArgs): object {
    if (bookmarksArgs.query && bookmarksArgs.query.trim().length > 0) {
      return {
        bookmarked: true,
        title: {
          // Update the query to make it better searchable
          $regex: bookmarksArgs.query.split(' ').join('.+'),
          $options: 'i'
        }
      }
    }

    return {
      bookmarked: true
    }
  }
}
