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

    if (contentArgs.query && contentArgs.query.trim().length > 0) {
      query = {
        ...query,
        title: {
          // Update the query to make it better searchable
          $regex: contentArgs.query.trim().split(' ').join('.+'),
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
          title: 1
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

      case 'added':
        return {
          createdAt: order
        }

      case 'year':
        return {
          year: order
        }

      case 'popularity':
      default:
        return {
          'rating.votes': order,
          'rating.percentage': order,
          'rating.watching': order
        }
    }
  }
}
