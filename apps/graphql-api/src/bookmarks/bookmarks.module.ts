import { Module } from '@nestjs/common'

import { BookmarksResolver } from './bookmarks.resolver'
import { BookmarksService } from './bookmarks.service'

@Module({
  providers: [BookmarksResolver, BookmarksService]
})
export class BookmarksModule {
}
