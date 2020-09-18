import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql'

import { PubSubService } from '../shared/pub-sub/pub-sub.service'

import { WatchOnTv } from './watch-on-tv.object-type'

@Resolver(of => WatchOnTv)
export class WatchOnTvResolver {

  static TRIGGER_TV = 'watchTv'
  static TRIGGER_MOBILE = 'watchMobile'

  constructor(
    private readonly pubSubService: PubSubService
  ) {}

  @Mutation(returns => WatchOnTv)
  async commandToTv(
    @Args('command') command: string,
    @Args('_id') _id: string,
    @Args('quality') quality: string,
    @Args('itemType') itemType: string,
    @Args({ name: 'torrentType', nullable: true, type: () => String }) torrentType: string
  ): Promise<WatchOnTv> {
    await this.pubSubService.publish(WatchOnTvResolver.TRIGGER_TV, {
      [WatchOnTvResolver.TRIGGER_TV]: {
        command,
        _id,
        quality,
        itemType,
        torrentType
      }
    })

    return {
      command,
      _id,
      quality,
      itemType,
      torrentType
    }
  }

  @Mutation(returns => WatchOnTv)
  async commandToMobile(
    @Args('command') command: string
  ): Promise<WatchOnTv> {
    await this.pubSubService.publish(WatchOnTvResolver.TRIGGER_MOBILE, {
      [WatchOnTvResolver.TRIGGER_MOBILE]: {
        command
      }
    })

    return {
      command
    }
  }

  @Subscription(returns => WatchOnTv)
  watchTv() {
    return this.pubSubService.asyncIterator(WatchOnTvResolver.TRIGGER_TV)
  }

  @Subscription(returns => WatchOnTv)
  watchMobile() {
    return this.pubSubService.asyncIterator(WatchOnTvResolver.TRIGGER_MOBILE)
  }

}
