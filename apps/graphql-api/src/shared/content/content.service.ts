import { ContentsArgs } from './dto/contents.args'

export abstract class ContentService {

  protected getOptions(contentArgs: ContentsArgs, lean = true): object {
    return {
      skip: contentArgs.offset,
      limit: contentArgs.limit,
      sort: this.getSorting(contentArgs),
      lean
    }
  }

  protected getQuery(contentArgs: ContentsArgs): object {
    let query = {}

    if (contentArgs.noBookmarks) {
      query = {
        bookmarked: false
      }
    }

    if (contentArgs.query && contentArgs.query.trim().length > 0) {
      // TODO:: Maybe implement Text index for improved search?
      query = {
        ...query,
        title: {
          // Update the query to make it better searchable
          $regex: contentArgs.query.split(' ').join('.+'),
          $options: 'i'
        }
      }
    }

    return query
  }

  protected getSorting(contentArgs: ContentsArgs): object {
    const order = -1

    switch (contentArgs.sort) {
      case 'name':
        return {
          title: order
        }
      case 'rating':
        return {
          'rating.votes': order,
          'rating.percentage': order
        }

      case 'released':
        return {
          latestEpisode: order,
          released: order
        }

      case 'trending':
        return {
          'rating.watching': order
        }

      case 'year':
        return {
          year: order
        }

      default:
        return {
          'rating.votes': order,
          'rating.precentage': order,
          'rating.watching': order
        }
    }
  }
}
