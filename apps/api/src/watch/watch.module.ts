import { Module } from '@nestjs/common'
import { WatchController } from './watch.controller'

@Module({
  controllers: [
    WatchController
  ],
})
export class WatchModule {
}
