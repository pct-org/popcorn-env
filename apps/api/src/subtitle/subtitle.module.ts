import { Module } from '@nestjs/common'

import { SubtitleController } from './subtitle.controller'

@Module({
  controllers: [
    SubtitleController
  ],
})
export class SubtitleModule {
}
