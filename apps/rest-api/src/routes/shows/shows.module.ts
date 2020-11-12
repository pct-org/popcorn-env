import { Module } from '@nestjs/common'
import { ShowsService } from '@pct-org/api/shows'

import { ShowsController } from './shows.controller'

@Module({
  providers: [
    ShowsService
  ],
  controllers: [
    ShowsController
  ]
})
export class ShowsModule {
}
