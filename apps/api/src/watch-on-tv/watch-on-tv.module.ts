import { Module } from '@nestjs/common'

import { WatchOnTvResolver } from './watch-on-tv.resolver'

@Module({
  providers: [WatchOnTvResolver]
})
export class WatchOnTvModule {
}
