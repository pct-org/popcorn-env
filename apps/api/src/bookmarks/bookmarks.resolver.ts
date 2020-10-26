import { Args, Query, Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { Content } from '@pct-org/mongo-models'
import { Inject } from '@nestjs/common'

import { BookmarksArgs } from './dto/bookmarks.args'
import { BookmarksService } from './bookmarks.service'
import { BookmarksUnion } from './bookmarks.union'
import { PubSubService } from '../shared/pub-sub/pub-sub.service'

@Resolver(of => BookmarksUnion)
export class BookmarksResolver {

  @Inject()
  private readonly bookmarksService: BookmarksService

  @Inject()
  private readonly pubSubService: PubSubService

  @Query(returns => [BookmarksUnion], { description: 'Get all the users bookmarks.' })
  public bookmarks(@Args() bookmarksArgs: BookmarksArgs): Promise<Content[]> {
    return this.bookmarksService.findAll(bookmarksArgs)
  }

  @Mutation(returns => BookmarksUnion, { description: 'Add item to bookmarks.' })
  public async addBookmark(
    @Args('_id') _id: string,
    @Args('type') type: string
  ): Promise<Content> {
    const updateBookmark = await this.bookmarksService.updateBookmark({
        _id,
        type
      },
      true
    )

    await this.pubSubService.publish('bookmarked', { bookmarked: updateBookmark })

    return updateBookmark
  }

  @Mutation(returns => BookmarksUnion, { description: 'Remove item from bookmarks.' })
  public async removeBookmark(
    @Args('_id') _id: string,
    @Args('type') type: string
  ): Promise<Content> {
    const updateBookmark = await this.bookmarksService.updateBookmark({
        _id,
        type
      },
      false
    )

    await this.pubSubService.publish('bookmarked', { bookmarked: updateBookmark })

    return updateBookmark
  }

  @Subscription(returns => BookmarksUnion, { description: 'Subscribe to items being added / removed from bookmarks.' })
  public bookmarked() {
    return this.pubSubService.asyncIterator('bookmarked')
  }

}
