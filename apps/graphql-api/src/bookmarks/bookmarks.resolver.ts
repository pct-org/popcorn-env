import { Args, Query, Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { Content } from '@pct-org/mongo-models'

import { BookmarksArgs } from './dto/bookmarks.args'
import { BookmarksService } from './bookmarks.service'
import { PubSubService } from '../shared/pub-sub/pub-sub.service'

@Resolver(of => Content)
export class BookmarksResolver {

  constructor(
    private readonly bookmarksService: BookmarksService,
    private readonly pubSubService: PubSubService
  ) {}

  @Query(returns => [Content])
  bookmarks(@Args() bookmarksArgs: BookmarksArgs): Promise<Content[]> {
    return this.bookmarksService.findAll(bookmarksArgs)
  }

  @Mutation(returns => Content)
  async addBookmark(
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

  @Mutation(returns => Content)
  async removeBookmark(
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

  @Subscription(returns => Content)
  bookmarked() {
    return this.pubSubService.asyncIterator('bookmarked')
  }

}
