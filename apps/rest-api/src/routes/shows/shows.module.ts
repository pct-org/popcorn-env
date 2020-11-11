import { Module } from '@nestjs/common'

import { ShowsController } from './shows.controller'

@Module({
  providers: [],
  controllers: [
    ShowsController
  ]
})
export class ShowsModule {
}
